# Travel Pal

A premium AI-native travel **execution** assistant — focused on flights, airports, transfers, timing, and logistics (not tourism).

## Features

- **Single OpenAI API key** — stored encrypted locally; powers chat, vision, OCR, and guide generation
- **Document upload** — PDFs and images with OCR; passport photo detection blocked
- **AI interview** — concise logistics-focused Q&A
- **Approval summary** — review segments, risks, and gaps
- **Dynamic travel guide** — JSON schema rendered as interactive timeline UI
- **AI-editable guide** — natural language edits to structured guide data
- **PWA** — installable, offline shell caching, service worker

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS v4
- Framer Motion, Zustand, Zod
- pdf.js, tesseract.js, OpenAI SDK
- IndexedDB via `idb`

## Getting started

### Supabase (optional auth)

Auth is **off** unless both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. The Vercel deployment runs without them.

To enable locally: create a Supabase project, add env vars, enable Email auth, and run `supabase/migrations/20260319000000_profiles.sql`.

### Web (PWA)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Complete onboarding (account, privacy, [OpenAI API key](https://platform.openai.com/api-keys)).

Deploy with `npm run build` and host on Vercel, or any Node/static host.

### macOS desktop (Tauri)

**Prerequisites:** [Rust](https://rustup.rs/) and Xcode Command Line Tools (`xcode-select --install`).

```bash
npm install
npm run tauri:dev      # dev: Next.js + native window
npm run tauri:build:mac # release .app + .dmg in src-tauri/target/release/bundle/
```

Tauri uses a static export (`npm run build:tauri` → `out/`). The standard `npm run build` remains for web deployment without affecting the desktop bundle.

## Privacy

- Accounts via Supabase Auth (email/password or magic link)
- API keys are AES-encrypted in local storage (device-derived salt)
- Documents and journeys persist in IndexedDB on your device
- No key logging or analytics

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (web) |
| `npm run build` | Production build for web |
| `npm run build:tauri` | Static export to `out/` for Tauri |
| `npm run tauri:dev` | macOS app + hot reload |
| `npm run tauri:build:mac` | macOS `.app` and `.dmg` |

## Project structure

```
src-tauri/       # Tauri (Rust) native shell
src/
  app/           # Routes
  ai/            # OpenAI client, prompts, passport detection
  components/    # UI, chat, timeline, gradients
  features/      # Onboarding, journey steps
  stores/        # Zustand + persistence
  schemas/       # Guide JSON schema (Zod)
  lib/           # DB, crypto, PWA, web intelligence stubs
```

## License

Private — MVP build.
