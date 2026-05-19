"use client";

import { useCallback, useState } from "react";
import { streamChat } from "@/ai/client";
import { INTERVIEW_SYSTEM } from "@/ai/prompts";
import { useSettingsStore } from "@/stores/settings-store";
import { useJourneyStore } from "@/stores/journey-store";
export function useInterview() {
  const [isStreaming, setIsStreaming] = useState(false);
  const getApiKey = useSettingsStore((s) => s.getApiKey);
  const addTokenUsage = useSettingsStore((s) => s.addTokenUsage);
  const { currentJourney, documents, addMessage, updateLastMessage, setStatus } =
    useJourneyStore();

  const buildContext = useCallback(() => {
    const docContext = documents
      .filter((d) => d.extractedText)
      .map((d) => `--- ${d.name} ---\n${d.extractedText}`)
      .join("\n\n");
    return docContext
      ? `Uploaded documents:\n${docContext}`
      : "No documents uploaded yet.";
  }, [documents]);

  const startInterview = useCallback(async () => {
    const apiKey = getApiKey();
    if (!apiKey || !currentJourney) return;

    await setStatus("interviewing");
    await addMessage({ role: "assistant", content: "", streaming: true });

    const messages = [
      { role: "system" as const, content: INTERVIEW_SYSTEM },
      {
        role: "user" as const,
        content: `${buildContext()}\n\nBegin the interview. Ask your first concise question.`,
      },
    ];

    setIsStreaming(true);

    await streamChat(apiKey, messages, {
      onToken: (token) => {
        const msgs = useJourneyStore.getState().currentJourney?.messages ?? [];
        const last = msgs[msgs.length - 1];
        updateLastMessage((last?.content ?? "") + token, true);
      },
      onDone: async (fullText, usage) => {
        if (usage) addTokenUsage(usage.prompt + usage.completion);
        await updateLastMessage(fullText, false);
        setIsStreaming(false);
      },
      onError: async (err) => {
        await updateLastMessage(
          "I had trouble connecting. Check your API key and try again.",
          false
        );
        useJourneyStore.getState().setError(err.message);
        setIsStreaming(false);
      },
    });
  }, [
    getApiKey,
    currentJourney,
    buildContext,
    addMessage,
    updateLastMessage,
    setStatus,
    addTokenUsage,
  ]);

  const sendMessage = useCallback(
    async (userText: string) => {
      const apiKey = getApiKey();
      if (!apiKey || !currentJourney) return;

      await addMessage({ role: "user", content: userText });
      await addMessage({ role: "assistant", content: "", streaming: true });
      setIsStreaming(true);

      const history: { role: "user" | "assistant" | "system"; content: string }[] =
        [
          { role: "system", content: INTERVIEW_SYSTEM },
          {
            role: "user",
            content: `Context from documents:\n${buildContext()}`,
          },
        ];

      for (const msg of currentJourney.messages) {
        if (msg.role === "user" || msg.role === "assistant") {
          history.push({ role: msg.role, content: msg.content });
        }
      }
      history.push({ role: "user", content: userText });

      await streamChat(apiKey, history, {
        onToken: (token) => {
          const msgs = useJourneyStore.getState().currentJourney?.messages ?? [];
          const last = msgs[msgs.length - 1];
          updateLastMessage((last?.content ?? "") + token, true);
        },
        onDone: async (fullText, usage) => {
          if (usage) addTokenUsage(usage.prompt + usage.completion);
          await updateLastMessage(fullText, false);
          setIsStreaming(false);

          if (fullText.includes("[INTERVIEW_COMPLETE]")) {
            await useJourneyStore.getState().setStep("approval");
            await setStatus("approval");
          }
        },
        onError: async (err) => {
          await updateLastMessage("Connection issue. Please try again.", false);
          useJourneyStore.getState().setError(err.message);
          setIsStreaming(false);
        },
      });
    },
    [
      getApiKey,
      currentJourney,
      buildContext,
      addMessage,
      updateLastMessage,
      setStatus,
      addTokenUsage,
    ]
  );

  const isComplete =
    currentJourney?.messages.some((m) =>
      m.content.includes("[INTERVIEW_COMPLETE]")
    ) ?? false;

  return { startInterview, sendMessage, isStreaming, isComplete };
}
