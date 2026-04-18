import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";

interface LoginPromptProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

const OFFSET = "52px";

export default function LoginPrompt({ title, description, icon }: LoginPromptProps) {
  const { signInWithGoogle } = useAuth();

  return (
    <div style={{
      position: "fixed", inset: 0, paddingTop: OFFSET, overflowY: "auto",
      background: "#F7F4EF", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        maxWidth: 420, width: "100%", margin: "0 auto", padding: "0 20px",
      }}>
        <div style={{
          background: "white", borderRadius: 20, padding: "48px 36px",
          border: "1px solid #EDEAE3", boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}>
          {/* Wine drop icon */}
          {icon || (
            <svg
              viewBox="0 0 80 100"
              style={{ width: 40, height: 50, color: "#8C1C2E", marginBottom: 20 }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
              <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
              <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
            </svg>
          )}

          {/* Title */}
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 400,
            color: "#1A1410", margin: "0 0 10px", lineHeight: 1.2,
          }}>
            {title}
          </h1>

          {/* Description */}
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
            color: "#5A5248", lineHeight: 1.6, margin: "0 0 28px",
          }}>
            {description}
          </p>

          {/* Continue with Google button */}
          <button
            onClick={signInWithGoogle}
            style={{
              width: "100%", padding: "13px 20px", border: "none", borderRadius: 12,
              background: "#8C1C2E", color: "#F7F4EF", cursor: "pointer",
              fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", fontWeight: 500,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {/* Google logo */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Muted text */}
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontWeight: 300,
            color: "#B0ADA6", lineHeight: 1.5, margin: "18px 0 0",
          }}>
            Your wine journey is personal — we just need to know who you are.
          </p>
        </div>
      </div>
    </div>
  );
}
