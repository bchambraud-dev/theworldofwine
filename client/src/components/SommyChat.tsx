import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useUserData } from "@/lib/useUserData";
import { guides } from "@/data/guides";
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
  const { user, profile, refreshProfile } = useAuth();
  const { stats, preferences, completedGuideIds, journal, refresh: refreshUserData } = useUserData();
  const hasGreeted = useRef<string | null>(null);
  const historyLoaded = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  // Single sequential effect: load history first, then greet if no history
  useEffect(() => {
    if (!isOpen || !user || historyLoaded.current === user.id) return;
    historyLoaded.current = user.id;

    const init = async () => {
      // Step 1: load history
      const { data: history } = await supabase
        .from("sommy_conversations")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (history && history.length > 0) {
        // Has history — restore it, no greeting needed
        setMessages([...history].reverse().map(r => ({ role: r.role as "user" | "assistant", content: r.content })));
        return;
      }

      // Step 2: no history — first-ever session. Use a reliable personalised
      // greeting rather than an API call that can fail silently.
      hasGreeted.current = user.id;
      const name = profile?.display_name?.split(" ")[0] || "";
      const level = profile?.experience_level || "beginner";

      const openingQuestion: Record<string, string> = {
        beginner:     "What draws you to wine right now? Are you exploring something new, looking for a great bottle for tonight, or just curious about where to start?",
        intermediate: "What are you looking to discover right now — a region you haven't explored, a style you want to get deeper into, or the perfect pairing for something specific?",
        expert:       "What are you exploring lately? Is there a producer, vintage, or appellation that's caught your attention recently?",
      };

      const greeting = `Hey${name ? ` ${name}` : ""}! I'm Sommy — your personal wine companion here at The World of Wine. I'm starting fresh, which means I get to learn what you love as we go.

${openingQuestion[level] || openingQuestion.beginner}

The more you share — what you enjoy, what you've tried, even what you definitely don't like — the better I can point you toward wines that'll genuinely excite you.`;

      setMessages([{ role: "assistant", content: greeting }]);
    };

    init();
  }, [isOpen, user, profile]);

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
      // Build rich user profile context so Sommy knows who it's talking to
      const profileParts: string[] = [];
      const name = profile?.display_name?.split(" ")[0];
      if (name) profileParts.push(`Name: ${name}`);
      if (profile?.experience_level) profileParts.push(`Level: ${profile.experience_level}`);
      if (preferences.preferred_types?.length) profileParts.push(`Prefers: ${preferences.preferred_types.join(", ")} wines`);
      if (completedGuideIds.length > 0) {
        const guideNames = completedGuideIds.map(id => guides.find(g => g.id === id)?.title).filter(Boolean);
        const total = guides.filter(g => g.level === (profile?.experience_level || "beginner")).length;
        profileParts.push(`Guides completed (${guideNames.length}/${total} ${profile?.experience_level || "beginner"}): ${guideNames.join(", ")}`);
      }
      if (journal.length > 0) {
        const wineLines = journal.slice(0, 5).map(w => {
          const parts = [w.wine_name];
          if (w.vintage) parts[0] += ` ${w.vintage}`;
          if (w.region) parts.push(w.region);
          if (w.grapes) parts.push(w.grapes);
          if (w.personal_rating) parts.push(`rated ${w.personal_rating}/5`);
          if (w.notes) parts.push(`notes: "${w.notes}"`);
          return `- ${parts.join(" · ")}`;
        });
        profileParts.push(`Recent wines logged:\n${wineLines.join("\n")}`);
      }
      if (stats.wines > 0 || stats.regions > 0) {
        profileParts.push(`Stats: ${stats.wines} wines logged, ${stats.regions} regions explored, ${stats.guides} guides read`);
      }
      const userProfile = profileParts.length > 0 ? `[User Profile]\n${profileParts.join("\n")}` : "";
      const fullContext = [userProfile, context].filter(Boolean).join("\n\n");
      const contextualText = fullContext ? `${fullContext}\n\n${userText}` : userText;
      // Build history: drop leading assistant turns, then cap at last 6 messages
      // to keep context tight and avoid Vercel function timeouts
      const rawHistory = newMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      const firstUserIdx = rawHistory.findIndex(m => m.role === "user");
      const cleanHistory = firstUserIdx >= 0 ? rawHistory.slice(firstUserIdx) : [];
      // Last 10 messages = 5 exchanges of context (Vercel Pro, 60s timeout)
      const historyForApi = cleanHistory.slice(-10);
      const messagesWithContext = [
        ...historyForApi,
        { role: "user" as const, content: contextualText },
      ];

      const body: any = { messages: messagesWithContext };
      if (img) body.image = { data: img.data, mediaType: img.mediaType };

      // 50s client-side timeout (Vercel Pro limit is 60s)
      const abort = new AbortController();
      const abortTimer = setTimeout(() => abort.abort(), 50000);

      let response: Response;
      try {
        response = await fetch("/api/chat", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: abort.signal,
        });
      } finally {
        clearTimeout(abortTimer);
      }

      if (!response!.ok) {
        const errBody = await response!.json().catch(() => ({}));
        throw new Error((errBody as any)?.error || `HTTP ${response!.status}`);
      }
      const data = await response!.json();

      if (data.text) {
        // Strip PROFILE_UPDATE block before displaying, then apply it
        const profileUpdateMatch = data.text.match(/\[PROFILE_UPDATE\]([\s\S]*?)\[\/PROFILE_UPDATE\]/);
        const cleanText = data.text.replace(/\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]/, "").trim();

        const { card, prose } = parseWineCard(cleanText);
        setMessages(prev => [...prev, { role: "assistant", content: prose, wineCard: card || undefined }]);

        // Apply profile update if Sommy detected clear user preferences
        if (profileUpdateMatch && user) {
          try {
            const updates = JSON.parse(profileUpdateMatch[1]);
            const ops: Promise<any>[] = [];
            if (updates.experience_level) {
              ops.push(supabase.from("user_profiles").update({ experience_level: updates.experience_level }).eq("id", user.id));
            }
            if (updates.preferred_types?.length) {
              ops.push(supabase.from("user_preferences").upsert({ user_id: user.id, preferred_types: updates.preferred_types }));
            }
            if (ops.length) {
              Promise.all(ops).then(() => {
                refreshProfile();   // update profile badge
                refreshUserData();  // update stats + preferences in panel
              }).catch(console.error);
            }
          } catch (e) {
            console.error("PROFILE_UPDATE parse error:", e);
          }
        }

        // Fire-and-forget save — do NOT await to avoid blocking the loading state
        if (user) {
          supabase.from("sommy_conversations").insert([
            { user_id: user.id, role: "user", content: userText, has_image: !!img },
            { user_id: user.id, role: "assistant", content: prose, has_image: false },
          ]).then(({ error }) => { if (error) console.error("Sommy save error:", error.message); }).catch(console.error);
        }
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: data.error }]);
      }
    } catch (e: any) {
      console.error("Sommy error:", e?.message || e);
      const msg = e?.name === "AbortError"
        ? "That one took too long — try asking me something more specific."
        : "Sorry, having trouble connecting. Try again in a moment.";
      setMessages(prev => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, context, pendingImage, profile, preferences, completedGuideIds, journal, stats]);

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
                    Hey, I'm Sommy. Ask me anything about wine — or tap the <strong style={{fontWeight:500}}>+</strong> below to scan a label and I'll tell you if it's worth your time.
                  </p>
                </div>

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
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />

            {/* + button for image upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload photo or scan a label"
              style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${pendingImage ? "#8C1C2E" : "#D4D1CA"}`, background: pendingImage ? "rgba(140,28,46,0.08)" : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: pendingImage ? "#8C1C2E" : "#5A5248", fontSize: "1.3rem", fontWeight: 300, lineHeight: 1, transition: "all 0.15s" }}
            >
              +
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
