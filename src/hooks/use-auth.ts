"use client";

import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isAuthEnabled } from "@/lib/auth-config";

export function useAuth() {
  const enabled = isAuthEnabled();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [enabled]);

  const signOut = async () => {
    if (!enabled) return;
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: enabled ? !!user : true,
    authEnabled: enabled,
  };
}
