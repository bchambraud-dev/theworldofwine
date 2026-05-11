import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 30 };

const SUPABASE_URL = "https://auth.theworldofwine.org";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYxMzEsImV4cCI6MjA4NzM1MjEzMX0.QMqRA-a89wOTNNOnc_zchjSnqQ9QDfbYWiXXcu-4dg4";

const TASTING_SYSTEM = `You are Sommy, an expert sommelier. Given a wine, write 4-6 short tasting note descriptors covering its likely flavour profile. Group descriptors by category and return ONLY valid JSON with this exact shape:

{
  "notes": [
    { "category": "fruit",   "term": "blackcurrant" },
    { "category": "earth",   "term": "tobacco" },
    { "category": "oak",     "term": "vanilla" },
    { "category": "spice",   "term": "black pepper" }
  ]
}

Rules:
- "category" must be exactly one of: fruit, floral, earth, spice, oak, mineral, fresh
- "term" should be 1-3 words, lowercase, evocative and specific (not generic like "fruity")
- Cover the major aroma/palate pillars expected for this wine — don't list 5 fruits and nothing else
- Avoid stating the obvious like "red" or "tannic" — these are descriptors, not summaries
- 4-6 notes total. No more.

Output ONLY the JSON. No prose, no markdown, no commentary.`;

const AWARDS_SYSTEM = `You are Sommy, an expert sommelier and wine historian. Given a specific bottle (wine name + vintage + producer), return any genuine recognition, classification, or critic-recognized awards that apply to THIS SPECIFIC BOTTLE.

Return ONLY valid JSON with this exact shape:

{
  "awards": [
    { "type": "classification", "label": "First Growth",          "tone": "classification", "context": "Pauillac, 1855 Bordeaux Classification" },
    { "type": "critic_score",   "label": "Parker 100",            "tone": "score",          "context": "Robert Parker, 1982 vintage" },
    { "type": "recognition",    "label": "Decanter Wine of the Year 1982", "tone": "recognized", "context": "Decanter Magazine" }
  ],
  "is_flagship": true,
  "confidence": "high",
  "notes": "Grand Vin from the classified estate."
}

CRITICAL RULES (per-bottle, not per-producer):

1. Distinguish FLAGSHIP wines from second wines or negociant blends. "Château Mouton Rothschild" (the Grand Vin) is a First Growth. "Mouton Cadet" (the cheap negociant blend from the SAME producer) is NOT. Penfolds Grange is iconic; Penfolds Koonunga Hill is a $15 supermarket wine.

2. Distinguish VINTAGES. A First Growth's classification applies to all vintages (it's an estate-level designation), but critic scores and "Wine of the Year" awards are vintage-specific. Only attach scores you genuinely know for THAT vintage.

3. If you don't know with reasonable certainty, return an empty awards array. Do NOT fabricate. Do NOT extrapolate from the producer's general reputation. Better to under-promise than misrepresent.

4. For Old World classifications (1855 Bordeaux, Grand Cru, Premier Cru, DOCG, etc.), use "type": "classification" with "tone": "classification".

5. For critic scores (Parker, Wine Spectator, James Suckling, Decanter, Vinous), use "type": "critic_score" with "tone": "score". Include critic + vintage in "context".

6. For recognition awards (Decanter Wine of the Year, Wine Spectator Top 100, Wine of the Year, Master of Wine choices), use "type": "recognition" with "tone": "recognized".

7. For widely-acknowledged iconic status without formal classification (e.g. Tignanello as a Super Tuscan pioneer, Sassicaia pre-DOC, Vega Sicilia Único), use "type": "recognition" with "tone": "iconic" and label like "Iconic Super Tuscan" or "Spanish wine legend". Use sparingly.

8. "confidence" must be: "high" (you're certain about this specific bottle), "medium" (likely but vintage-specific data may not be perfect), or "low" (you're stretching). The client will hide all low-confidence results.

9. "is_flagship": true ONLY when this IS the producer's classified/iconic wine. Mouton Cadet 2020 → false. Château Mouton Rothschild 1982 → true.

10. Maximum 4 awards. Quality over quantity. Don't pad.

11. For wines you genuinely don't recognize (regional producers, supermarket brands, unknown labels): return { "awards": [], "is_flagship": false, "confidence": "low", "notes": "Limited data on this specific bottle." }

12. "notes" is a one-line internal note (not shown to user) explaining the call.

Output ONLY the JSON. No prose, no markdown, no commentary.`;

const PAIRING_SYSTEM = `You are Sommy, an expert sommelier. Given a wine, suggest 4-6 specific food pairings that complement it well. Return ONLY valid JSON with this exact shape:

{
  "pairings": [
    { "dish": "Grilled ribeye with rosemary",       "why": "Bold tannins meet rich marbling" },
    { "dish": "Roasted lamb with herbs de Provence", "why": "Earthy notes echo the wine's profile" },
    { "dish": "Aged comté or pecorino",              "why": "Nutty cheese tames the structure" },
    { "dish": "Mushroom risotto",                    "why": "Umami depth highlights the earth" }
  ]
}

Rules:
- "dish" should be specific and evocative — not just "steak" or "fish". Include preparation or seasoning where it matters.
- "why" is a short 6-12 word note explaining the pairing logic. Keep it human, not academic.
- Mix categories: think mains, cheese, vegetables, occasional desserts where appropriate
- For dessert/sweet wines, lean into desserts and aged cheeses
- 4-6 pairings total
- No emojis

Output ONLY the JSON.`;

async function callSommy(systemPrompt, userMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY missing");
  const client = new Anthropic({ apiKey });

  const resp = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 800,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = resp.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  return text;
}

function parseJSON(text) {
  // Strip code fences if Claude added them despite instructions
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

async function patchCellarRow(wineId, fields) {
  if (!SUPABASE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/wine_cellar?id=eq.${encodeURIComponent(wineId)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      apikey: ANON_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(fields),
  });
}

function describeWine({ wine_name, vintage, producer, region, grapes, style }) {
  const parts = [];
  if (producer) parts.push(`Producer: ${producer}`);
  if (wine_name) parts.push(`Wine: ${wine_name}`);
  if (vintage) parts.push(`Vintage: ${vintage}`);
  if (region) parts.push(`Region: ${region}`);
  if (grapes) parts.push(`Grapes: ${grapes}`);
  if (style) parts.push(`Style: ${style}`);
  return parts.join("\n");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const kind = body.kind; // "tasting" | "pairings"
    const wine = body.wine || {};
    const wineId = wine.id;

    if (!wineId) return res.status(400).json({ error: "wine.id required" });
    if (kind !== "tasting" && kind !== "pairings" && kind !== "awards") {
      return res.status(400).json({ error: "kind must be 'tasting', 'pairings', or 'awards'" });
    }
    if (!wine.wine_name) return res.status(400).json({ error: "wine.wine_name required" });

    const wineDesc = describeWine(wine);

    if (kind === "tasting") {
      const text = await callSommy(TASTING_SYSTEM, wineDesc);
      const parsed = parseJSON(text);
      if (!Array.isArray(parsed.notes) || parsed.notes.length === 0) {
        return res.status(502).json({ error: "Sommy returned malformed notes" });
      }
      // Persist cache
      await patchCellarRow(wineId, {
        tasting_notes_json: parsed,
        tasting_notes_generated_at: new Date().toISOString(),
      });
      return res.status(200).json({ kind: "tasting", data: parsed });
    }

    if (kind === "pairings") {
      const text = await callSommy(PAIRING_SYSTEM, wineDesc);
      const parsed = parseJSON(text);
      if (!Array.isArray(parsed.pairings) || parsed.pairings.length === 0) {
        return res.status(502).json({ error: "Sommy returned malformed pairings" });
      }
      await patchCellarRow(wineId, {
        food_pairings_json: parsed,
        food_pairings_generated_at: new Date().toISOString(),
      });
      return res.status(200).json({ kind: "pairings", data: parsed });
    }

    if (kind === "awards") {
      const text = await callSommy(AWARDS_SYSTEM, wineDesc);
      let parsed;
      try {
        parsed = parseJSON(text);
      } catch (e) {
        // Treat malformed JSON as 'no awards known' rather than failing the call.
        parsed = { awards: [], is_flagship: false, confidence: "low", notes: "Parse error — treated as empty." };
      }
      // Defensive shape check
      if (!parsed || !Array.isArray(parsed.awards)) {
        parsed = { awards: [], is_flagship: false, confidence: "low", notes: "Malformed response — treated as empty." };
      }
      return res.status(200).json({ kind: "awards", data: parsed });
    }

    return res.status(400).json({ error: "unsupported kind" });
  } catch (err) {
    console.error("wine-context error:", err);
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
