import Anthropic from "@anthropic-ai/sdk";

// Increase Vercel function timeout to 60s (conversation history makes responses slower)
export const config = { maxDuration: 60 };

const SUPABASE_URL = "https://ycgxczvsxiilqzvyzpso.supabase.co";
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
WINE_CARD_END

If the user has a currency preference in their profile, always quote wine prices in that currency using the appropriate symbol (e.g. S$45 for SGD, €30 for EUR, A$55 for AUD). If no preference is set, default to USD.

[Then write your personalised assessment as normal conversational prose — relate it to the user's preferences and history if known, give your honest opinion on whether it's worth trying, mention approximate price range if recognisable, and suggest a food pairing.]

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

You can include multiple WISHLIST blocks if recommending several wines. Only add this block when the user explicitly asks to save/shortlist/remember a wine — not for every recommendation.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { messages, image } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const isLabelScan = !!image;

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
      system: SYSTEM,
      messages: anthropicMessages,
    });

    let text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    // ── Assessment caching ──────────────────────────────────────────────
    if (isLabelScan) {
      const fields = parseWineCardFields(text);
      if (fields && fields.name) {
        const wineKey = buildWineKey(fields.name, fields.vintage, fields.producer);

        // Check cache
        const cached = await getCachedAssessment(wineKey);
        if (cached) {
          // Replace WINE_CARD block with cached structured data
          // Keep the prose (everything after WINE_CARD_END) fresh and personalised
          const cardBlock = rebuildWineCard(cached);
          text = text.replace(/WINE_CARD_START[\s\S]*?WINE_CARD_END/, cardBlock);
        } else {
          // Cache this new assessment for future scans
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
