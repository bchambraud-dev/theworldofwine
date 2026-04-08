import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Implicit flow: session is parsed from the URL hash by Supabase automatically
    // detectSessionInUrl: true handles this — just wait for the session to appear
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data } = await supabase
          .from("user_profiles")
          .select("onboarding_complete")
          .eq("id", session.user.id)
          .single();

        if (data && !data.onboarding_complete) {
          setLocation("/onboarding");
        } else {
          setLocation("/");
        }
      } else {
        // Wait briefly for Supabase to parse the hash and establish session
        setTimeout(checkSession, 500);
      }
    };

    checkSession();
  }, [setLocation]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#F7F4EF", gap: 16,
    }}>
      <svg width="32" height="38" viewBox="0 0 40 48" fill="none">
        <path d="M20 2C20 2 6 18 6 28C6 36.8 12.3 44 20 44C27.7 44 34 36.8 34 28C34 18 20 2 20 2Z" fill="#8C1C2E" opacity="0.2"/>
      </svg>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "#5A5248" }}>
        Signing you in...
      </p>
    </div>
  );
}
