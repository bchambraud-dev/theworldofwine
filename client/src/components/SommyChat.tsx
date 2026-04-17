import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useUserData } from "@/lib/useUserData";
import { guides } from "@/data/guides";
import { supabase } from "@/lib/supabase";
import { directInsert, directSelect, getAccessToken, SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";
import { regionToCountry, countryCode } from "@/lib/countryFlags";
import ImageCapture, { GalleryIcon } from "@/components/ImageCapture";

// Colour-coded tasting pills — matches the ftag system on producer pages
const tastingPillColors: Record<string, { bg: string; color: string; border: string }> = {
  fruit:   { bg: "rgba(184,50,74,0.06)",  color: "rgba(160,30,55,0.85)",  border: "rgba(184,50,74,0.25)" },
  floral:  { bg: "rgba(160,80,160,0.06)", color: "rgba(140,60,140,0.85)", border: "rgba(160,80,160,0.25)" },
  earth:   { bg: "rgba(120,85,45,0.06)",  color: "rgba(100,70,30,0.85)",  border: "rgba(120,85,45,0.25)" },
  oak:     { bg: "rgba(150,110,40,0.06)", color: "rgba(130,95,25,0.85)",  border: "rgba(150,110,40,0.25)" },
  spice:   { bg: "rgba(180,100,40,0.06)", color: "rgba(150,80,20,0.85)",  border: "rgba(180,100,40,0.25)" },
  mineral: { bg: "rgba(70,100,150,0.06)", color: "rgba(50,85,140,0.85)",  border: "rgba(70,100,150,0.25)" },
};
const neutralPill = { bg: "#F7F4EF", color: "#5A5248", border: "transparent" };

const tastingKeywords: Record<string, string> = {
  blackcurrant: "fruit", cassis: "fruit", cherry: "fruit", raspberry: "fruit",
  plum: "fruit", strawberry: "fruit", citrus: "fruit", lemon: "fruit",
  berry: "fruit", fig: "fruit", apple: "fruit", pear: "fruit", peach: "fruit",
  blackberry: "fruit", blueberry: "fruit", apricot: "fruit", melon: "fruit",
  tropical: "fruit", grapefruit: "fruit", lime: "fruit", orange: "fruit",
  cranberry: "fruit", pomegranate: "fruit", dark: "fruit", red: "fruit",
  earth: "earth", mushroom: "earth", truffle: "earth", soil: "earth",
  tobacco: "earth", leather: "earth", mineral: "mineral", wet: "earth",
  forest: "earth", undergrowth: "earth", slate: "mineral", chalk: "mineral",
  cedar: "oak", oak: "oak", vanilla: "oak", butter: "oak",
  toast: "oak", smoke: "oak", brioche: "oak", caramel: "oak",
  chocolate: "oak", coffee: "oak", mocha: "oak", charred: "oak",
  violet: "floral", rose: "floral", floral: "floral", lavender: "floral",
  jasmine: "floral", blossom: "floral", petal: "floral", acacia: "floral",
  pepper: "spice", spice: "spice", cinnamon: "spice", clove: "spice",
  thyme: "spice", sage: "spice", herb: "spice", anise: "spice",
  licorice: "spice", nutmeg: "spice", dried: "spice",
};

function classifyTastingNote(note: string) {
  const lower = note.toLowerCase();
  for (const [kw, cat] of Object.entries(tastingKeywords)) {
    if (lower.includes(kw)) return tastingPillColors[cat] || neutralPill;
  }
  return neutralPill;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  imagePreview?: string; // data URL for display (current session)
  imageUrl?: string;     // stored URL from Supabase Storage (persisted)
  wineCard?: WineCard;
  wishlistAdded?: string[]; // wine names added to wishlist from this message
  fromHistory?: boolean; // true if loaded from DB (don't re-save)
}

interface WineCard {
  name: string;
  producer: string;
  vintage: string;
  region: string;
  grapes: string;
  style: string;
  nose: string;
  palate: string;
  texture: string;
  breathing: string;
}

interface WishlistBlock {
  name: string;
  producer: string;
  region: string;
  grapes: string;
  style: string;
  price: string;
  why: string;
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
    nose: get("nose"),
    palate: get("palate"),
    texture: get("texture"),
    breathing: get("breathing"),
    grapes: get("grapes"),
    style: get("style"),
  };

  const prose = text.replace(/WINE_CARD_START[\s\S]*?WINE_CARD_END\n?/, "").trim();
  return { card, prose };
}

function parseWishlistBlocks(text: string): { blocks: WishlistBlock[]; cleanText: string } {
  const blocks: WishlistBlock[] = [];
  const regex = /WISHLIST_ADD_START\n([\s\S]*?)\nWISHLIST_ADD_END/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const section = match[1];
    const get = (key: string) => {
      const m = section.match(new RegExp(`${key}:\\s*(.+)`));
      return m ? m[1].trim() : "";
    };
    blocks.push({
      name: get("name"),
      producer: get("producer"),
      region: get("region"),
      grapes: get("grapes"),
      style: get("style"),
      price: get("price"),
      why: get("why"),
    });
  }
  const cleanText = text.replace(/WISHLIST_ADD_START[\s\S]*?WISHLIST_ADD_END\n?/g, "").trim();
  return { blocks, cleanText };
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
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [savedWineCards, setSavedWineCards] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { context, chips } = usePageContext();
  const { user, profile, refreshProfile } = useAuth();
  const { stats, preferences, completedGuideIds, journal, refresh: refreshUserData, silentRefresh } = useUserData();
  const hasGreeted = useRef<string | null>(null);
  const historyLoaded = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // Single sequential effect: load history first, then greet if no history
  useEffect(() => {
    if (!isOpen || !user || historyLoaded.current === user.id) return;
    historyLoaded.current = user.id;

    const init = async () => {
      // Step 1: load history via directSelect (avoids auth lock)
      try {
        const rows = await directSelect<any>(
          "sommy_conversations",
          `select=id,role,content,image_url,created_at&user_id=eq.${user.id}&order=created_at.desc&limit=30`
        );

        if (rows && rows.length > 0) {
          const history: Message[] = rows.reverse().map((row: any) => {
            const msg: Message = {
              role: row.role as "user" | "assistant",
              content: row.content,
              imageUrl: row.image_url || undefined,
              fromHistory: true,
            };
            // Re-parse wine cards and wishlist blocks from stored raw content
            if (row.role === "assistant") {
              // Strip PROFILE_UPDATE for display
              let displayText = row.content.replace(/\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]/, "").trim();
              const { blocks } = parseWishlistBlocks(displayText);
              const cleanAfterWishlist = displayText.replace(/WISHLIST_ADD_START[\s\S]*?WISHLIST_ADD_END\n?/g, "").trim();
              const { card, prose } = parseWineCard(cleanAfterWishlist);
              msg.content = prose;
              if (card) msg.wineCard = card;
              if (blocks.length > 0) msg.wishlistAdded = blocks.map(b => b.name);
            }
            return msg;
          });
          setMessages(history);
          return;
        }
      } catch (e) {
        console.error("History load error:", e);
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

  // Save a wine card to wishlist
  const saveWineCardToWishlist = useCallback(async (card: WineCard, msgIdx: number) => {
    if (!user) return;
    try {
      await directInsert("wine_wishlist", {
        user_id: user.id,
        wine_name: card.name,
        producer: card.producer || null,
        region: card.region || null,
        grapes: card.grapes || null,
        style: card.style || null,
        source: "sommy",
      });
      setSavedWineCards(prev => new Set(prev).add(msgIdx));
      setToastMsg(`Added ${card.name} to your wishlist`);
      silentRefresh();
    } catch (e) {
      console.error("Wishlist save error:", e);
    }
  }, [user, silentRefresh]);

  const sendMessage = useCallback(async (text: string, imageOverride?: typeof pendingImage) => {
    if ((!text.trim() && !imageOverride && !pendingImage) || isLoading) return;
    const img = imageOverride || pendingImage;
    const userText = text.trim() || "What wine is this? Tell me about it.";
    // Upload image to Supabase Storage for persistence (fire in background)
    let storedImageUrl: string | undefined;
    if (img && user) {
      try {
        const token = getAccessToken();
        if (token) {
          const byteString = atob(img.data);
          const bytes = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
          const blob = new Blob([bytes], { type: img.mediaType });
          const path = `${user.id}/chat-${Date.now()}.jpg`;
          const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/wine-labels/${path}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY, "Content-Type": img.mediaType },
            body: blob,
          });
          if (uploadRes.ok) {
            storedImageUrl = `${SUPABASE_URL}/storage/v1/object/public/wine-labels/${path}`;
          }
        }
      } catch (e) {
        console.error("Image upload error:", e);
      }
    }

    const userMessage: Message = {
      role: "user",
      content: userText,
      imagePreview: img?.preview,
      imageUrl: storedImageUrl,
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
      if (profile?.currency_code && profile.currency_code !== "USD") {
        profileParts.push(`Currency: ${profile.currency_code} — always quote wine prices in this currency using the appropriate symbol`);
      }
      if (profile?.base_country) {
        profileParts.push(`Based in: ${profile.base_country}`);
      }
      // Include cellar data so Sommy can suggest pairings from owned wines
      try {
        const cellarWines = await directSelect<any>("wine_cellar", `select=wine_name,producer,vintage,region,grapes,style,quantity,drink_from,drink_peak_start,drink_peak_end,drink_until,status&user_id=eq.${user!.id}&status=eq.active`, 5000);
        if (cellarWines.length > 0) {
          const now = new Date().getFullYear();
          const cellarLines = cellarWines.slice(0, 10).map((w: any) => {
            const parts = [w.wine_name];
            if (w.vintage) parts[0] += ` ${w.vintage}`;
            if (w.producer) parts.push(w.producer);
            if (w.region) parts.push(w.region);
            if (w.quantity > 1) parts.push(`x${w.quantity}`);
            if (w.drink_from && w.drink_until) {
              const status = now < w.drink_from ? "aging" : now >= w.drink_peak_start && now <= w.drink_peak_end ? "peak" : now >= w.drink_from ? "ready" : "past peak";
              parts.push(`[${status}]`);
            }
            return `- ${parts.join(" | ")}`;
          });
          profileParts.push(`Wine Cellar (${cellarWines.reduce((s: number, w: any) => s + (w.quantity || 1), 0)} bottles):\n${cellarLines.join("\n")}`);
        }
      } catch { /* cellar fetch failed silently */ }
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
        let cleanText = data.text.replace(/\[PROFILE_UPDATE\][\s\S]*?\[\/PROFILE_UPDATE\]/, "").trim();

        // Parse and process WISHLIST_ADD blocks
        const { blocks: wishlistBlocks, cleanText: afterWishlist } = parseWishlistBlocks(cleanText);
        cleanText = afterWishlist;

        // Insert wishlist items
        const addedNames: string[] = [];
        if (wishlistBlocks.length > 0 && user) {
          for (const wb of wishlistBlocks) {
            if (!wb.name) continue;
            try {
              await directInsert("wine_wishlist", {
                user_id: user.id,
                wine_name: wb.name,
                producer: wb.producer || null,
                region: wb.region || null,
                grapes: wb.grapes || null,
                style: wb.style || null,
                price_estimate: wb.price || null,
                why: wb.why || null,
                source: "sommy",
              });
              addedNames.push(wb.name);
            } catch (e) {
              console.error("Wishlist insert error:", e);
            }
          }
          if (addedNames.length > 0) {
            silentRefresh();
            setToastMsg(`Added ${addedNames.join(", ")} to your wishlist`);
          }
        }

        const { card, prose } = parseWineCard(cleanText);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: prose,
          wineCard: card || undefined,
          wishlistAdded: addedNames.length > 0 ? addedNames : undefined,
        }]);

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

        // Fire-and-forget save — store raw content so wine cards can be re-parsed on reload
        if (user) {
          const rows = [
            { user_id: user.id, role: "user", content: userText, has_image: !!img, image_url: storedImageUrl || null },
            { user_id: user.id, role: "assistant", content: data.text, has_image: false, image_url: null },
          ];
          Promise.all(rows.map(r => directInsert("sommy_conversations", r)))
            .catch(e => console.error("Sommy save error:", e));
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
  }, [messages, isLoading, context, pendingImage, profile, preferences, completedGuideIds, journal, stats, user, silentRefresh]);

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
        <div data-testid="sommy-chatbox" style={{ position: "fixed", bottom: 0, right: 0, width: window.innerWidth <= 640 ? "100vw" : "min(400px, calc(100vw - 32px))", height: window.innerWidth <= 640 ? "calc(100vh - 56px)" : "min(580px, calc(100vh - 100px))", background: "#F7F4EF", borderRadius: window.innerWidth <= 640 ? "16px 16px 0 0" : 20, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", zIndex: 901, overflow: "hidden", border: "1px solid #D4D1CA" }}>

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

          {/* Toast notification */}
          {toastMsg && (
            <div style={{
              position: "absolute", top: 64, left: 16, right: 16, zIndex: 10,
              background: "#4A7A52", color: "#F7F4EF", borderRadius: 10, padding: "8px 14px",
              fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 400,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center",
            }}>
              {toastMsg}
            </div>
          )}

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
                {/* Image preview (current session base64 or stored URL) */}
                {(msg.imagePreview || msg.imageUrl) && (
                  <div style={{ maxWidth: "85%", borderRadius: 12, overflow: "hidden", border: "1px solid #D4D1CA" }}>
                    <img src={msg.imagePreview || msg.imageUrl} alt="Wine label" style={{ width: "100%", height: "auto", display: "block", maxHeight: 200, objectFit: "cover" }} />
                  </div>
                )}

                {/* Wine card */}
                {msg.wineCard && (
                  <div style={{ maxWidth: "92%", background: "white", border: "1px solid #EDEAE3", borderRadius: 14, overflow: "hidden", position: "relative" }}>
                    <div style={{ background: "#8C1C2E", padding: "10px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400, color: "#F7F4EF", lineHeight: 1.2 }}>{msg.wineCard.name}</div>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(247,244,239,0.75)", marginTop: 2 }}>{msg.wineCard.producer}</div>
                      </div>
                      {/* Bookmark/save button */}
                      {user && (
                        <button
                          onClick={() => saveWineCardToWishlist(msg.wineCard!, i)}
                          disabled={savedWineCards.has(i)}
                          title={savedWineCards.has(i) ? "Saved to wishlist" : "Save to wishlist"}
                          style={{
                            background: "none", border: "none", cursor: savedWineCards.has(i) ? "default" : "pointer",
                            padding: 4, flexShrink: 0, marginLeft: 8, marginTop: -2,
                            opacity: savedWineCards.has(i) ? 1 : 0.75,
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={e => { if (!savedWineCards.has(i)) e.currentTarget.style.opacity = "1"; }}
                          onMouseLeave={e => { if (!savedWineCards.has(i)) e.currentTarget.style.opacity = "0.75"; }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={savedWineCards.has(i) ? "#F7F4EF" : "none"} stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                      {[
                        ["Vintage", msg.wineCard.vintage],
                        ["Region", msg.wineCard.region],
                        ["Grapes", msg.wineCard.grapes],
                        ["Style", msg.wineCard.style],
                      ].map(([label, value]) => value && (
                        <div key={label}>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#D4D1CA" }}>{(label as string).toUpperCase()}</div>
                          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 400, color: "#1A1410", display: "flex", alignItems: "center", gap: 4 }}>
                            {label === "Region" && (() => {
                              const country = regionToCountry(value as string);
                              const code = countryCode(country);
                              if (!code) return null;
                              return <img src={`https://flagcdn.com/32x24/${code.toLowerCase()}.png`} alt={country || ""} title={country || ""} width={16} height={12} style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }} />;
                            })()}
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Tasting characteristics — colour-coded by flavour family */}
                    {(msg.wineCard.nose || msg.wineCard.palate || msg.wineCard.texture) && (
                      <div style={{ padding: "8px 14px 12px", borderTop: "1px solid #EDEAE3", display: "flex", flexDirection: "column", gap: 5 }}>
                        {[{label: "NOSE", val: msg.wineCard.nose, colorize: true}, {label: "PALATE", val: msg.wineCard.palate, colorize: true}, {label: "TEXTURE", val: msg.wineCard.texture, colorize: false}]
                          .filter(c => c.val)
                          .map(c => (
                            <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 5, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.46rem", letterSpacing: "0.12em", color: "#D4D1CA", textTransform: "uppercase", paddingTop: 2, flexShrink: 0 }}>{c.label}</span>
                              {c.val!.split(",").map(s => s.trim()).filter(Boolean).map((item, j) => {
                                const col = c.colorize ? classifyTastingNote(item) : neutralPill;
                                return (
                                  <span key={j} style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", padding: "2px 7px", background: col.bg, color: col.color, border: `1px solid ${col.border}`, borderRadius: 5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{item}</span>
                                );
                              })}
                            </div>
                          ))}
                      </div>
                    )}
                    {/* Breathing / decanting guidance */}
                    {msg.wineCard.breathing && (
                      <div style={{ padding: "8px 14px 10px", borderTop: "1px solid #EDEAE3", display: "flex", alignItems: "flex-start", gap: 7 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        <div>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.44rem", letterSpacing: "0.12em", color: "#8C1C2E", textTransform: "uppercase", marginBottom: 2 }}>BREATHING</div>
                          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.4 }}>{msg.wineCard.breathing}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Wishlist confirmation inline */}
                {msg.wishlistAdded && msg.wishlistAdded.length > 0 && (
                  <div style={{
                    background: "rgba(74,122,82,0.08)", borderRadius: 10, padding: "6px 12px",
                    fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 400, color: "#4A7A52",
                    maxWidth: "88%",
                  }}>
                    Added {msg.wishlistAdded.join(", ")} to your wishlist
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
          <ImageCapture onImageSelect={handleImageSelect}>
            {({ openCamera, openGallery }) => (
              <form onSubmit={handleSubmit} style={{ padding: "10px 12px", borderTop: "1px solid #EDEAE3", display: "flex", gap: 8, flexShrink: 0 }}>
                {/* Camera button */}
                <button
                  type="button"
                  onClick={openCamera}
                  title="Take a photo"
                  style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${pendingImage ? "#8C1C2E" : "#D4D1CA"}`, background: pendingImage ? "rgba(140,28,46,0.08)" : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={pendingImage ? "#8C1C2E" : "#5A5248"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                {/* Gallery button */}
                <button
                  type="button"
                  onClick={openGallery}
                  title="Choose from gallery"
                  style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #D4D1CA", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
                >
                  <GalleryIcon size={15} color="#5A5248" />
                </button>

                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={pendingImage ? "Add a message or just send\u2026" : "Ask me anything about wine\u2026"} disabled={isLoading} data-testid="sommy-input"
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
            )}
          </ImageCapture>
        </div>
      )}
    </>
  );
}
