"use client";

import { motion } from "framer-motion";
import { TimelineCard } from "./timeline-card";
import type { TravelGuideSchema } from "@/schemas/guide";

interface GuideRendererProps {
  guide: TravelGuideSchema;
}

export function GuideRenderer({ guide }: GuideRendererProps) {
  let itemIndex = 0;

  return (
    <motion.div
      className="w-full pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <header className="mb-10">
        <motion.h1
          className="text-[32px] font-semibold leading-[1.1] tracking-[-0.03em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {guide.title}
        </motion.h1>
        {guide.subtitle && (
          <p className="mt-2 text-[18px] leading-relaxed text-[var(--foreground-secondary)]">
            {guide.subtitle}
          </p>
        )}
        {guide.heroNote && (
          <motion.p
            className="mt-6 text-[17px] leading-relaxed gradient-text font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {guide.heroNote}
          </motion.p>
        )}
      </header>

      {guide.globalAlerts?.map((alert, i) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="mb-8 py-2"
        >
          <p className="text-[15px] font-semibold text-[#ff9500]">{alert.title}</p>
          <p className="mt-1 text-[16px] leading-relaxed text-[var(--foreground-secondary)]">
            {alert.body}
          </p>
        </motion.div>
      ))}

      {guide.preparationBlocks?.map((block) => (
        <section key={block.id} className="mb-12">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
            {block.title}
          </h2>
          <ul className="mt-4 space-y-3">
            {block.items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3 text-[16px] leading-relaxed text-[var(--foreground-secondary)]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full gradient-fill" />
                {item}
              </motion.li>
            ))}
          </ul>
        </section>
      ))}

      {guide.sections.map((section, si) => (
        <section key={section.id} className="mb-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: si * 0.08 }}
            className="mb-6"
          >
            <h2 className="text-[26px] font-semibold tracking-[-0.02em]">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-2 text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
                {section.description}
              </p>
            )}
          </motion.div>

          <motion.div
            className="w-full"
            initial="hidden"
            animate="visible"
          >
            {section.items?.map((item) => {
              const idx = itemIndex++;
              return <TimelineCard key={item.id} item={item} index={idx} />;
            })}
          </motion.div>

          {section.maps?.map((map) => (
            <div key={map.id} className="mt-8 py-4">
              <h3 className="text-[18px] font-semibold">{map.title}</h3>
              {map.description && (
                <p className="mt-2 text-[16px] text-[var(--foreground-secondary)]">
                  {map.description}
                </p>
              )}
              {map.embedUrl && (
                <a
                  href={map.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[16px] font-medium gradient-text"
                >
                  Open map
                </a>
              )}
            </div>
          ))}
        </section>
      ))}
    </motion.div>
  );
}
