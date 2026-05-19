"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, StepHeader } from "@/components/layout/app-shell";
import { DocumentDropzone } from "@/components/upload/document-dropzone";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useJourneyStore } from "@/stores/journey-store";
import { ShieldAlert } from "lucide-react";

export function UploadStep({ onContinue }: { onContinue: () => void }) {
  const [passportWarning, setPassportWarning] = useState(false);
  const { currentJourney, documents, setStep } = useJourneyStore();

  if (!currentJourney) return null;

  return (
    <AppShell className="flex min-h-[100dvh] flex-col">
      <div className="flex min-h-[100dvh] w-full flex-col px-5 pb-[max(24px,var(--safe-bottom))] pt-[max(16px,var(--safe-top))]">
        <StepHeader
          title="Upload documents"
          subtitle="Boarding passes, tickets, confirmations — we'll read the logistics."
          size="large"
        />

        <motion.div
          className="mt-10 flex-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DocumentDropzone
            journeyId={currentJourney.id}
            onPassportBlocked={() => setPassportWarning(true)}
          />
        </motion.div>

        <motion.div
          className="mt-auto pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            fullWidth
            size="lg"
            variant={documents.length > 0 ? "gradient" : "default"}
            onClick={async () => {
              await setStep("interview");
              onContinue();
            }}
          >
            {documents.length > 0 ? "Continue to interview" : "Skip for now"}
          </Button>
        </motion.div>
      </div>

      <Dialog open={passportWarning} onOpenChange={setPassportWarning}>
        <DialogContent>
          <div className="text-center">
            <ShieldAlert className="mx-auto mb-5 h-12 w-12 text-[#ff3b30]" strokeWidth={1.5} />
            <h3 className="text-[22px] font-semibold tracking-[-0.02em]">
              Passport not allowed
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-[var(--foreground-secondary)]">
              For privacy and security, passport photos cannot be uploaded.
            </p>
            <Button
              className="mt-8"
              fullWidth
              onClick={() => setPassportWarning(false)}
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
