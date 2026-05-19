import { create } from "zustand";
import type { JourneyStep } from "@/lib/constants";
import type { Journey, TravelDocument } from "@/types/journey";
import type { TravelSummary } from "@/types/summary";
import type { ChatMessage } from "@/types/chat";
import type { TravelGuideSchema } from "@/schemas/guide";
import { generateId } from "@/lib/utils";
import {
  saveJourney,
  getJourney,
  saveDocument,
  getDocumentsByJourney,
  saveGuide,
  getGuide,
} from "@/lib/db";

interface JourneyState {
  currentJourney: Journey | null;
  documents: TravelDocument[];
  guide: TravelGuideSchema | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;

  createJourney: () => Promise<Journey>;
  loadJourney: (id: string) => Promise<void>;
  setStep: (step: JourneyStep) => Promise<void>;
  setStatus: (status: Journey["status"]) => Promise<void>;
  addMessage: (message: Omit<ChatMessage, "id" | "createdAt">) => Promise<void>;
  updateLastMessage: (content: string, streaming?: boolean) => Promise<void>;
  setSummary: (summary: TravelSummary) => Promise<void>;
  addDocument: (doc: TravelDocument) => Promise<void>;
  setGuide: (guide: TravelGuideSchema) => Promise<void>;
  setError: (error: string | null) => void;
  setGenerating: (value: boolean) => void;
  reset: () => void;
}

async function persistJourney(journey: Journey) {
  journey.updatedAt = Date.now();
  await saveJourney(journey);
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  currentJourney: null,
  documents: [],
  guide: null,
  isLoading: false,
  isGenerating: false,
  error: null,

  createJourney: async () => {
    const journey: Journey = {
      id: generateId(),
      title: "New trip",
      status: "draft",
      step: "upload",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      documentIds: [],
    };
    await saveJourney(journey);
    set({ currentJourney: journey, documents: [], guide: null, error: null });
    return journey;
  },

  loadJourney: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const journey = await getJourney(id);
      if (!journey) throw new Error("Journey not found");
      const documents = await getDocumentsByJourney(id);
      const guide = await getGuide(id);
      set({
        currentJourney: journey,
        documents,
        guide: guide ?? null,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : "Failed to load",
      });
    }
  },

  setStep: async (step: JourneyStep) => {
    const { currentJourney } = get();
    if (!currentJourney) return;
    const updated = { ...currentJourney, step };
    await persistJourney(updated);
    set({ currentJourney: updated });
  },

  setStatus: async (status: Journey["status"]) => {
    const { currentJourney } = get();
    if (!currentJourney) return;
    const updated = { ...currentJourney, status };
    await persistJourney(updated);
    set({ currentJourney: updated });
  },

  addMessage: async (message) => {
    const { currentJourney } = get();
    if (!currentJourney) return;
    const newMsg: ChatMessage = {
      ...message,
      id: generateId(),
      createdAt: Date.now(),
    };
    const updated = {
      ...currentJourney,
      messages: [...currentJourney.messages, newMsg],
    };
    await persistJourney(updated);
    set({ currentJourney: updated });
  },

  updateLastMessage: async (content: string, streaming = false) => {
    const { currentJourney } = get();
    if (!currentJourney || currentJourney.messages.length === 0) return;
    const messages = [...currentJourney.messages];
    const last = messages[messages.length - 1];
    messages[messages.length - 1] = { ...last, content, streaming };
    const updated = { ...currentJourney, messages };
    await persistJourney(updated);
    set({ currentJourney: updated });
  },

  setSummary: async (summary: TravelSummary) => {
    const { currentJourney } = get();
    if (!currentJourney) return;
    const updated = {
      ...currentJourney,
      summary,
      title: summary.title,
    };
    await persistJourney(updated);
    set({ currentJourney: updated });
  },

  addDocument: async (doc: TravelDocument) => {
    await saveDocument(doc);
    const { currentJourney, documents } = get();
    if (currentJourney) {
      const updated = {
        ...currentJourney,
        documentIds: [...currentJourney.documentIds, doc.id],
      };
      await persistJourney(updated);
      set({
        currentJourney: updated,
        documents: [...documents, doc],
      });
    } else {
      set({ documents: [...documents, doc] });
    }
  },

  setGuide: async (guide: TravelGuideSchema) => {
    const { currentJourney } = get();
    if (!currentJourney) return;
    await saveGuide(currentJourney.id, guide);
    const updated = {
      ...currentJourney,
      status: "ready" as const,
      step: "guide" as JourneyStep,
    };
    await persistJourney(updated);
    set({ guide, currentJourney: updated });
  },

  setError: (error) => set({ error }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  reset: () =>
    set({
      currentJourney: null,
      documents: [],
      guide: null,
      error: null,
      isGenerating: false,
    }),
}));
