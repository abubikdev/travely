/** Auth is opt-in: set both Supabase env vars to enable. Vercel deploy runs without them. */
export function isAuthEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}
