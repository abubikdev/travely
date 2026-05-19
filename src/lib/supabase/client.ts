import { createBrowserClient } from "@supabase/ssr";
import { isAuthEnabled } from "@/lib/auth-config";

export function createClient() {
  if (!isAuthEnabled()) {
    throw new Error("Supabase is not configured");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
