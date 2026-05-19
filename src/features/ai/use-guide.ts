"use client";

import { useCallback } from "react";
import { completeChat, parseJSON } from "@/ai/client";
import {
  GUIDE_GENERATION_SYSTEM,
  GUIDE_EDIT_SYSTEM,
} from "@/ai/prompts";
import { GUIDE_JSON_INSTRUCTION, travelGuideSchema } from "@/schemas/guide";
import { SUMMARY_SYSTEM } from "@/ai/prompts";
import { useSettingsStore } from "@/stores/settings-store";
import { useJourneyStore } from "@/stores/journey-store";
import type { TravelSummary } from "@/types/summary";

export function useGuide() {
  const getApiKey = useSettingsStore((s) => s.getApiKey);
  const addTokenUsage = useSettingsStore((s) => s.addTokenUsage);
  const {
    currentJourney,
    documents,
    guide,
    setSummary,
    setGuide,
    setGenerating,
    setError,
  } = useJourneyStore();

  const buildContext = () => {
    const msgs =
      currentJourney?.messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n") ?? "";
    const docs = documents
      .map((d) => d.extractedText)
      .filter(Boolean)
      .join("\n\n");
    return `Conversation:\n${msgs}\n\nDocuments:\n${docs}`;
  };

  const generateSummary = useCallback(async (): Promise<TravelSummary | null> => {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    const raw = await completeChat(
      apiKey,
      [
        { role: "system", content: SUMMARY_SYSTEM },
        { role: "user", content: buildContext() },
      ],
      { json: true }
    );

    const parsed = parseJSON<TravelSummary>(raw);
    if (parsed) {
      parsed.generatedAt = Date.now();
      await setSummary(parsed);
    }
    return parsed;
  }, [getApiKey, currentJourney, documents, setSummary]);

  const generateGuide = useCallback(async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;

    setGenerating(true);
    setError(null);

    try {
      if (!currentJourney?.summary) {
        await generateSummary();
      }

      const summary = useJourneyStore.getState().currentJourney?.summary;
      const raw = await completeChat(
        apiKey,
        [
          { role: "system", content: `${GUIDE_GENERATION_SYSTEM}\n\n${GUIDE_JSON_INSTRUCTION}` },
          {
            role: "user",
            content: `Generate the travel execution guide.\n\n${buildContext()}\n\nSummary: ${JSON.stringify(summary)}`,
          },
        ],
        { model: "gpt-4o", json: true }
      );

      const parsed = parseJSON(raw);
      const validated = travelGuideSchema.safeParse(parsed);
      if (!validated.success) {
        throw new Error("Guide format invalid. Try again.");
      }
      await setGuide(validated.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate guide");
    } finally {
      setGenerating(false);
    }
  }, [
    getApiKey,
    currentJourney,
    generateSummary,
    setGuide,
    setGenerating,
    setError,
  ]);

  const editGuide = useCallback(
    async (instruction: string) => {
      const apiKey = getApiKey();
      if (!apiKey || !guide) return;

      setGenerating(true);
      setError(null);

      try {
        const raw = await completeChat(
          apiKey,
          [
            {
              role: "system",
              content: `${GUIDE_EDIT_SYSTEM}\n\n${GUIDE_JSON_INSTRUCTION}`,
            },
            {
              role: "user",
              content: `Current guide:\n${JSON.stringify(guide)}\n\nUser request: ${instruction}`,
            },
          ],
          { model: "gpt-4o", json: true }
        );

        const parsed = parseJSON(raw);
        const validated = travelGuideSchema.safeParse(parsed);
        if (!validated.success) throw new Error("Edit failed. Try again.");
        await setGuide(validated.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to edit guide");
      } finally {
        setGenerating(false);
      }
    },
    [getApiKey, guide, setGuide, setGenerating, setError]
  );

  return { generateSummary, generateGuide, editGuide };
}
