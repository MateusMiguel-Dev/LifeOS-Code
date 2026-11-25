"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function routeUser() {
      const supabase = createClient();
      if (!supabase) {
        if (active) router.replace("/dashboard/");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (active) router.replace(data.session ? "/dashboard/" : "/login/");
    }
    void routeUser();
    return () => { active = false; };
  }, [router]);

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0b10", color: "#f4f3fa" }}>Carregando LIFE OS...</main>;
}
