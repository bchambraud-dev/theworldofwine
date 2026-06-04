/**
 * FeedbackModal — lightweight in-app feedback form.
 *
 * Opened from the drawer "SEND FEEDBACK" link. Logged-in users submit a
 * category + message; we auto-attach user_id, email, current page URL,
 * and user agent for triage context.
 *
 * Design principles (June 2026 launch):
 *   - One screen, no multi-step flow
 *   - No fake ticket numbers or "we'll respond in 24 hours" lies
 *   - Honest success message: "We read every message. We'll reply if it helps to."
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { directInsert } from "@/lib/supabaseDirectFetch";

type Category = "feature" | "bug" | "general" | "compliment";

const CATEGORY_LABELS: Record<Category, string> = {
  feature: "Feature request",
  bug: "Something's broken",
  general: "General comment",
  compliment: "Just want to say thanks",
};

const PLACEHOLDER: Record<Category, string> = {
  feature: "What would make The World of Wine better for you?",
  bug: "What happened, and what did you expect to happen?",
  general: "Tell us what's on your mind…",
  compliment: "We'd love to hear what you enjoy",
};

export default function FeedbackModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [category, setCategory] = useState<Category>("feature");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when the modal re-opens
  useEffect(() => {
    if (open) {
      setCategory("feature");
      setMessage("");
      setSending(false);
      setSent(false);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!user) {
      setError("Please sign in to send feedback.");
      return;
    }
    if (message.trim().length < 3) {
      setError("Please add a little more detail.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await directInsert("user_feedback", {
        user_id: user.id,
        user_email: user.email || null,
        category,
        message: message.trim(),
        page_url: typeof window !== "undefined" ? window.location.pathname + window.location.search : null,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
      });
      setSent(true);
    } catch (e: any) {
      setError(e?.message || "Could not send feedback. Try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(26,20,16,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#F7F4EF", borderRadius: 16,
          maxWidth: 460, width: "100%", maxHeight: "90vh",
          overflow: "auto", padding: "26px 24px 24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        {!sent ? (
          <>
            <div style={{
              fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.14em", color: "#8C1C2E", marginBottom: 10,
            }}>SEND FEEDBACK</div>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 400,
              color: "#1A1410", margin: "0 0 8px",
            }}>
              Tell us what you think
            </h2>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300,
              color: "#5A5248", margin: "0 0 22px", lineHeight: 1.5,
            }}>
              We read every message. The app gets better because of what you tell us.
            </p>

            {/* Category dropdown — styled as native select for reliability */}
            <label style={{ display: "block", marginBottom: 16 }}>
              <div style={{
                fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                letterSpacing: "0.12em", color: "#5A5248", marginBottom: 6,
              }}>CATEGORY</div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: "1px solid #D4D1CA", background: "white",
                  fontFamily: "'Jost', sans-serif", fontSize: "0.9rem",
                  color: "#1A1410", appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235A5248' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  backgroundSize: "14px",
                  paddingRight: 36,
                }}
              >
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((k) => (
                  <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
                ))}
              </select>
            </label>

            {/* Message textarea */}
            <label style={{ display: "block", marginBottom: 16 }}>
              <div style={{
                fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                letterSpacing: "0.12em", color: "#5A5248", marginBottom: 6,
              }}>YOUR MESSAGE</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={PLACEHOLDER[category]}
                rows={6}
                maxLength={4000}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: "1px solid #D4D1CA", background: "white",
                  fontFamily: "'Jost', sans-serif", fontSize: "0.9rem",
                  color: "#1A1410", lineHeight: 1.5, resize: "vertical",
                  minHeight: 100, boxSizing: "border-box",
                }}
              />
              <div style={{
                marginTop: 4, textAlign: "right", fontFamily: "'Geist Mono', monospace",
                fontSize: "0.55rem", color: "#8C7468",
              }}>{message.length}/4000</div>
            </label>

            {error && (
              <div style={{
                background: "rgba(140,28,46,0.08)", border: "1px solid rgba(140,28,46,0.2)",
                color: "#8C1C2E", padding: "8px 12px", borderRadius: 8,
                fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", marginBottom: 12,
              }}>{error}</div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                disabled={sending}
                style={{
                  flex: 1, padding: "12px 18px", borderRadius: 10,
                  border: "1px solid #D4D1CA", background: "white",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.12em", color: "#5A5248",
                  cursor: sending ? "default" : "pointer",
                }}
              >CANCEL</button>
              <button
                onClick={handleSubmit}
                disabled={sending || message.trim().length < 3}
                style={{
                  flex: 1.4, padding: "12px 18px", borderRadius: 10,
                  border: "none", background: sending || message.trim().length < 3 ? "#D4D1CA" : "#8C1C2E",
                  color: "#F7F4EF",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  cursor: sending || message.trim().length < 3 ? "default" : "pointer",
                }}
              >{sending ? "SENDING…" : "SEND →"}</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "12px 8px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(31,107,53,0.12)", margin: "0 auto 18px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1F6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 400,
              color: "#1A1410", margin: "0 0 10px",
            }}>Thanks for telling us</h2>
            <p style={{
              fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 300,
              color: "#5A5248", margin: "0 auto 24px", maxWidth: 320, lineHeight: 1.55,
            }}>
              We read every message. We'll reply if it helps to.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                background: "#8C1C2E", color: "#F7F4EF",
                fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
                letterSpacing: "0.12em", cursor: "pointer",
              }}
            >CLOSE</button>
          </div>
        )}
      </div>
    </div>
  );
}
