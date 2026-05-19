export const APP_NAME = "Travel Pal";
export const APP_DESCRIPTION =
  "Intelligent travel execution assistant for flights, transfers, airports, and logistics.";

export const STORAGE_KEYS = {
  DEVICE_SALT: "tf_device_salt",
  ONBOARDING_COMPLETE: "tf_onboarding_complete",
} as const;

export const OPENAI_MODELS = {
  chat: "gpt-4o-mini",
  vision: "gpt-4o-mini",
  guide: "gpt-4o",
} as const;

export const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const JOURNEY_STEPS = [
  "upload",
  "interview",
  "approval",
  "guide",
] as const;

export type JourneyStep = (typeof JOURNEY_STEPS)[number];
