import { PASSPORT_VISION_PROMPT } from "./prompts";
import { analyzeImage, parseJSON } from "./client";

const MRZ_PATTERN = /P<[A-Z]{3}[A-Z<]{39}/;
const PASSPORT_KEYWORDS = [
  "passport",
  "nationality",
  "date of birth",
  "place of birth",
  "issuing authority",
  "machine readable",
];
const MRZ_LINE_PATTERN = /^[A-Z0-9<]{30,}$/m;

export interface PassportDetectionResult {
  blocked: boolean;
  reason?: string;
  confidence: number;
}

function detectMRZInText(text: string): boolean {
  const upper = text.toUpperCase();
  if (MRZ_PATTERN.test(upper)) return true;
  const lines = upper.split("\n");
  let mrzLines = 0;
  for (const line of lines) {
    if (MRZ_LINE_PATTERN.test(line.trim()) && line.includes("<")) {
      mrzLines++;
    }
  }
  return mrzLines >= 2;
}

function heuristicPassportScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  if (detectMRZInText(text)) score += 0.6;
  for (const kw of PASSPORT_KEYWORDS) {
    if (lower.includes(kw)) score += 0.08;
  }
  if (/\bpassport\s*no\b/i.test(text) && lower.includes("surname")) score += 0.15;
  return Math.min(score, 1);
}

export async function detectPassportImage(
  apiKey: string | null,
  imageBase64: string,
  mimeType: string,
  ocrText?: string
): Promise<PassportDetectionResult> {
  const heuristicScore = ocrText ? heuristicPassportScore(ocrText) : 0;

  if (heuristicScore >= 0.75) {
    return {
      blocked: true,
      reason: "Document appears to be a passport (MRZ/layout detected).",
      confidence: heuristicScore,
    };
  }

  if (!apiKey) {
    return { blocked: false, confidence: 0 };
  }

  try {
    const raw = await analyzeImage(
      apiKey,
      imageBase64,
      mimeType,
      PASSPORT_VISION_PROMPT
    );
    const parsed = parseJSON<{
      isPassportImage: boolean;
      confidence: number;
      reason?: string;
    }>(raw);

    if (parsed?.isPassportImage && (parsed.confidence ?? 0) >= 0.7) {
      return {
        blocked: true,
        reason: parsed.reason ?? "Passport image detected.",
        confidence: parsed.confidence,
      };
    }
  } catch {
    if (heuristicScore >= 0.55) {
      return {
        blocked: true,
        reason: "Document may be a passport.",
        confidence: heuristicScore,
      };
    }
  }

  return { blocked: false, confidence: heuristicScore };
}
