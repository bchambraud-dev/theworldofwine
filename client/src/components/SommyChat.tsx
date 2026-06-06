import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useUserData } from "@/lib/useUserData";
import { guides } from "@/data/guides";
import { supabase } from "@/lib/supabase";
import { directInsert, directSelect, directUpdate, getAccessToken, SUPABASE_URL, ANON_KEY } from "@/lib/supabaseDirectFetch";
import { regionToCountry, countryCode } from "@/lib/countryFlags";
import ImageCapture, { GalleryIcon } from "@/components/ImageCapture";
import SommyMarkdown from "@/components/SommyMarkdown";
import { AwardsRow } from "@/components/AwardsRow";
import { MatchBadge } from "@/components/MatchBadge";
import SommyLoading from "@/components/SommyLoading";

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
  wishlistSuggestions?: WishlistBlock[]; // parsed suggestions for user to save
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
  drink_from: string;
  drink_peak_start: string;
  drink_peak_end: string;
  drink_until: string;
  // Awards + match score — emitted as compact JSON strings in the WINE_CARD
  // block. The shared rubric in /api/wine-context is injected into the chat
  // system prompt so Sommy can fill these in inline (4c).
  awards_json?: any | null;
  match_score_json?: any | null;
}

interface WishlistBlock {
  name: string;
  producer: string;
  region: string;
  grapes: string;
  style: string;
  price: string;
  why: string;
  nose: string;
  palate: string;
  texture: string;
  breathing: string;
  drink_from: string;
  drink_peak_start: string;
  drink_peak_end: string;
  drink_until: string;
}

function parseWineCard(text: string): { card: WineCard | null; prose: string } {
  const match = text.match(/WINE_CARD_START\n([\s\S]*?)\nWINE_CARD_END/);
  if (!match) return { card: null, prose: text };

  const block = match[1];
  const get = (key: string) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`));
    return m ? m[1].trim() : "";
  };

  // Parse JSON-encoded fields safely — if Sommy emits malformed JSON, fall back to null.
  const tryParseJson = (raw: string) => {
    if (!raw || raw === "null" || raw === "none") return null;
    try { return JSON.parse(raw); } catch { return null; }
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
    drink_from: get("drink_from"),
    drink_peak_start: get("drink_peak_start"),
    drink_peak_end: get("drink_peak_end"),
    drink_until: get("drink_until"),
    awards_json: tryParseJson(get("awards")),
    match_score_json: tryParseJson(get("match")),
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
      nose: get("nose"),
      palate: get("palate"),
      texture: get("texture"),
      breathing: get("breathing"),
      drink_from: get("drink_from"),
      drink_peak_start: get("drink_peak_start"),
      drink_peak_end: get("drink_peak_end"),
      drink_until: get("drink_until"),
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
    return { context: "", chips: ["Recommend me a wine", "I'm new to wine — where do I start?", "Best wine with steak?", "Explain tannins"] };
  }, [location]);
}

interface SommyChatProps {
  isOpen: boolean;
  onToggle: () => void;
  /** Optional pre-typed user message. When set, gets auto-sent on next
      chat open so coaching pings can deep-link Sommy into a topic. */
  seededPrompt?: string | null;
  /** Called after the seeded prompt is consumed so App can clear state. */
  onConsumeSeededPrompt?: () => void;
}

export default function SommyChat({ isOpen, onToggle, seededPrompt, onConsumeSeededPrompt }: SommyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Track whether the in-flight request is a label scan (image attached) so
  // we can show the cheeky multi-stage loading state for scans only.
  const [loadingMode, setLoadingMode] = useState<"scan" | "text">("text");
  const [pendingImage, setPendingImage] = useState<{ data: string; mediaType: string; preview: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [savedWineCards, setSavedWineCards] = useState<Set<number>>(new Set());
  // Track saved wishlist suggestions by "msgIdx-blockIdx" key
  const [savedSuggestions, setSavedSuggestions] = useState<Set<string>>(new Set());
  // Shared badge tooltip state (one popover open at a time across all chat cards)
  const [activeAwardTooltip, setActiveAwardTooltip] = useState<string | null>(null);
  const [activeMatchTooltip, setActiveMatchTooltip] = useState<string | null>(null);
  // User's palate digest — sent with every chat turn so Sommy can score matches
  // inline. Loaded once on mount; null when no form completed.
  const [palateDigest, setPalateDigest] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { context, chips } = usePageContext();
  const { user, profile, refreshProfile } = useAuth();
  const { stats, preferences, completedGuideIds, journal, refresh: refreshUserData, silentRefresh } = useUserData();
  const hasGreeted = useRef<string | null>(null);
  // `initCompleted` flips true after the history load + greeting render flow
  // finishes for the current user. The seeded-prompt effect waits for this
  // before sending, so we never race against history hydration and wipe the
  // user's prior conversation view. (Bug fix June 7 2026.)
  const initCompleted = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  // Consume a seeded prompt when one arrives. We wait for the chat to be
  // open AND for init() to finish loading history (initCompleted ref tracks
  // the same user.id we initialised against). Without this gate, a fast tap
  // on the cellar-coaching button races against the DB history load and
  // wipes the in-memory view of prior conversation. (Race fix June 7 2026.)
  const seededConsumed = useRef<string | null>(null);
  useEffect(() => {
    if (!isOpen || !seededPrompt || !user) return;
    if (seededConsumed.current === seededPrompt) return;
    if (isLoading) return;
    if (initCompleted.current !== user.id) return; // wait for history load
    // History is hydrated. Send the seeded message in the next tick so the
    // greeting/history has a chance to paint before the new turn appears.
    const t = setTimeout(() => {
      seededConsumed.current = seededPrompt;
      sendMessage(seededPrompt);
      onConsumeSeededPrompt?.();
    }, 120);
    return () => clearTimeout(t);
  }, [isOpen, seededPrompt, user, isLoading, messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3000);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // Load palate digest once per user. Sent in chat body so Sommy can score
  // match inline. If the user hasn't completed the form, digest stays null
  // and the API skips match generation (graceful no-op).
  useEffect(() => {
    if (!user) { setPalateDigest(null); return; }
    (async () => {
      try {
        const rows = await directSelect<any>(
          "user_preferences",
          `select=palate_digest,palate_form_complete&user_id=eq.${user.id}`
        );
        const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        if (row && row.palate_form_complete && row.palate_digest) {
          setPalateDigest(row.palate_digest);
        } else {
          setPalateDigest(null);
        }
      } catch { /* non-fatal */ }
    })();
  }, [user]);

  // Single sequential effect: load history first, then greet if no history
  useEffect(() => {
    if (!isOpen || !user || historyLoaded.current === user.id) return;
    historyLoaded.current = user.id;

    const init = async () => {
      // Step 1: load history via directSelect (avoids auth lock)
      try {
        const rows = await directSelect<any>(
          "sommy_conversations",
          `select=id,role,content,image_url,created_at,awards_json,match_score_json&user_id=eq.${user.id}&order=created_at.desc&limit=30`
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
              if (card) {
                // Hydrate enrichment from DB columns so awards + match badge
                // survive app restarts (was previously lost — chat looked
                // bare on reopen even though the card was persisted)
                if (row.awards_json) card.awards_json = row.awards_json;
                if (row.match_score_json) card.match_score_json = row.match_score_json;
                msg.wineCard = card;
              }
              if (blocks.length > 0) msg.wishlistSuggestions = blocks;
            }
            return msg;
          });
          setMessages(history);
          initCompleted.current = user.id;
          return;
        }
      } catch (e) {
        console.error("History load error:", e);
      }

      // Step 2: no history — first-ever session. Use a reliable personalised
      // greeting rather than an API call that can fail silently.
      //
      // Two variants:
      //   - Just-finished-onboarding: ?welcome=1 in URL. Use the styles they
      //     just picked so Sommy feels like the onboarding was heard.
      //   - Cold open: generic warm intro keyed to experience level.
      // Copy is time-of-day neutral — no "tonight", no "in your glass",
      // no daily-drinking nudge.
      hasGreeted.current = user.id;
      const name = profile?.display_name?.split(" ")[0] || "";
      const level = profile?.experience_level || "beginner";
      const isPostOnboarding = typeof window !== "undefined" && window.location.search.includes("welcome=1");
      const types = preferences.preferred_types || [];

      let greeting: string;
      if (isPostOnboarding && types.length > 0) {
        const typesPhrase = types.length === 1
          ? `${types[0]} wines`
          : types.length === 2
            ? `${types[0]} and ${types[1]} wines`
            : `${types.slice(0, -1).join(", ")}, and ${types[types.length - 1]} wines`;
        greeting = `Welcome${name ? `, ${name}` : ""}. You mentioned you enjoy ${typesPhrase} — that's a great starting point.

Tell me about a wine you've tried and loved, or scan a label you're curious about. I'll take it from there.`;
      } else {
        const openingQuestion: Record<string, string> = {
          beginner:     "What draws you to wine? Are you exploring something new, looking for a great bottle for an occasion, or just curious about where to start?",
          intermediate: "What are you looking to discover — a region you haven't explored, a style you want to go deeper into, or a pairing for something specific?",
          expert:       "What are you exploring lately? A producer, vintage, or appellation that's caught your attention?",
        };
        greeting = `Hey${name ? ` ${name}` : ""}. I'm Sommy — your wine companion at The World of Wine. I'm starting fresh, which means I get to learn what you love as we go.

${openingQuestion[level] || openingQuestion.beginner}

The more you share — what you enjoy, what you've tried, even what you definitely don't like — the better I can point you toward wines that'll genuinely excite you.`;
      }

      setMessages([{ role: "assistant", content: greeting }]);
      initCompleted.current = user.id;
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

  // Tag tap shows a confirmation prompt rather than saving silently
  const [pendingWineConfirm, setPendingWineConfirm] = useState<string | null>(null);
  const promptWineConfirm = useCallback((wineName: string) => {
    if (!user) {
      setToastMsg("Sign in to save wines");
      return;
    }
    setPendingWineConfirm(wineName);
  }, [user]);

  const confirmSaveWine = useCallback(async () => {
    const wineName = pendingWineConfirm;
    if (!wineName || !user) return;
    setPendingWineConfirm(null);
    try {
      await directInsert("wine_wishlist", {
        user_id: user.id,
        wine_name: wineName,
        source: "sommy",
      });
      setToastMsg(`Added ${wineName} to your wishlist`);
      silentRefresh();
    } catch (e) {
      console.error("Wishlist save error:", e);
      setToastMsg("Could not save — try again");
    }
  }, [pendingWineConfirm, user, silentRefresh]);

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
        vintage: card.vintage || null,
        nose: card.nose || null,
        palate: card.palate || null,
        texture: card.texture || null,
        breathing: card.breathing || null,
        drink_from: card.drink_from ? parseInt(card.drink_from) : null,
        drink_peak_start: card.drink_peak_start ? parseInt(card.drink_peak_start) : null,
        drink_peak_end: card.drink_peak_end ? parseInt(card.drink_peak_end) : null,
        drink_until: card.drink_until ? parseInt(card.drink_until) : null,
        // Carry Sommy's inline awards + match score forward so the wishlist
        // entry is born already populated — no re-generation needed on first load.
        awards_json: card.awards_json || null,
        awards_generated_at: card.awards_json ? new Date().toISOString() : null,
        match_score_json: card.match_score_json || null,
        match_score_generated_at: card.match_score_json ? new Date().toISOString() : null,
      });
      setSavedWineCards(prev => new Set(prev).add(msgIdx));
      setToastMsg(`Added ${card.name} to your wishlist`);
      silentRefresh();
    } catch (e) {
      console.error("Wishlist save error:", e);
    }
  }, [user, silentRefresh]);

  // Save a wishlist suggestion (from WISHLIST_ADD block) when user clicks bookmark
  const saveWishlistSuggestion = useCallback(async (wb: WishlistBlock, msgIdx: number, blockIdx: number) => {
    if (!user) return;
    const key = `${msgIdx}-${blockIdx}`;
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
        nose: wb.nose || null,
        palate: wb.palate || null,
        texture: wb.texture || null,
        breathing: wb.breathing || null,
        drink_from: wb.drink_from ? parseInt(wb.drink_from) : null,
        drink_peak_start: wb.drink_peak_start ? parseInt(wb.drink_peak_start) : null,
        drink_peak_end: wb.drink_peak_end ? parseInt(wb.drink_peak_end) : null,
        drink_until: wb.drink_until ? parseInt(wb.drink_until) : null,
        sommy_notes: wb.why || null,
      });
      setSavedSuggestions(prev => new Set(prev).add(key));
      silentRefresh();
    } catch (e) {
      console.error("Wishlist suggestion save error:", e);
    }
  }, [user, silentRefresh]);

  const sendMessage = useCallback(async (text: string, imageOverride?: typeof pendingImage) => {
    if ((!text.trim() && !imageOverride && !pendingImage) || isLoading) return;
    const img = imageOverride || pendingImage;
    const userText = text.trim() || "What wine is this? Tell me about it.";

    // FIRST — render the user message instantly with the local preview.
    // The Supabase Storage upload (used for history persistence) runs in
    // parallel and writes the final image_url back into the DB row later.
    // Pre-fix: send tap had a 5-second perceived lag because the upload
    // resolved BEFORE we showed the message. Now it's optimistic.
    const userMessage: Message = {
      role: "user",
      content: userText,
      imagePreview: img?.preview,
      imageUrl: undefined,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setPendingImage(null);
    setLoadingMode(img ? "scan" : "text");
    setIsLoading(true);

    // Upload image to Supabase Storage in the BACKGROUND. The chat API call
    // doesn't need this URL (it gets the base64 directly via img.data), and
    // the in-session display already shows the local preview. The URL is
    // only needed when persisting the message for later history reloads.
    let storedImageUrlPromise: Promise<string | undefined> = Promise.resolve(undefined);
    if (img && user) {
      storedImageUrlPromise = (async () => {
        try {
          const token = await getAccessToken();
          if (!token) return undefined;
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
            return `${SUPABASE_URL}/storage/v1/object/public/wine-labels/${path}`;
          }
        } catch (e) {
          console.error("Image upload error:", e);
        }
        return undefined;
      })();
    }

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
      // Journal context — AGGREGATE ONLY. We never send specific wine names
      // to Sommy. This was a continuous source of frustration: Sommy would
      // anchor on the same 1-2 highly-rated wines (Tronquoy, Zinfandel) and
      // reference them in every response, even after the prompt explicitly
      // said not to. The only reliable fix is removing them from context entirely.
      // The palate digest (from the form) is the primary signal; the journal
      // contributes only style awareness (regions/grapes the user has explored).
      if (journal.length > 0) {
        const highlyRated = journal.filter(w => (w.personal_rating ?? 0) >= 4);
        const regions = Array.from(new Set(journal.map(w => w.region).filter(Boolean))).slice(0, 10);
        const grapes  = Array.from(new Set(journal.map(w => w.grapes).filter(Boolean))).slice(0, 10);
        const ratings = journal.map(w => w.personal_rating).filter(r => r != null) as number[];
        const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

        const summaryParts: string[] = [`${journal.length} wines logged, ${highlyRated.length} rated 4+ stars`];
        if (avgRating) summaryParts.push(`average rating ${avgRating}/5`);
        if (regions.length) summaryParts.push(`regions explored: ${regions.join(", ")}`);
        if (grapes.length)  summaryParts.push(`grapes tasted: ${grapes.join(", ")}`);

        profileParts.push(`Exploration signal (aggregate — use for style awareness only; do not name any specific past wine): ${summaryParts.join("; ")}`);
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
      // Include cellar data so Sommy can suggest pairings from owned wines.
      // Bug May 26 2026: Brice asked Sommy about a Tignanello he owned and
      // Sommy denied it twice — because the cellar fetch was capped at the
      // first 10 wines AND had no ORDER BY, so Postgres returned an arbitrary
      // 10 of his 20 wines on each request. Tignanello (position ~15) never
      // reached the model. Fix: order deterministically by added_at DESC and
      // send up to 50 wines (~4KB context, trivial). For users with >50
      // wines, system prompt instructs Sommy to acknowledge the truncation
      // honestly rather than pretend a wine doesn't exist.
      try {
        const cellarWines = await directSelect<any>(
          "wine_cellar",
          `select=wine_name,producer,vintage,region,grapes,style,quantity,drink_from,drink_peak_start,drink_peak_end,drink_until,status,created_at&user_id=eq.${user!.id}&status=eq.active&order=created_at.desc.nullslast,wine_name.asc&limit=50`,
          5000,
        );
        if (cellarWines.length > 0) {
          const now = new Date().getFullYear();
          const cellarLines = cellarWines.map((w: any) => {
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
          const totalBottles = cellarWines.reduce((s: number, w: any) => s + (w.quantity || 1), 0);
          const truncatedNote = cellarWines.length === 50
            ? " — NOTE: this list shows the 50 most recently added wines; older bottles may exist that aren't listed here. If asked about a specific wine not in this list, say you don't see it in the recent additions and offer to look it up."
            : "";
          profileParts.push(`Wine Cellar (${totalBottles} bottles, ${cellarWines.length} unique wines shown${truncatedNote}):\n${cellarLines.join("\n")}`);
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
      // Include palate digest so Sommy can emit match scores inline in WINE_CARDs (4c)
      if (palateDigest) body.palate_digest = palateDigest;

      // Client-side timeout: label scans + match scoring can push responses
      // toward Vercel's 60s server limit. Give a small buffer on the client.
      const abort = new AbortController();
      const abortTimer = setTimeout(() => abort.abort(), 58000);

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

        const { card, prose } = parseWineCard(cleanText);
        // The card index where it'll land in messages — used by the split-flow
        // enrichment below so it can patch the right message when awards/match
        // arrive asynchronously. We compute this BEFORE setMessages so the
        // patch can match by message position rather than content (which the
        // user could trigger to change by sending another message quickly).
        let cardMsgIdx = -1;
        setMessages(prev => {
          cardMsgIdx = prev.length;
          return [...prev, {
            role: "assistant",
            content: prose,
            wineCard: card || undefined,
            wishlistSuggestions: wishlistBlocks.length > 0 ? wishlistBlocks : undefined,
          }];
        });

        // ── Persist BEFORE enrichment so the assistant row ID exists ──
        // when background calls below want to PATCH it with awards/match.
        let assistantRowId: string | null = null;
        if (user) {
          // User row — image_url populated when upload resolves (fire-and-forget)
          storedImageUrlPromise.then(url => {
            directInsert("sommy_conversations", {
              user_id: user.id, role: "user", content: userText,
              has_image: !!img, image_url: url || null,
            }).catch(e => console.error("Sommy user-row save error:", e));
          });
          // Assistant row — await so we can capture the id for enrichment patching
          try {
            const inserted = await directInsert<{ id: string }>(
              "sommy_conversations",
              {
                user_id: user.id, role: "assistant", content: data.text,
                has_image: false, image_url: null,
              },
              15000,
              { returnRow: true },
            );
            if (Array.isArray(inserted) && inserted[0]?.id) {
              assistantRowId = inserted[0].id;
            }
          } catch (e) {
            console.error("Sommy assistant-row save error:", e);
          }
        }

        // ── Split-flow enrichment: fetch awards + match in the background ──
        // The chat endpoint no longer generates these inline (kept it fast and
        // under the timeout). We fetch them in parallel via /api/wine-context
        // and patch the wine card when each lands. We ALSO persist the result
        // to the assistant's sommy_conversations row so the card renders fully
        // when the user reopens the app (bug fix May 2026: cards were going
        // bare on reload because awards/match weren't being saved).
        if (card?.name && cardMsgIdx >= 0) {
          const wineForContext = {
            id: `chat-${Date.now()}`,
            wine_name: card.name,
            vintage: card.vintage ? Number(card.vintage) : null,
            producer: card.producer,
            region: card.region,
            grapes: card.grapes,
            style: card.style,
          };

          // Awards — evergreen per bottle, no palate needed
          fetch("/api/wine-context", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "awards", wine: wineForContext }),
          })
            .then(r => r.ok ? r.json() : null)
            .then(json => {
              if (!json?.data) return;
              setMessages(prev => prev.map((m, idx) =>
                idx === cardMsgIdx && m.wineCard
                  ? { ...m, wineCard: { ...m.wineCard, awards_json: json.data } }
                  : m
              ));
              // Persist to the chat history row so it survives reload
              if (assistantRowId) {
                directUpdate("sommy_conversations", assistantRowId, {
                  awards_json: json.data,
                }).catch(e => console.warn("awards persist failed:", e));
              }
            })
            .catch(() => { /* silent — awards are optional enrichment */ });

          // Match (only when palate exists)
          if (palateDigest) {
            // Prefer the cellar's stored match score if this wine is already
            // in the user's cellar. This guarantees the chat and cellar show
            // the SAME score for the same bottle (bug fix May 2026).
            (async () => {
              if (user) {
                try {
                  const vintageNum = card.vintage ? Number(card.vintage) : null;
                  const vintageFilter = vintageNum ? `&vintage=eq.${vintageNum}` : "";
                  const matches = await directSelect<any>(
                    "wine_cellar",
                    `select=match_score_json&user_id=eq.${user.id}&wine_name=ilike.${encodeURIComponent(card.name)}${vintageFilter}&match_score_json=not.is.null&limit=1`,
                  );
                  if (Array.isArray(matches) && matches[0]?.match_score_json) {
                    const m = matches[0].match_score_json;
                    setMessages(prev => prev.map((msg, idx) =>
                      idx === cardMsgIdx && msg.wineCard
                        ? { ...msg, wineCard: { ...msg.wineCard, match_score_json: m } }
                        : msg
                    ));
                    if (assistantRowId) {
                      directUpdate("sommy_conversations", assistantRowId, {
                        match_score_json: m,
                      }).catch(e => console.warn("match persist failed:", e));
                    }
                    return;
                  }
                } catch (e) {
                  // fall through to fresh generation
                }
              }

              // No cellar match — generate fresh
              try {
                const resp = await fetch("/api/wine-context", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    kind: "match",
                    wine: wineForContext,
                    palate_digest: palateDigest,
                  }),
                });
                if (!resp.ok) return;
                const json = await resp.json();
                if (!json?.data) return;
                setMessages(prev => prev.map((msg, idx) =>
                  idx === cardMsgIdx && msg.wineCard
                    ? { ...msg, wineCard: { ...msg.wineCard, match_score_json: json.data } }
                    : msg
                ));
                if (assistantRowId) {
                  directUpdate("sommy_conversations", assistantRowId, {
                    match_score_json: json.data,
                  }).catch(e => console.warn("match persist failed:", e));
                }
              } catch { /* silent */ }
            })();
          }
        }

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

        // (Persistence happened earlier so enrichment patch could use the row id)
      } else if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: data.error }]);
      }
    } catch (e: any) {
      console.error("Sommy error:", e?.message || e);
      // Friendlier timeout copy + suggest what to try next. The previous
      // generic "too long" line gave no direction. Image scans of poor-quality
      // labels are the most common cause.
      const msg = e?.name === "AbortError"
        ? (img
            ? "Sommy needs a moment longer than usual on this label. Try a clearer, head-on photo of the front — or describe the wine in text and I'll pick it up."
            : "That took longer than usual. Try again, or rephrase — something specific helps me think faster.")
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
        <button onClick={onToggle} data-testid="sommy-float-btn" style={{ position: "fixed", bottom: "calc(24px + env(safe-area-inset-bottom, 0px))", right: 20, display: "flex", alignItems: "center", gap: 10, padding: "15px 26px", borderRadius: 32, background: "#8C1C2E", color: "#F7F4EF", border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(140,28,46,0.42), 0 2px 8px rgba(0,0,0,0.18)", zIndex: 900, fontFamily: "'Jost', sans-serif", fontSize: "1rem", fontWeight: 500 }}>
          <img src="/sommy-avatar-circle.png" alt="" style={{ width: 28, height: 28, borderRadius: "50%", background: "#F7F4EF", objectFit: "cover", marginLeft: -6 }} />
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.14em" }}>ASK</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1.1rem", fontWeight: 500 }}>Sommy</span>
        </button>
      )}

      {/* Chat popup */}
      {isOpen && (
        <div data-testid="sommy-chatbox" style={window.innerWidth <= 1024 ? { position: "fixed", top: "calc(52px + env(safe-area-inset-top, 0px))", bottom: 0, left: 0, right: 0, background: "#F7F4EF", borderRadius: "16px 16px 0 0", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", zIndex: 901, overflow: "hidden", border: "1px solid #D4D1CA" } : { position: "fixed", bottom: 0, right: 0, width: "min(400px, calc(100vw - 32px))", height: "min(580px, calc(100vh - 100px))", background: "#F7F4EF", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", zIndex: 901, overflow: "hidden", border: "1px solid #D4D1CA" }}>

          {/* Header */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #EDEAE3", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/sommy-avatar-circle.png" alt="Sommy" style={{ width: 36, height: 36, borderRadius: "50%", background: "#EDEAE3", objectFit: "cover" }} />
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.78rem", fontWeight: 400, letterSpacing: "0.12em", color: "#1A1410" }}>ASK</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1.18rem", fontWeight: 400, color: "#8C1C2E" }}>Sommy</span>
                </div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", fontWeight: 300, color: "#5A5248" }}>Your wine companion</div>
              </div>
            </div>
            <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#5A5248", fontSize: 22, lineHeight: 1 }} aria-label="Close">&#x2715;</button>
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

          {/* Wishlist confirmation sheet */}
          {pendingWineConfirm && (
            <div
              onClick={() => setPendingWineConfirm(null)}
              style={{
                position: "absolute", inset: 0, zIndex: 30,
                background: "rgba(26,20,16,0.45)",
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                animation: "fadeIn 0.15s ease-out",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#F7F4EF",
                  borderRadius: "16px 16px 0 0",
                  padding: "22px 22px 28px",
                  width: "100%",
                  maxWidth: 440,
                  boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "#5A5248", marginBottom: 8 }}>
                  Save to wishlist
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 400, color: "#1A1410", marginBottom: 6, lineHeight: 1.25 }}>
                  {pendingWineConfirm}
                </div>
                <div style={{ fontSize: "0.92rem", color: "#5A5248", lineHeight: 1.5, marginBottom: 22 }}>
                  Add this to your wishlist so you can find it later in My Wishlist.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setPendingWineConfirm(null)}
                    style={{
                      flex: 1, padding: "12px 18px", borderRadius: 10,
                      background: "transparent", border: "1px solid #D4D1CA",
                      color: "#1A1410", fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", fontWeight: 400,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSaveWine}
                    style={{
                      flex: 1, padding: "12px 18px", borderRadius: 10,
                      background: "#8C1C2E", border: "none",
                      color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Add to wishlist
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Welcome */}
            {messages.length === 0 && !isLoading && (
              <div>
                <div style={{ background: "#EDEAE3", borderRadius: "14px 14px 14px 4px", padding: "12px 15px", maxWidth: "88%", marginBottom: 14 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.98rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.55, margin: 0 }}>
                    Hey, I'm Sommy. Ask me anything about wine — or tap the <strong style={{fontWeight:500}}>+</strong> below to scan a label and I'll tell you if it's worth your time.
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {chips.map(chip => (
                    <button key={chip} onClick={() => sendMessage(chip)} style={{ background: "white", border: "1px solid #D4D1CA", borderRadius: 18, padding: "7px 14px", fontFamily: "'Jost', sans-serif", fontSize: "0.86rem", fontWeight: 400, color: "#8C1C2E", cursor: "pointer" }}>
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
                  <div style={{ maxWidth: "92%", background: "white", border: "1px solid #EDEAE3", borderRadius: 14, overflow: "visible", position: "relative" }}>
                    <div style={{ background: "#8C1C2E", padding: "10px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderRadius: "14px 14px 0 0" }}>
                      <div style={{ flex: 1, paddingRight: msg.wineCard.match_score_json ? 10 : 0 }}>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1rem", fontWeight: 400, color: "#F7F4EF", lineHeight: 1.25, wordBreak: "break-word", overflowWrap: "anywhere" }}>{msg.wineCard.name}</div>
                        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "rgba(247,244,239,0.75)", marginTop: 2 }}>{msg.wineCard.producer}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexShrink: 0 }}>
                        {/* Match circle in the burgundy header. Solid white
                            background so the percent stays legible on the dark surface. */}
                        {msg.wineCard.match_score_json && typeof msg.wineCard.match_score_json.score === "number" && (
                          <div style={{ zIndex: activeMatchTooltip === `chat-${i}-match` ? 120 : 2, position: "relative" }}>
                            <MatchBadge
                              match={msg.wineCard.match_score_json}
                              hostId={`chat-${i}`}
                              activeTooltipId={activeMatchTooltip}
                              onToggleTooltip={setActiveMatchTooltip}
                              size={36}
                              onDarkSurface
                            />
                          </div>
                        )}
                        {/* Bookmark/save button */}
                        {user && (
                          <button
                            onClick={() => saveWineCardToWishlist(msg.wineCard!, i)}
                            disabled={savedWineCards.has(i)}
                            title={savedWineCards.has(i) ? "Saved to wishlist" : "Save to wishlist"}
                            style={{
                              background: "none", border: "none", cursor: savedWineCards.has(i) ? "default" : "pointer",
                              padding: 4, marginTop: -2,
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
                    </div>
                    {/* Awards row — quietly under the burgundy header so it doesn't fight
                        the gold-accent badges with the burgundy. */}
                    {msg.wineCard.awards_json && (
                      <div style={{ padding: "8px 14px 0" }}>
                        <AwardsRow
                          awards={msg.wineCard.awards_json}
                          hostId={`chat-${i}`}
                          activeTooltipId={activeAwardTooltip}
                          onToggleTooltip={setActiveAwardTooltip}
                          marginTop={0}
                        />
                      </div>
                    )}
                    <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                      {[
                        ["Vintage", msg.wineCard.vintage],
                        ["Region", msg.wineCard.region],
                        ["Grapes", msg.wineCard.grapes],
                        ["Style", msg.wineCard.style],
                      ].map(([label, value]) => value && (
                        <div key={label}>
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7A7568" }}>{(label as string).toUpperCase()}</div>
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
                            <div key={c.label} style={{ display: "flex", alignItems: "flex-start", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.12em", color: "#7A7568", textTransform: "uppercase", paddingTop: 2, flexShrink: 0 }}>{c.label}</span>
                              {c.val!.split(",").map(s => s.trim()).filter(Boolean).map((item, j) => {
                                const col = c.colorize ? classifyTastingNote(item) : neutralPill;
                                return (
                                  <span key={j} style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.08em", padding: "4px 10px", background: col.bg, color: col.color, border: `1px solid ${col.border}`, borderRadius: 5, textTransform: "uppercase", whiteSpace: "nowrap" }}>{item}</span>
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
                          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.12em", color: "#8C1C2E", textTransform: "uppercase", marginBottom: 2 }}>BREATHING</div>
                          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", fontWeight: 300, color: "#1A1410", lineHeight: 1.4 }}>{msg.wineCard.breathing}</div>
                        </div>
                      </div>
                    )}
                    {/* Readiness bar */}
                    {(() => {
                      const df = parseInt(msg.wineCard.drink_from);
                      const du = parseInt(msg.wineCard.drink_until);
                      if (!df || !du || du <= df) return null;
                      const ps = parseInt(msg.wineCard.drink_peak_start) || df;
                      const pe = parseInt(msg.wineCard.drink_peak_end) || du;
                      const now = new Date().getFullYear();
                      const isBefore = now < df;
                      const isAfter = now > du;
                      const holdYrs = isBefore ? Math.min(df - now, 6) : 0;
                      const pastYrs = isAfter ? Math.min(now - du, 4) : 0;
                      const winSpan = du - df;
                      const total = holdYrs + winSpan + pastYrs;
                      const hPct = (holdYrs / total) * 100;
                      const rPct = ((ps - df) / total) * 100;
                      const pPct = ((pe - ps) / total) * 100;
                      const sPct = ((du - pe) / total) * 100;
                      const paPct = (pastYrs / total) * 100;
                      const nowPct = isBefore ? ((now - (df - holdYrs)) / total) * 100
                        : isAfter ? ((holdYrs + winSpan + (now - du)) / total) * 100
                        : ((holdYrs + (now - df)) / total) * 100;
                      const phase = isBefore ? "hold" : isAfter ? "past" : (now >= ps && now <= pe) ? "peak" : (now > pe) ? "soon" : "ready";
                      const phColors: Record<string, string> = { hold: "#7A9AB5", ready: "#6B9E6B", peak: "#1F6B35", soon: "#C8962E", past: "#A67055" };
                      const phLabels: Record<string, string> = { hold: "Hold", ready: "Ready", peak: "Peak", soon: "Drink Soon", past: "Past Peak" };
                      const mc = phColors[phase];
                      return (
                        <div style={{ padding: "10px 14px 12px", borderTop: "1px solid #EDEAE3" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: mc }}>{phLabels[phase]}</span>
                          </div>
                          <div style={{ position: "relative", height: 8, borderRadius: 4, overflow: "visible", background: "#EDEAE3" }}>
                            <div style={{ position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden" }}>
                              {hPct > 0 && <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${hPct}%`, background: "#7A9AB5", opacity: 0.5 }} />}
                              {rPct > 0 && <div style={{ position: "absolute", left: `${hPct}%`, top: 0, height: "100%", width: `${rPct}%`, background: "#6B9E6B" }} />}
                              <div style={{ position: "absolute", left: `${hPct + rPct}%`, top: 0, height: "100%", width: `${pPct}%`, background: "#1F6B35" }} />
                              {sPct > 0 && <div style={{ position: "absolute", left: `${hPct + rPct + pPct}%`, top: 0, height: "100%", width: `${sPct}%`, background: "#C8962E" }} />}
                              {paPct > 0 && <div style={{ position: "absolute", left: `${hPct + rPct + pPct + sPct}%`, top: 0, height: "100%", width: `${paPct}%`, background: "#A67055", opacity: 0.5 }} />}
                            </div>
                            <div style={{ position: "absolute", left: `${Math.max(3, Math.min(97, nowPct))}%`, top: -16, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                              <div style={{ fontSize: "0.5rem", fontFamily: "'Geist Mono', monospace", fontWeight: 700, color: "#fff", background: mc, borderRadius: 4, padding: "2px 5px", lineHeight: 1.2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>NOW</div>
                              <div style={{ width: 0, height: 0, borderLeft: "3.5px solid transparent", borderRight: "3.5px solid transparent", borderTop: `3.5px solid ${mc}` }} />
                              <div style={{ width: 2, height: 7, background: mc, borderRadius: 1, marginTop: -0.5 }} />
                            </div>
                          </div>
                          <div style={{ position: "relative", height: 14, marginTop: 2 }}>
                            {hPct > 0 && <span style={{ position: "absolute", left: `${hPct}%`, transform: "translateX(-50%)", fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", fontWeight: 500, color: "#7A7568" }}>{df}</span>}
                            {ps > df && <span style={{ position: "absolute", left: `${hPct + rPct}%`, transform: "translateX(-50%)", fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", fontWeight: 500, color: "#7A7568" }}>{ps}</span>}
                            {pe < du && <span style={{ position: "absolute", left: `${hPct + rPct + pPct}%`, transform: "translateX(-50%)", fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", fontWeight: 500, color: "#7A7568" }}>{pe}</span>}
                            <span style={{ position: "absolute", right: 0, fontFamily: "'Geist Mono', monospace", fontSize: "0.5rem", fontWeight: 500, color: "#7A7568" }}>{du}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Wishlist suggestion cards */}
                {msg.wishlistSuggestions && msg.wishlistSuggestions.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: "92%" }}>
                    {msg.wishlistSuggestions.map((wb, j) => {
                      const key = `${i}-${j}`;
                      const isSaved = savedSuggestions.has(key);
                      const country = wb.region ? regionToCountry(wb.region) : null;
                      const code = country ? countryCode(country) : null;
                      return (
                        <div key={key} style={{ background: "white", border: "1px solid #EDEAE3", borderRadius: 12, overflow: "hidden" }}>
                          <div style={{ padding: "10px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.92rem", fontWeight: 400, color: "#1A1410", lineHeight: 1.2 }}>{wb.name}</div>
                              {wb.producer && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", fontWeight: 300, color: "#5A5248", marginTop: 2 }}>{wb.producer}</div>}
                              {wb.region && (
                                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "#5A5248", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                                  {code && <img src={`https://flagcdn.com/32x24/${code.toLowerCase()}.png`} alt={country || ""} width={14} height={10} style={{ borderRadius: 1.5, objectFit: "cover", flexShrink: 0 }} />}
                                  {wb.region}
                                </div>
                              )}
                            </div>
                            {user && (
                              <button
                                onClick={() => saveWishlistSuggestion(wb, i, j)}
                                disabled={isSaved}
                                title={isSaved ? "Saved to wishlist" : "Save to wishlist"}
                                style={{
                                  background: "none", border: "none", cursor: isSaved ? "default" : "pointer",
                                  padding: 4, flexShrink: 0, marginTop: -2,
                                  opacity: isSaved ? 1 : 0.65, transition: "opacity 0.15s",
                                }}
                                onMouseEnter={e => { if (!isSaved) e.currentTarget.style.opacity = "1"; }}
                                onMouseLeave={e => { if (!isSaved) e.currentTarget.style.opacity = "0.65"; }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "#8C1C2E" : "none"} stroke="#8C1C2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {(wb.grapes || wb.style || wb.price) && (
                            <div style={{ padding: "0 12px 8px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {[wb.grapes, wb.style, wb.price].filter(Boolean).map((pill, pi) => (
                                <span key={pi} style={{
                                  fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", fontWeight: 400,
                                  color: "#5A5248", background: "#F7F4EF", borderRadius: 6, padding: "2px 7px",
                                }}>{pill}</span>
                              ))}
                            </div>
                          )}
                          {wb.why && (
                            <div style={{ padding: "0 12px 10px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", fontStyle: "italic", color: "#5A5248", lineHeight: 1.4 }}>
                              {wb.why}
                            </div>
                          )}
                          {isSaved && (
                            <div style={{
                              padding: "5px 12px 8px", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem",
                              fontWeight: 400, color: "#4A7A52", display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4A7A52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              Saved to wishlist
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Text bubble */}
                {msg.content && (
                  <div style={{ background: msg.role === "user" ? "#8C1C2E" : "#EDEAE3", color: msg.role === "user" ? "#F7F4EF" : "#1A1410", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "11px 15px", maxWidth: "88%", fontFamily: "'Jost', sans-serif", fontSize: "0.98rem", fontWeight: 300, lineHeight: 1.55 }}>
                    <SommyMarkdown text={msg.content} isUser={msg.role === "user"} onWineTap={promptWineConfirm} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && <SommyLoading mode={loadingMode} />}
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
                  style={{ flex: 1, border: "1px solid #D4D1CA", borderRadius: 22, padding: "10px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.98rem", fontWeight: 300, color: "#1A1410", background: "white", outline: "none" }}
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
