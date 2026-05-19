"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideTimelineItem, GuideAlert } from "@/schemas/guide";

const alertTones = {
  info: "text-[#007aff]",
  warning: "text-[#ff9500]",
  critical: "text-[#ff3b30]",
  tip: "text-[var(--foreground-secondary)]",
};

function AlertBlock({ alert }: { alert: GuideAlert }) {
  return (
    <div className={cn("py-3", alertTones[alert.type])}>
      <p className="text-[15px] font-medium">{alert.title}</p>
      <p className="mt-1 text-[15px] leading-relaxed opacity-85">{alert.body}</p>
    </div>
  );
}

export function TimelineCard({
  item,
  index = 0,
}: {
  item: GuideTimelineItem;
  index?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand =
    item.expandable !== false && (item.details?.length || item.body);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full pl-8"
    >
      {/* Gradient progress rail */}
      <motion.div
        className="absolute left-[11px] top-3 bottom-0 w-[3px] rounded-full opacity-40"
        style={{ background: "var(--gradient-brand)" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
        aria-hidden
      />
      <motion.div
        className="absolute left-0 top-2 h-6 w-6 rounded-full gradient-fill"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        aria-hidden
      />

      <motion.div className="w-full py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-[var(--foreground-tertiary)]">
              {item.time}
            </p>
            <h3 className="mt-1 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="mt-1 text-[16px] text-[var(--foreground-secondary)]">
                {item.subtitle}
              </p>
            )}
          </div>
          {item.duration && (
            <span className="shrink-0 rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[13px] font-medium text-[var(--foreground-secondary)]">
              {item.duration}
            </span>
          )}
        </div>

        {item.body && !canExpand && (
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--foreground-secondary)]">
            {item.body}
          </p>
        )}

        {item.alerts?.map((a) => (
          <AlertBlock key={a.id} alert={a} />
        ))}

        {item.checklist && (
          <ul className="mt-4 space-y-3">
            {item.checklist.map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-3 text-[16px] text-[var(--foreground-secondary)]"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--foreground-tertiary)]" />
                {c.label}
              </li>
            ))}
          </ul>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {item.body && (
                <p className="mt-4 text-[16px] leading-relaxed text-[var(--foreground-secondary)]">
                  {item.body}
                </p>
              )}
              {item.details?.map((d, i) => (
                <p
                  key={i}
                  className="mt-3 text-[16px] leading-relaxed text-[var(--foreground-secondary)]"
                >
                  {d}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {canExpand && (
          <motion.button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-1 text-[15px] font-medium text-[var(--foreground-secondary)]"
            whileTap={{ scale: 0.98 }}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                expanded && "rotate-180"
              )}
            />
            {expanded ? "Show less" : "More detail"}
          </motion.button>
        )}
      </motion.div>
    </motion.article>
  );
}
