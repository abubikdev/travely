import { detectPassportImage } from "./passport-detection";
import {
  resolveDocumentKind,
  resolveMimeType,
  type DocumentFileKind,
} from "@/lib/file-utils";

export interface ProcessedDocument {
  text: string;
  previewDataUrl?: string;
  passportBlocked: boolean;
  blockReason?: string;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function configurePdfWorker(pdfjs: typeof import("pdfjs-dist")) {
  const version = pdfjs.version;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  await configurePdfWorker(pdfjs);
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items.map((item) => ("str" in item ? item.str : "")).join(" ")
    );
  }
  return pages.join("\n");
}

async function extractImageText(
  file: File
): Promise<{ text: string; dataUrl: string }> {
  const Tesseract = (await import("tesseract.js")).default;
  const dataUrl = await fileToDataUrl(file);
  const result = await Tesseract.recognize(dataUrl, "eng", {
    logger: () => {},
  });
  return { text: result.data.text, dataUrl };
}

function dataUrlToBase64(dataUrl: string): string {
  const idx = dataUrl.indexOf(",");
  return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
}

export async function processTravelDocument(
  file: File,
  apiKey: string | null
): Promise<ProcessedDocument> {
  if (typeof window === "undefined") {
    throw new Error("Document processing is only available in the browser");
  }

  const kind = resolveDocumentKind(file);
  if (!kind) {
    throw new Error("Unsupported file type. Use PDF, JPG, PNG, or WEBP.");
  }

  const mimeType = resolveMimeType(file, kind);
  let text = "";
  let previewDataUrl: string | undefined;
  let imageBase64: string | undefined;

  if (kind === "pdf") {
    text = await extractPdfText(file);
    if (text.length < 50) {
      previewDataUrl = await fileToDataUrl(file);
    }
  } else {
    const extracted = await extractImageText(file);
    text = extracted.text;
    previewDataUrl = extracted.dataUrl;
    imageBase64 = dataUrlToBase64(extracted.dataUrl);
  }

  if (kind === "image" && imageBase64) {
    const detection = await detectPassportImage(
      apiKey,
      imageBase64,
      mimeType,
      text
    );
    if (detection.blocked) {
      return {
        text: "",
        previewDataUrl,
        passportBlocked: true,
        blockReason: detection.reason,
      };
    }
  }

  if (kind === "pdf" && text) {
    const heuristicOnly = await detectPassportImage(apiKey, "", mimeType, text);
    if (heuristicOnly.blocked && heuristicOnly.confidence >= 0.8) {
      return {
        text: "",
        passportBlocked: true,
        blockReason:
          "This PDF appears to contain a passport scan. Upload booking confirmations or tickets instead.",
      };
    }
  }

  return {
    text: text.slice(0, 12000),
    previewDataUrl,
    passportBlocked: false,
  };
}
