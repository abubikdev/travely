import type { JourneyStep } from "@/lib/constants";
import type { ChatMessage } from "./chat";
import type { TravelSummary } from "./summary";

export type JourneyStatus =
  | "draft"
  | "uploading"
  | "interviewing"
  | "approval"
  | "generating"
  | "ready";

export interface Journey {
  id: string;
  title: string;
  status: JourneyStatus;
  step: JourneyStep;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  summary?: TravelSummary;
  documentIds: string[];
}

export interface TravelDocument {
  id: string;
  journeyId: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedAt: number;
  extractedText?: string;
  previewDataUrl?: string;
  blocked?: boolean;
  blockReason?: string;
}
