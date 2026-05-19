import { z } from "zod";

export const guideAlertSchema = z.object({
  id: z.string(),
  type: z.enum(["info", "warning", "critical", "tip"]),
  title: z.string(),
  body: z.string(),
});

export const guideChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean().optional(),
});

export const guideMapSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  embedUrl: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const guideTimelineItemSchema = z.object({
  id: z.string(),
  time: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  duration: z.string().optional(),
  category: z
    .enum([
      "departure",
      "transit",
      "layover",
      "arrival",
      "preparation",
      "risk",
      "checklist",
    ])
    .optional(),
  expandable: z.boolean().optional(),
  details: z.array(z.string()).optional(),
  alerts: z.array(guideAlertSchema).optional(),
  checklist: z.array(guideChecklistItemSchema).optional(),
});

export const guideSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(guideTimelineItemSchema).optional(),
  alerts: z.array(guideAlertSchema).optional(),
  checklist: z.array(guideChecklistItemSchema).optional(),
  maps: z.array(guideMapSchema).optional(),
});

export const travelGuideSchema = z.object({
  version: z.literal(1),
  title: z.string(),
  subtitle: z.string().optional(),
  generatedAt: z.string(),
  heroNote: z.string().optional(),
  sections: z.array(guideSectionSchema),
  globalAlerts: z.array(guideAlertSchema).optional(),
  preparationBlocks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        items: z.array(z.string()),
      })
    )
    .optional(),
});

export type TravelGuideSchema = z.infer<typeof travelGuideSchema>;
export type GuideSection = z.infer<typeof guideSectionSchema>;
export type GuideTimelineItem = z.infer<typeof guideTimelineItemSchema>;
export type GuideAlert = z.infer<typeof guideAlertSchema>;

export const GUIDE_JSON_INSTRUCTION = `Return ONLY valid JSON matching this schema (no markdown):
{
  "version": 1,
  "title": string,
  "subtitle"?: string,
  "generatedAt": ISO string,
  "heroNote"?: string,
  "sections": [{ "id", "title", "description"?, "items"?, "alerts"?, "checklist"?, "maps"? }],
  "globalAlerts"?: [{ "id", "type": "info"|"warning"|"critical"|"tip", "title", "body" }],
  "preparationBlocks"?: [{ "id", "title", "items": string[] }]
}
Items in sections: { "id", "time", "title", "subtitle"?, "body"?, "duration"?, "category"?, "expandable"?, "details"?, "alerts"?, "checklist"? }
Focus on travel EXECUTION logistics only — timing, transfers, airports, risks. NO tourism.`;
