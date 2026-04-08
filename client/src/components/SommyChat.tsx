import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/** Derive context and quick prompts from the current URL */
function usePageContext() {
  const [location] = useLocation();

  return useMemo(() => {
    const regionMatch = location.match(/\/explore\/region\/([^/]+)/);
    if (regionMatch) {
      const id = regionMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        context: `The user is currently viewing the ${id} wine region on the map.`,
        chips: [`What makes ${id} special?`, `Best value wines from ${id}?`, `What grapes grow in ${id}?`],
      };
    }

    const producerMatch = location.match(/\/explore\/producer\/([^/]+)/);
    if (producerMatch) {
      const id = producerMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        context: `The user is currently viewing the producer ${id}.`,
        chips: [`Tell me about ${id}`, `What's their flagship wine?`, `Similar producers I should know?`],
      };
    }

    const guideMatch = location.match(/\/guides\/([^/]+)/);
    if (guideMatch && guideMatch[1] !== "grapes") {
      const id = guideMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        context: `The user is currently reading the guide: "${id}".`,
        chips: [`Explain this in simple terms`, `What's the key takeaway?`, `Any common mistakes to avoid?`],
      };
    }

    if (location.startsWith("/explore")) {
      return {
        context: "The user is exploring the wine map.",
        chips: ["Which region should I explore first?", "Most underrated wine region?", "Surprise me with something interesting"],
      };
    }

    if (location === "/guides") {
      return {
        context: "The user is browsing the wine guides.",
        chips: ["I'm new to wine — where do I start?", "What should I learn first?", "Which guide is the most fun?"],
      };
    }

    return {
      context: "",
      chips: ["What should I drink tonight?", "I'm new to wine — where do I start?", "Best wine with steak?", "Explain tannins to me"],
    };
  }, [location]);
}

interface SommyChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SommyChat({ isOpen, onToggle }: SommyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { context, chips } = usePageContext();
  const { user, profile } = useAuth();
  const hasGreeted = useRef(false);

  // Proactive greeting when signed-in user opens chat
  useEffect(() => {
    if (!isOpen || !user || hasGreeted.current || messages.length > 0) return;
    hasGreeted.current = true;
    setIsLoading(true);

    // Fetch journal + goals to personalise greeting
    Promise.all([
      supabase.from("wine_journal").select("wine_name, region, personal_rating").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      supabase.from("user_goals").select("title, current_count, target_count, completed").eq("user_id", user.id).eq("completed", false).limit(2),
    ]).then(async ([journalRes, goalsRes]) => {
      const journal = journalRes.data || [];
      const goals = goalsRes.data || [];
      const name = profile?.display_name?.split(" ")[0] || "";

      let contextParts = [`The user's name is ${name || "there"}.`];
      if (journal.length > 0) {
        contextParts.push(`Their recent journal entries: ${journal.map(j => `${j.wine_name}${j.region ? ` from ${j.region}` : ""}${j.personal_rating ? ` (rated ${j.personal_rating}/10)` : ""}`).join(", ")}.`);
      }
      if (goals.length > 0) {
        contextParts.push(`Their active goals: ${goals.map(g => `"${g.title}" (${g.current_count}/${g.target_count})`).join(", ")}.`);
      }
      if (journal.length === 0 && goals.length === 0) {
        contextParts.push("They are new — they just completed onboarding.");
      }

      const systemContext = contextParts.join(" ");
      const prompt = `[Context: ${systemContext}]\n\nSend a warm, short, personalised greeting. Reference their recent wines or goal progress if they have any. Keep it to 2-3 sentences. Be natural and excited to help — like a friend who remembers what they told you last time.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setMessages([{ role: "assistant", content: data.text }]);
        }
      }
      setIsLoading(false);
    });
  }, [isOpen, user, profile, messages.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const messagesWithContext = context
        ? [{ role: "user" as const, content: `[Context: ${context}]\n\n${newMessages[0].content}` }, ...newMessages.slice(1)]
        : newMessages;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesWithContext }),
      });

      if (!response.ok) throw new Error("Chat failed");
      const data = await response.json();

      if (data.text) {
        setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: data.error }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Try again in a moment." }]);
    }
    setIsLoading(false);
  }, [messages, isLoading, context]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <>
      {/* ── Floating "Ask Sommy" mini-button (bottom right, always visible when chat is closed) ── */}
      {!isOpen && (
        <button
          onClick={onToggle}
          data-testid="sommy-float-btn"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 28,
            background: "#8C1C2E",
            color: "#F7F4EF",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(140,28,46,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
            zIndex: 900,
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 400,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(140,28,46,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(140,28,46,0.3)"; }}
        >
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.12em" }}>ASK</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.95rem", fontWeight: 400 }}>Sommy</span>
        </button>
      )}

      {/* ── Chat popup (bottom right, above the button position) ── */}
      {isOpen && (
        <div
          data-testid="sommy-chatbox"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: "min(400px, calc(100vw - 32px))",
            height: "min(560px, calc(100vh - 100px))",
            background: "#F7F4EF",
            borderRadius: 20,
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 901,
            overflow: "hidden",
            border: "1px solid #D4D1CA",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #EDEAE3",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              background: "#F7F4EF",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/sommy-avatar-circle.png"
                alt="Sommy"
                style={{ width: 36, height: 36, borderRadius: "50%", background: "#EDEAE3", objectFit: "cover" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", fontWeight: 400, letterSpacing: "0.12em", color: "#1A1410" }}>ASK</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: "#8C1C2E" }}>Sommy</span>
                </div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 300, color: "#5A5248" }}>
                  Your wine companion
                </div>
              </div>
            </div>
            <button
              onClick={onToggle}
              data-testid="sommy-close"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#5A5248", fontSize: 18, lineHeight: 1 }}
              aria-label="Close"
            >
              &#x2715;
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Welcome */}
            {messages.length === 0 && !isLoading && (
              <div>
                <div style={{ background: "#EDEAE3", borderRadius: "14px 14px 14px 4px", padding: "12px 15px", maxWidth: "88%", marginBottom: 14 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.87rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.6, margin: 0 }}>
                    Hey, I'm Sommy. Ask me anything — what to drink, what to pair, what that weird smell in your glass is. No wrong questions.
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {chips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      style={{
                        background: "white", border: "1px solid #D4D1CA", borderRadius: 18,
                        padding: "6px 12px", fontFamily: "'Jost', sans-serif", fontSize: "0.76rem",
                        fontWeight: 400, color: "#8C1C2E", cursor: "pointer", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#8C1C2E"; e.currentTarget.style.color = "#F7F4EF"; e.currentTarget.style.borderColor = "#8C1C2E"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#8C1C2E"; e.currentTarget.style.borderColor = "#D4D1CA"; }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    background: msg.role === "user" ? "#8C1C2E" : "#EDEAE3",
                    color: msg.role === "user" ? "#F7F4EF" : "#1A1410",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    padding: "10px 14px", maxWidth: "88%",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.87rem", fontWeight: 300,
                    lineHeight: 1.6, whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "#EDEAE3", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", fontFamily: "'Jost', sans-serif", fontSize: "0.87rem", fontWeight: 300, color: "#5A5248", opacity: 0.6 }}>
                  Sommy is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{ padding: "10px 12px", borderTop: "1px solid #EDEAE3", display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about wine..."
              disabled={isLoading}
              data-testid="sommy-input"
              style={{
                flex: 1, border: "1px solid #D4D1CA", borderRadius: 22,
                padding: "9px 15px", fontFamily: "'Jost', sans-serif", fontSize: "0.87rem",
                fontWeight: 300, color: "#1A1410", background: "white", outline: "none",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#8C1C2E"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#D4D1CA"; }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              data-testid="sommy-send"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isLoading || !input.trim() ? "#D4D1CA" : "#8C1C2E",
                color: "#F7F4EF", border: "none",
                cursor: isLoading || !input.trim() ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
