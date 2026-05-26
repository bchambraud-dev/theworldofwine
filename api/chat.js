import Anthropic from "@anthropic-ai/sdk";

// Increase Vercel function timeout to 60s (conversation history makes responses slower)
// 90s allows label scans (image vision is slow) to complete without
// edge-case timeouts. Awards + match are NO LONGER generated in this call
// — see split-flow comment below. Without those two JSON blobs the call is
// already faster, but the extra headroom prevents the user-facing 'took too
// long' message on borderline cases.
export const config = { maxDuration: 90 };

const SUPABASE_URL = "https://auth.theworldofwine.org";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc3NjEzMSwiZXhwIjoyMDg3MzUyMTMxfQ.JEXkuSX8vPCTMf8v5w1Wm5t-vIGMgYRLvPSQBgp5Vlk";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYxMzEsImV4cCI6MjA4NzM1MjEzMX0.QMqRA-a89wOTNNOnc_zchjSnqQ9QDfbYWiXXcu-4dg4";

// ── Wine assessment cache ──────────────────────────────────────────────────
function buildWineKey(name, vintage, producer) {
  return [name, vintage, producer].filter(Boolean).join("|").toLowerCase().trim();
}

function parseWineCardFields(text) {
  const match = text.match(/WINE_CARD_START\n([\s\S]*?)WINE_CARD_END/);
  if (!match) return null;
  const obj = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) obj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return obj;
}

function rebuildWineCard(cached, userCurrency) {
  // Rebuild WINE_CARD block from cached fields, adapting price to user currency
  const price = userCurrency && userCurrency !== "USD" && cached.price_usd
    ? cached.price_usd // Price is stored as text with USD — Sommy's prose will use user currency
    : cached.price_usd || "";
  return `WINE_CARD_START
name: ${cached.wine_name || ""}
producer: ${cached.producer || ""}
vintage: ${cached.vintage || ""}
region: ${cached.region || ""}
grapes: ${cached.grapes || ""}
style: ${cached.style || ""}
price: ${price}
nose: ${cached.nose || ""}
palate: ${cached.palate || ""}
texture: ${cached.texture || ""}
breathing: ${cached.breathing || ""}
drink_from: ${cached.drink_from || ""}
drink_peak_start: ${cached.drink_peak_start || ""}
drink_peak_end: ${cached.drink_peak_end || ""}
drink_until: ${cached.drink_until || ""}
WINE_CARD_END`;
}

async function getCachedAssessment(wineKey) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/wine_assessments?wine_key=eq.${encodeURIComponent(wineKey)}&select=*&limit=1`,
      { headers: { Authorization: `Bearer ${SUPABASE_KEY}`, apikey: ANON_KEY } }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows.length > 0 ? rows[0] : null;
  } catch { return null; }
}

async function cacheAssessment(wineKey, fields) {
  try {
    const vintageNum = fields.vintage && fields.vintage !== "NV" ? parseInt(fields.vintage) : null;
    await fetch(`${SUPABASE_URL}/rest/v1/wine_assessments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        wine_key: wineKey,
        wine_name: fields.name || null,
        producer: fields.producer || null,
        vintage: vintageNum,
        region: fields.region || null,
        grapes: fields.grapes || null,
        style: fields.style || null,
        price_usd: fields.price || null,
        nose: fields.nose || null,
        palate: fields.palate || null,
        texture: fields.texture || null,
        breathing: fields.breathing || null,
        drink_from: fields.drink_from ? parseInt(fields.drink_from) : null,
        drink_peak_start: fields.drink_peak_start ? parseInt(fields.drink_peak_start) : null,
        drink_peak_end: fields.drink_peak_end ? parseInt(fields.drink_peak_end) : null,
        drink_until: fields.drink_until ? parseInt(fields.drink_until) : null,
      }),
    });
  } catch { /* cache write failure is non-critical */ }
}

// ── System prompt ──────────────────────────────────────────────────────────
const SYSTEM = `You are Sommy, the AI sommelier for The World of Wine. You're a warm, knowledgeable friend who speaks directly to the person — first person, never third person. Warm, direct, approachable — never stuffy. You make wine feel accessible without dumbing it down. Keep responses concise — 2-4 short paragraphs max. Lead with the answer. Use concrete examples with specific regions, producers, and price ranges. Never use emojis. Never say "great question!" or start with "As a sommelier...". Speak naturally in flowing prose, not bullet points.

WHEN ANALYSING A WINE LABEL IMAGE:
Read the label carefully and extract: wine name, producer/winery, vintage year, region/appellation, grape varieties. Then give Sommy's personalised assessment.

Always structure your label response EXACTLY like this (so the app can parse it):

WINE_CARD_START
name: [wine name]
producer: [producer/winery name]
vintage: [year, or "NV" if non-vintage]
region: [region/appellation]
grapes: [grape variety or varieties]
style: [e.g. "Red — Bold and Structured" or "White — Crisp and Mineral"]
price: [approximate market price range in the user's preferred currency if specified in their profile, otherwise USD. Use the appropriate symbol, e.g. "S$35-55" for SGD, "€25-40" for EUR, "US$25-40" for USD]
nose: [comma-separated aromas — everything you'd smell: fruit, floral, earth, oak, spice, e.g. "Cherry, Violet, Cedar, Vanilla, Leather"]
palate: [comma-separated flavours you'd taste on the palate, e.g. "Blackberry, Plum, Dark chocolate, Espresso, Black pepper"]
texture: [comma-separated mouthfeel descriptors, e.g. "Silky tannins, Full body, Bright acidity, Long finish"]
breathing: [concise decanting/breathing recommendation with brief reason, e.g. "Decant 1-2 hours — young tannins need time to soften and dark fruit to emerge" or "Drink now — light and aromatic, best enjoyed fresh" or "30 minutes in a wide glass — let the oak integrate"]
drink_from: [earliest year the wine will be enjoyable, e.g. "2026"]
drink_peak_start: [year the wine enters its peak drinking window, e.g. "2030"]
drink_peak_end: [year the peak window ends and the wine starts to decline, e.g. "2040"]
drink_until: [latest year the wine should be consumed by, e.g. "2050"]
awards: [see AWARDS+MATCH section if a palate is provided, otherwise omit this line]
match: [see AWARDS+MATCH section if a palate is provided, otherwise omit this line]
WINE_CARD_END

CRITICAL: The awards: and match: lines (when emitted) MUST appear INSIDE the WINE_CARD_START / WINE_CARD_END block. NEVER emit them as standalone lines in your conversational prose — they will render as broken text. They are structured fields, not narrative content.

If the user has a currency preference in their profile, always quote wine prices in that currency using the appropriate symbol (e.g. S$45 for SGD, €30 for EUR, A$55 for AUD). If no preference is set, default to USD.

[Then write your personalised assessment as normal conversational prose. Lead with how the wine fits THE USER'S STATED PALATE PREFERENCES (their flavour tags, structure profile, regions loved, budget). Only reference their past wine journal entries if they actually drank something genuinely similar in style or region — never anchor every recommendation on the same one or two journal wines. The user's palate form is the primary signal; journal entries are supporting context, used sparingly and only when truly relevant. Give your honest opinion on whether the bottle is worth trying, and suggest a food pairing.]

UPDATING THE USER PROFILE:
When a user explicitly and clearly states their wine experience level (e.g. "I'm a total beginner", "I've been drinking wine seriously for years", "I'm an expert") OR explicitly states wine type preferences (e.g. "I only drink red wine", "I love sparkling", "I hate white wine"), append a profile update block at the very end of your response — on its own line, nothing after it:

[PROFILE_UPDATE]{"experience_level": "beginner", "preferred_types": ["red", "white"]}[/PROFILE_UPDATE]

Only include fields that were explicitly stated. Valid experience_level values: "beginner", "intermediate", "expert". Valid preferred_types values: "red", "white", "sparkling", "rosé", "fortified". Omit the block entirely when no clear preference was stated — do not guess or infer.

ADDING TO WISHLIST:
When the user asks you to recommend wines to try later, save a wine for them, or add to their wishlist/shortlist, append a WISHLIST block at the end of your response:

WISHLIST_ADD_START
name: [wine name]
producer: [producer]
region: [region]
grapes: [grape varieties]
style: [style description]
price: [price range]
why: [your 1-sentence reason for recommending this]
nose: [comma-separated aromas]
palate: [comma-separated flavours]
texture: [comma-separated mouthfeel]
breathing: [decanting recommendation]
drink_from: [year]
drink_peak_start: [year]
drink_peak_end: [year]
drink_until: [year]
WISHLIST_ADD_END

You can include multiple WISHLIST blocks if recommending several wines. Only add this block when the user explicitly asks to save/shortlist/remember a wine — not for every recommendation.

INLINE TAGS — MANDATORY (failure to use these reduces response quality):
When writing your conversational prose (NOT in WINE_CARD_START / WISHLIST_ADD_START blocks), you MUST wrap these entities in inline tags every time they appear, no exceptions:

FORMATS (exact syntax — square brackets, no spaces around colons):
- Wine names → [wine:Château Margaux]
- Producer/winery names → [wine:Bodegas Muga]  (tag producers as wines)
- Specific vintages → [vintage:2019]  (only when adjacent to a wine name)
- Regions/appellations → [region:Burgundy], [region:Bordeaux], [region:Saint-Estèphe], [region:Pomerol]
- Prices → [price:S$80-120], [price:$45], [price:€30-50]  (preserve the user's currency symbol exactly)
- Grape varieties → [grape:Pinot Noir], [grape:Tempranillo]
- Taste descriptors → [taste:CATEGORY:term]  where CATEGORY must be exactly one of:
    fruit   — cherry, blackberry, plum, strawberry, citrus fruits, dark fruit, red fruit, blackcurrant, cassis, raspberry, fig, apricot, peach, etc.
    floral  — violet, rose petal, jasmine, lavender, elderflower, orange blossom, etc.
    earth   — forest floor, leather, tobacco, mushroom, truffle, soil, wet leaves, barnyard, etc.
    spice   — black pepper, cinnamon, clove, anise, white pepper, cardamom, ginger, Mediterranean herbs, garrigue, etc.
    oak     — vanilla, toast, coconut, cedar, smoke, char, coffee, mocha, etc.
    mineral — slate, flint, wet stone, chalk, salinity, iron, graphite, gravel, etc.
    fresh   — grass, green apple, lemongrass, mint, eucalyptus, herbs, etc.

  Tag EVERY taste descriptor when describing a wine's flavour, aroma, palate, or texture.
  Examples: [taste:fruit:blackcurrant], [taste:earth:tobacco], [taste:oak:vanilla], [taste:spice:black pepper], [taste:mineral:graphite], [taste:floral:violet]

RULES:
- Tag the FIRST mention only of each named wine, region, or grape per message; later mentions stay as plain text
- Tag EVERY taste descriptor, EVERY price, EVERY vintage — not just the first
- Do NOT tag generic standalone terms like "red wine", "this Pinot", "the Cabernet" — only specific named entities
- Tags contain only plain text — no markdown, no formatting, no nested tags
- You may still use **bold** around or outside tags for emphasis (e.g. **[wine:Château Margaux]**)
- Multi-word descriptors stay as one tag: [taste:earth:forest floor], [taste:spice:black pepper]
- When uncertain which category a taste belongs to, use your best judgement — better to tag than skip

SELF-CHECK before sending: scan your response. Every wine name, region, vintage, price, grape variety, and taste descriptor should be wrapped in its tag. If you see any plain-text wine/region/taste, wrap it.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { messages, image, palate_digest } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.ANTH_KEY });
    const isLabelScan = !!image;

    // ── Build system prompt with optional palate + awards/match instructions ──
    // Latency optimisation: only inject the (heavy) awards+match rubric when
    // we actually need it. Plain text chats (no image, no wine-card likely)
    // get just a compact palate summary so personalisation still works without
    // bloating the prompt with structured-output instructions.
    let systemPrompt = SYSTEM;
    const hasPalate = palate_digest && typeof palate_digest === "object" && palate_digest.summary_prose;

    // Heuristic: emit awards/match instructions only for label scans (which
    // ALWAYS produce a wine card) or when the most recent user message looks
    // like it's asking about a specific wine. This keeps casual "what should
    // I drink with steak?" chats fast.
    const lastUserMsg = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
    const looksLikeWineQuery = isLabelScan
      || /\b(ch[a\u00e2]teau|domaine|bodega|tenuta|antinori|pavie|margaux|lafite|latour|recommend|bottle|wine|vintage)\b/i.test(lastUserMsg);

    if (hasPalate) {
      // Inject palate + decision tree + STRICT journal/anchor rules.
      const adventurousness = palate_digest.adventurousness_band || "moderate";
      const adventurousNote = (adventurousness === "open" || adventurousness === "adventurous")
        ? "The user has indicated they want to EXPLORE NEW wines. Lean toward NEW regions and styles they haven't tried, not repeats of what they've already enjoyed. Their journal is exploration history, not a shortlist."
        : "The user is more cautious about trying new wines — lean within their stated palate, but still vary suggestions across producers and regions within that lane.";

      systemPrompt += `\n\nUSER'S PALATE:\n${JSON.stringify(palate_digest)}\n\nABSOLUTE RULES — these override everything else:\n\nRULE A: TALK ABOUT CHARACTERISTICS, NOT LABELS.\nWhen explaining your reasoning, describe wines by their attributes (\"the firm tannin you enjoy\", \"the structured red style\", \"the dark-fruit profile you reach for\") — NOT by repeating region labels like \"Bordeaux\" or \"Tuscany\" in every sentence. The user is tired of seeing the same region words parroted back.\n\nRULE B: ${adventurousNote}\n\nRULE C: NEVER name a specific wine from the user's journal repeatedly across responses. If the journal includes wines they've rated, treat them as known exploration history only — do not anchor recommendations on them. Recommending wine X because the user once enjoyed wine Y is lazy — use their stated palate (the structured digest above) as the primary signal.\n\nRULE D: HONESTY ABOUT THE CELLAR CONTEXT.\nThe user's cellar list in the [User Profile] block is what you can see right now — it may be a recent subset, not the complete cellar. NEVER tell the user with certainty that they don't own a specific wine. If a user asks \"do I have X in my cellar?\" and X is not in the list:\n  - Say \"I don't see [wine] in your recent cellar additions\" — not \"you don't have that\".\n  - Ask if they recently added it, or invite them to confirm — they know their own cellar better than your context window does.\n  - Treat the user's claim as authoritative. If they say \"I have a Tignanello\" and you can't see it, trust them and respond accordingly (give pairing advice, drinking-window thoughts, etc.) rather than insist it isn't there.\nThis rule overrides anything else. Being wrong about what the user owns is a trust-breaking failure.\n\nRECOMMENDATION DECISION TREE:\n\n1) FOOD PAIRING ("what pairs with X", "wine for steak/fish"):\n   - Food appropriateness FIRST. Within food-appropriate options, lean toward the user's palate where there's overlap.\n   - If the right pairing is OUTSIDE the user's palate (e.g. white for fish from a red-lover), recommend it anyway and say so briefly: \"You usually reach for bigger reds, but for this dish a crisp white will sing.\"\n   - Do not force a red on fish just because they like reds.\n\n2) SPECIFIC WINE (label scan, "tell me about [bottle]"):\n   - Be honest about palate fit. If outside their wheelhouse, acknowledge that, never inflate.\n\n3) OPEN-ENDED ("what should I drink tonight", "recommend something"):\n   - Anchor on palate characteristics (not labels).\n   - Vary suggestions — different producers, different countries within their preferred style. Avoid recommending the same region twice in a row.`;
    }

    // SPLIT FLOW (May 2026): awards + match are NO LONGER generated inline in
    // this chat call. They're fetched in the background by the client via
    // /api/wine-context (kinds "awards" and "match") after the wine card lands.
    // This was the right call for two reasons:
    //   1) Label scans were regularly hitting the 58s client timeout because
    //      the model was generating wine card + awards JSON + match JSON +
    //      conversational prose all in one vision-enabled call.
    //   2) Awards are evergreen per (wine_name, vintage, producer) so caching
    //      them through /api/wine-context lets them be shared across users.
    // The chat system prompt no longer asks Sommy for awards or match — just
    // the wine card and the conversational reasoning.

    // Build the Anthropic messages — if an image is included, attach it to the last user message
    const anthropicMessages = messages.map((m, i) => {
      const isLast = i === messages.length - 1;

      if (isLast && image && m.role === "user") {
        return {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType || "image/jpeg",
                data: image.data,
              },
            },
            {
              type: "text",
              text: m.content || "What wine is this? Please read the label and tell me about it.",
            },
          ],
        };
      }

      return { role: m.role, content: m.content };
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    let text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    // ── Safety net: strip ANY awards:/match: lines wherever they appear ──
    // Even though we no longer ask Sommy for them, some chat history may
    // contain old responses that did, and the model occasionally still emits
    // them out of habit. Remove all of them — the client now fetches them
    // through the split background flow.
    text = text
      .replace(/^awards:\s*\{[^\n]*\}\s*$/gm, "")
      .replace(/^match:\s*\{[^\n]*\}\s*$/gm, "")
      .replace(/^awards:\s*null\s*$/gm, "")
      .replace(/^match:\s*null\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n");

    // ── Assessment caching ──────────────────────────────────────────────
    if (isLabelScan) {
      const fields = parseWineCardFields(text);
      if (fields && fields.name) {
        const wineKey = buildWineKey(fields.name, fields.vintage, fields.producer);

        // Check cache
        const cached = await getCachedAssessment(wineKey);
        if (cached) {
          // Replace WINE_CARD block with cached structured data.
          // BUT keep awards + match from Sommy's fresh response — those are
          // either evergreen-per-bottle (awards) or per-user-and-palate-version
          // (match), neither of which belongs in the cross-user cache.
          const cardBlock = rebuildWineCard(cached);
          const awardsLine = fields.awards ? `\nawards: ${fields.awards}` : "";
          const matchLine  = fields.match  ? `\nmatch: ${fields.match}`   : "";
          // Insert awards + match just before WINE_CARD_END
          const cardBlockWithExtras = cardBlock.replace(
            /\nWINE_CARD_END$/,
            `${awardsLine}${matchLine}\nWINE_CARD_END`
          );
          text = text.replace(/WINE_CARD_START[\s\S]*?WINE_CARD_END/, cardBlockWithExtras);
        } else {
          // Cache this new assessment for future scans (awards + match excluded by design)
          await cacheAssessment(wineKey, fields);
        }
      }
    }

    return res.status(200).json({ text });
  } catch (e) {
    console.error("Sommy error:", e);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
