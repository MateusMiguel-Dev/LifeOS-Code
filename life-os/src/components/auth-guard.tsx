"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setChecking(false);
      return;
    }
    setConfigured(true);
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) router.replace("/login/");
      else setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login/");
      else if (active) setChecking(false);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (checking && configured) {
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0b10", color: "#f4f3fa" }}>Verificando acesso...</main>;
  }
  return <>{children}</>;
}
