"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_UPLOAD_SIZE } from "@/lib/constants";
import { resolveDocumentKind } from "@/lib/file-utils";
import { processTravelDocument } from "@/ai/document-processor";
import { useSettingsStore } from "@/stores/settings-store";
import { useJourneyStore } from "@/stores/journey-store";
import { generateId } from "@/lib/utils";
import type { TravelDocument } from "@/types/journey";

const DROPZONE_ACCEPT = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
} as const;

interface DocumentDropzoneProps {
  journeyId: string;
  onPassportBlocked: (reason?: string) => void;
}

export function DocumentDropzone({
  journeyId,
  onPassportBlocked,
}: DocumentDropzoneProps) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const getApiKey = useSettingsStore((s) => s.getApiKey);
  const allDocuments = useJourneyStore((s) => s.documents);
  const addDocument = useJourneyStore((s) => s.addDocument);
  const documents = allDocuments.filter((d) => d.journeyId === journeyId);

  const processFiles = useCallback(
    async (files: File[]) => {
      const apiKey = getApiKey();
      setError(null);

      for (const file of files) {
        if (file.size > MAX_UPLOAD_SIZE) {
          setError(`${file.name} is too large (max 15 MB).`);
          continue;
        }

        if (!resolveDocumentKind(file)) {
          setError(`${file.name}: use PDF, JPG, PNG, or WEBP.`);
          continue;
        }

        setProcessing(file.name);

        try {
          const result = await processTravelDocument(file, apiKey);

          if (result.passportBlocked) {
            onPassportBlocked(result.blockReason);
            continue;
          }

          const doc: TravelDocument = {
            id: generateId(),
            journeyId,
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            uploadedAt: Date.now(),
            extractedText: result.text || undefined,
            previewDataUrl: result.previewDataUrl,
          };
          await addDocument(doc);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Could not process this file.";
          setError(message);
        } finally {
          setProcessing(null);
        }
      }
    },
    [journeyId, getApiKey, addDocument, onPassportBlocked]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      void processFiles(acceptedFiles);
    },
    [processFiles]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const first = rejections[0];
    if (!first) return;
    const err = first.errors[0];
    if (err?.code === "file-too-large") {
      setError("File is too large (max 15 MB).");
    } else if (err?.code === "file-invalid-type") {
      setError("Use PDF, JPG, PNG, or WEBP.");
    } else {
      setError(err?.message ?? "Could not add this file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: DROPZONE_ACCEPT,
    maxSize: MAX_UPLOAD_SIZE,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="w-full space-y-8">
      <div
        {...getRootProps({
          onClick: (e) => {
            e.stopPropagation();
            open();
          },
        })}
        className={cn(
          "flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-[28px] px-6 py-12 text-center transition-colors duration-300",
          isDragActive
            ? "bg-[var(--gradient-soft)]"
            : "bg-[var(--background-elevated)] active:scale-[0.995]"
        )}
      >
        <input {...getInputProps()} className="sr-only" />
        <motion.div
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <Upload
            className="mx-auto mb-4 h-8 w-8 text-[var(--foreground-tertiary)]"
            strokeWidth={1.5}
          />
        </motion.div>
        <p className="text-[18px] font-medium text-[var(--foreground)]">
          Add travel documents
        </p>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-[var(--foreground-secondary)]">
          PDFs, boarding passes, tickets, confirmations
        </p>
        <p className="mt-4 text-[14px] text-[var(--foreground-tertiary)]">
          Tap to browse or drag files here
        </p>
      </div>

      {error && (
        <p className="text-[15px] text-[#ff3b30]" role="alert">
          {error}
        </p>
      )}

      <AnimatePresence mode="popLayout">
        {processing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 py-2"
          >
            <Loader2 className="h-5 w-5 animate-spin text-[var(--foreground-tertiary)]" />
            <p className="text-[16px] text-[var(--foreground-secondary)]">
              Processing {processing}…
            </p>
          </motion.div>
        )}

        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 py-4"
          >
            <motion.div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {doc.mimeType.startsWith("image/") ? (
                <ImageIcon className="h-5 w-5 text-[var(--foreground-secondary)]" />
              ) : (
                <FileText className="h-5 w-5 text-[var(--foreground-secondary)]" />
              )}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-medium text-[var(--foreground)]">
                {doc.name}
              </p>
              {doc.extractedText ? (
                <p className="mt-0.5 truncate text-[14px] text-[var(--foreground-secondary)]">
                  {doc.extractedText.slice(0, 72)}…
                </p>
              ) : (
                <p className="mt-0.5 text-[14px] text-[var(--foreground-tertiary)]">
                  Added
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
