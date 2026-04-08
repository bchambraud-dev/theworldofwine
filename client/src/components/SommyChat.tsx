import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
  imagePreview?: string; // data URL for display
  wineCard?: WineCard;
}

interface WineCard {
  name: string;
  producer: string;
  vintage: string;
  region: string;
  grapes: string;
  style: string;
}

function parseWineCard(text: string): { card: WineCard | null; prose: string } {
  const match = text.match(/WINE_CARD_START\n([\s\S]*?)\nWINE_CARD_END/);
  if (!match) return { card: null, prose: text };

  const block = match[1];
  const get = (key: string) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`));
    return m ? m[1].trim() : "";
  };

  const card: WineCard = {
    name: get("name"),
    producer: get("producer"),
    vintage: get("vintage"),
    region: get("region"),
    grapes: get("grapes"),
    style: get("style"),
  };

  const prose = text.replace(/WINE_CARD_START[\s\S]*?WINE_CARD_END\n?/, "").trim();
  return { card, prose };
}

function usePageContext() {
  const [location] = useLocation();
  return useMemo(() => {
    const regionMatch = location.match(/\/explore\/region\/([^/]+)/);
    if (regionMatch) {
      const id = regionMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return { context: `The user is viewing the ${id} wine region.`, chips: [`What makes ${id} special?`, `Best value wines from ${id}?`, `What grapes grow in ${id}?`] };
    }
    const producerMatch = location.match(/\/explore\/producer\/([^/]+)/);
    if (producerMatch) {
      const id = producerMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return { context: `The user is viewing producer ${id}.`, chips: [`Tell me about ${id}`, `What's their flagship wine?`, `Similar producers?`] };
    }
    const guideMatch = location.match(/\/guides\/([^/]+)/);
    if (guideMatch && guideMatch[1] !== "grapes") {
      const id = guideMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return { context: `The user is reading the guide: "${id}".`, chips: [`Explain this simply`, `Key takeaway?`, `Common mistakes?`] };
    }
    if (location.startsWith("/explore")) return { context: "The user is exploring the wine map.", chips: ["Which region should I explore first?", "Most underrated wine region?", "Surprise me"] };
    if (location === "/guides") return { context: "The user is browsing the guides.", chips: ["Where do I start?", "Best beginner guide?", "What should I learn first?"] };
    return { context: "", chips: ["What should I drink tonight?", "I'm new to wine — where do I start?", "Best wine with steak?", "Explain tannins"] };
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
  const [pendingImage, setPendingImage] = useState<{ data: string; mediaType: string; preview: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { context, chips } = usePageContext();
  const { user, profile } = useAuth();
  const hasGreeted = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  // Proactive greeting for signed-in users
  useEffect(() => {
    if (!isOpen || !user || hasGreeted.current === user.id || messages.length > 0) return;
    hasGreeted.current = user.id;
    setIsLoading(true);
    Promise.all([
      supabase.from("wine_journal").select("wine_name, region, personal_rating").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      supabase.from("user_goals").select("title, current_count, target_count").eq("user_id", user.id).eq("completed", false).limit(2),
    ]).then(async ([journalRes, goalsRes]) => {
      const journal = journalRes.data || [];
      const goals = goalsRes.data || [];
      const name = profile?.display_name?.split(" ")[0] || "";
      let parts = [`The user's name is ${name || "there"}.`];
      if (journal.length > 0) parts.push(`Recent wines: ${journal.map(j => `${j.wine_name}${j.region ? ` from ${j.region}` : ""}${j.personal_rating ? ` (${j.personal_rating}/10)` : ""}`).join(", ")}.`);
      if (goals.length > 0) parts.push(`Active goals: ${goals.map(g => `"${g.title}" (${g.current_count}/${g.target_count})`).join(", ")}.`);
      if (journal.length === 0 && goals.length === 0) parts.push("They just completed onboarding.");
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: `[Context: ${parts.join(" ")}]\n\nSend a warm, short, personalised greeting. Reference recent wines or goals if they have any. 2-3 sentences max.` }] }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.text) setMessages([{ role: "assistant", content: data.text }]);
      }
      setIsLoading(false);
    });
  }, [isOpen, user, profile, messages.length]);

  // Handle image file selection
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp";
      setPendingImage({ data: base64, mediaType, preview: dataUrl });
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  }, []);

  const sendMessage = useCallback(async (text: string, imageOverride?: typeof pendingImage) => {
    if ((!text.trim() && !imageOverride && !pendingImage) || isLoading) return;
    const img = imageOverride || pendingImage;
    const userText = text.trim() || "What wine is this? Tell me about it.";
    const userMessage: Message = {
      role: "user",
      content: userText,
      imagePreview: img?.preview,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setPendingImage(null);
    setIsLoading(true);

    try {
      const contextualText = context ? `[Context: ${context}]\n\n${userText}` : userText;
      const messagesWithContext = [
        ...newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: contextualText },
      ];

      const body: any = { messages: messagesWithContext };
      if (img) body.image = { data: img.data, mediaType: img.mediaType };

      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Chat failed");
      const data = await response.json();

      if (data.text) {
        const { card, prose } = parseWineCard(data.text);
        setMessages(prev => [...prev, { role: "assistant", content: prose, wineCard: card || undefined }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: data.error }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, having trouble connecting. Try again in a moment." }]);
    }
    setIsLoading(false);
  }, [messages, isLoading, context, pendingImage]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button onClick={onToggle} data-testid="sommy-float-btn" style={{ position: "fixed", bottom: 24, right: 24, display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 28, background: "#8C1C2E", color: "#F7F4EF", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(140,28,46,0.3)", zIndex: 900, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: 400 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.12em" }}>ASK</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.95rem", fontWeight: 400 }}>Sommy</span>
        </button>
      )}

      {/* Chat popup */}
      {isOpen && (
        <div data-testid="sommy-chatbox" style={{ position: "fixed", bottom: 24, right: 24, width: "min(400px, calc(100vw - 32px))", height: "min(580px, calc(100vh - 100px))", background: "#F7F4EF", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", zIndex: 901, overflow: "hidden", border: "1px solid #D4D1CA" }}>

          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #EDEAE3", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/sommy-avatar-circle.png" alt="Sommy" style={{ width: 36, height: 36, borderRadius: "50%", background: "#EDEAE3", objectFit: "cover" }} />
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.68rem", fontWeight: 400, letterSpacing: "0.12em", color: "#1A1410" }}>ASK</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1.05rem", fontWeight: 400, color: "#8C1C2E" }}>Sommy</span>
                </div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 300, color: "#5A5248" }}>Your wine companion</div>
              </div>
            </div>
            <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#5A5248", fontSize: 18, lineHeight: 1 }} aria-label="Close">&#x2715;</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Welcome */}
            {messages.length === 0 && !isLoading && (
              <div>
                <div style={{ background: "#EDEAE3", borderRadius: "14px 14px 14px 4px", padding: "12px 15px", maxWidth: "88%", marginBottom: 14 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.87rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.6, margin: 0 }}>
                    Hey, I'm Sommy. Ask me anything about wine — or snap a label and I'll tell you if it's worth your time.
                  </p>
                </div>

                {/* Scan CTA */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 14px", background: "white", border: "1.5px solid #8C1C2E", borderRadius: 12, cursor: "pointer", marginBottom: 10, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#8C1C2E"; e.currentTarget.style.color = "#F7F4EF"; const span = e.currentTarget.querySelector("span"); if (span) (span as HTMLElement).style.color = "#F7F4EF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "inherit"; const span = e.currentTarget.querySelector("span"); if (span) (span as HTMLElement).style.color = "#8C1C2E"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "#8C1C2E" }}>Scan a wine label</span>
                </button>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {chips.map(chip => (
                    <button key={chip} onClick={() => sendMessage(chip)} style={{ background: "white", border: "1px solid #D4D1CA", borderRadius: 18, padding: "6px 12px", fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", fontWeight: 400, color: "#8C1C2E", cursor: "pointer" }}>
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                {/* Image preview */}
                {msg.imagePreview && (
                  <div style={{ maxWidth: "85%", borderRadius: 12, overflow: "hidden", border: "1px solid #D4D1CA" }}>
                    <img src={msg.imagePreview} alt="Wine label" style={{ width: "100%", height: "auto", display: "block", maxHeight: 200, objectFit: "cover" }} />
                  </div>
                )}

                {/* Wine card */}
                {msg.wineCard && (
                  <div style={{ maxWidth: "92%", background: "white", border: "1px solid #EDEAE3", borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ background: "#8C1C2E", padding: "10px 14px" }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400, color: "#F7F4EF", lineHeight: 1.2 }}>{msg.wineCard.name}</div>
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(247,244,239,0.75)", marginTop: 2 }}>{msg.wineCard.producer}</div>
                    </div>
                    <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                      {[
                        ["Vintage", msg.wineCard.vintage],
                        ["Region", msg.wineCard.region],
                        ["Grapes", msg.wineCard.grapes],
                        ["Style", msg.wineCard.style],
                      ].map(([label, value]) => value && (
                        <div key={label}>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#D4D1CA" }}>{label.toUpperCase()}</div>
                          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400, color: "#1A1410" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text bubble */}
                {msg.content && (
                  <div style={{ background: msg.role === "user" ? "#8C1C2E" : "#EDEAE3", color: msg.role === "user" ? "#F7F4EF" : "#1A1410", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "88%", fontFamily: "'Jost', sans-serif", fontSize: "0.87rem", fontWeight: 300, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </div>
                )}
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

          {/* Image preview strip */}
          {pendingImage && (
            <div style={{ padding: "8px 12px", borderTop: "1px solid #EDEAE3", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <img src={pendingImage.preview} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }} />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "#5A5248", flex: 1 }}>Ready to scan. Add a message or send now.</span>
              <button onClick={() => setPendingImage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D4D1CA", fontSize: 16, padding: 4 }}>&#x2715;</button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} style={{ padding: "10px 12px", borderTop: "1px solid #EDEAE3", display: "flex", gap: 8, flexShrink: 0 }}>
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} style={{ display: "none" }} />

            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Scan a label"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #D4D1CA", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pendingImage ? "#8C1C2E" : "#5A5248" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>

            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={pendingImage ? "Add a message or just send…" : "Ask me anything about wine…"} disabled={isLoading} data-testid="sommy-input"
              style={{ flex: 1, border: "1px solid #D4D1CA", borderRadius: 22, padding: "9px 15px", fontFamily: "'Jost', sans-serif", fontSize: "0.87rem", fontWeight: 300, color: "#1A1410", background: "white", outline: "none" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#8C1C2E"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "#D4D1CA"; }}
            />
            <button type="submit" disabled={isLoading || (!input.trim() && !pendingImage)} data-testid="sommy-send"
              style={{ width: 36, height: 36, borderRadius: "50%", background: (isLoading || (!input.trim() && !pendingImage)) ? "#D4D1CA" : "#8C1C2E", color: "#F7F4EF", border: "none", cursor: (isLoading || (!input.trim() && !pendingImage)) ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
