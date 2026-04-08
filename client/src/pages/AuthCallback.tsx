import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if onboarding is needed
        supabase
          .from("user_profiles")
          .select("onboarding_complete")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data && !data.onboarding_complete) {
              setLocation("/onboarding");
            } else {
              setLocation("/");
            }
          });
      } else {
        setLocation("/sign-in");
      }
    });
  }, [setLocation]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "#5A5248"
    }}>
      Signing you in...
    </div>
  );
}
