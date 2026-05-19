import OpenAI from "openai";
import { OPENAI_MODELS } from "@/lib/constants";
import { estimateTokens, sleep } from "@/lib/utils";

export class AIClientError extends Error {
  constructor(
    message: string,
    public code: "no_key" | "rate_limit" | "invalid_key" | "network" | "unknown",
    public retryable = false
  ) {
    super(message);
    this.name = "AIClientError";
  }
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullText: string, usage?: { prompt: number; completion: number }) => void;
  onError: (error: Error) => void;
}

function createClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

function mapOpenAIError(err: unknown): AIClientError {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401) {
      return new AIClientError("Invalid API key.", "invalid_key");
    }
    if (err.status === 429) {
      return new AIClientError("Rate limit reached. Try again shortly.", "rate_limit", true);
    }
  }
  if (err instanceof Error && err.message.includes("fetch")) {
    return new AIClientError("Network error. Check your connection.", "network", true);
  }
  return new AIClientError(
    err instanceof Error ? err.message : "Something went wrong.",
    "unknown",
    true
  );
}

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const mapped = mapOpenAIError(e);
      if (!mapped.retryable || i === maxRetries) throw mapped;
      await sleep(1000 * (i + 1));
    }
  }
  throw mapOpenAIError(lastError);
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  const client = createClient(apiKey);
  try {
    await withRetry(() => client.models.list());
    return true;
  } catch (e) {
    const mapped = mapOpenAIError(e);
    if (mapped.code === "invalid_key") return false;
    throw mapped;
  }
}

export async function streamChat(
  apiKey: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  callbacks: StreamCallbacks,
  options?: { model?: string; maxTokens?: number }
): Promise<void> {
  const client = createClient(apiKey);
  const model = options?.model ?? OPENAI_MODELS.chat;

  try {
    const stream = await withRetry(() =>
      client.chat.completions.create({
        model,
        messages,
        stream: true,
        max_tokens: options?.maxTokens ?? 2048,
      })
    );

    let fullText = "";
    let promptTokens = estimateTokens(JSON.stringify(messages));
    let completionTokens = 0;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        fullText += delta;
        completionTokens += estimateTokens(delta);
        callbacks.onToken(delta);
      }
    }

    callbacks.onDone(fullText, {
      prompt: promptTokens,
      completion: completionTokens,
    });
  } catch (e) {
    callbacks.onError(mapOpenAIError(e));
  }
}

export async function completeChat(
  apiKey: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { model?: string; json?: boolean }
): Promise<string> {
  const client = createClient(apiKey);
  const model = options?.model ?? OPENAI_MODELS.chat;

  const response = await withRetry(() =>
    client.chat.completions.create({
      model,
      messages,
      max_tokens: 4096,
      response_format: options?.json ? { type: "json_object" } : undefined,
    })
  );

  return response.choices[0]?.message?.content ?? "";
}

export async function analyzeImage(
  apiKey: string,
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const client = createClient(apiKey);
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  const response = await withRetry(() =>
    client.chat.completions.create({
      model: OPENAI_MODELS.vision,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
          ],
        },
      ],
      max_tokens: 300,
      response_format: { type: "json_object" },
    })
  );

  return response.choices[0]?.message?.content ?? "{}";
}

export function parseJSON<T>(text: string): T | null {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}
