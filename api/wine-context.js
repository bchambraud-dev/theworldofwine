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

// SHARED SCORING RUBRIC — imported into both /api/wine-context (kind=match) and Sommy chat context (4c)
// Treat as the single source of truth for how match scores get assigned across every surface.
export const MATCH_SCORE_RUBRIC = `
SCORING RUBRIC (0-100 scale):

90-100 "Perfect Match"  → Hits multiple core preferences cleanly (style, region, flavour profile, structure, price). High signal that the user will love it.
75-89  "Strong Match"   → Aligns with most preferences. The user will likely enjoy it; one factor may be slightly off but not jarring.
60-74  "Worth Trying"   → Some alignment, some adventure. The user has signalled openness here but it's a step outside their core comfort zone.
45-59  "A Stretch"      → Several factors run against the user's preferences. Only worth recommending if their adventurousness score is high or they specifically asked for novelty.
0-44   "Off Profile"    → Strong conflict with the user's stated preferences. Skip unless there's an explicit reason.

CONFIDENCE GATING (the client uses this to decide what to show):
- "high"   → Both the user's palate AND the wine's profile are well-defined. Score is reliable.
- "medium" → Either the palate is sparse OR the wine is obscure. Score is directional.
- "low"    → Insufficient data on either side. Score should not be shown to the user.

HONESTY RULES:
- If the user's palate signal is light (form only, no log history), cap your top band at "Strong Match". "Perfect Match" requires both form AND ≥8 wine logs.
- Never reward iconic status — a First Growth Bordeaux scores low for a user who only drinks fruity reds under $30.
- Adventurousness (1-5) shifts the cutoff: a 5 means the user wants you to push them, so "Worth Trying" can climb to 80+. A 1 means stay safe — never recommend outside core preferences.
- Budget alignment matters but isn't binary — a wine 20% above budget is still "Worth Trying" if everything else hits.

SCORE DISCRIMINATION (critical — prevents lazy clustering):
- USE THE FULL RANGE of each band. Don't anchor on band midpoints.
- Two wines with the same alignment should still score differently if their factor strengths differ. A wine hitting 4 of 5 factors at the top of a band scores higher than a wine barely qualifying.
- Example within "Strong Match" (75-89): a Cabernet from a loved region in budget scores 86; a Merlot from a curious region slightly over budget scores 77. Both are Strong Match, but the score reflects nuance.
- Use precise scores like 73, 81, 86, 88, 62 — not just 65, 70, 75, 80.
- It's rare for two wines to honestly deserve the exact same score. Find the difference.
`.trim();

const PALATE_DIGEST_SYSTEM = `You are Sommy, an expert sommelier. Given a user's palate form data, write a compact JSONB digest that captures their taste in a form usable for wine matching.

Return ONLY valid JSON with this exact shape:

{
  "summary_prose": "A 2-3 sentence first-person summary of this drinker, written as if Sommy is recalling them. 'You lean toward bold reds with structure...' Max 60 words.",
  "flavour_tags": ["fruit-forward", "earthy", "oaky"],
  "structure_profile": { "body": "medium-full", "acidity": "moderate", "tannin": "firm" },
  "regions_loved":     ["Bordeaux", "Tuscany"],
  "regions_curious":   ["Rhone", "Mendoza"],
  "adventurousness_band": "moderate",
  "budget_band": "premium",
  "price_quality_posture": "willing to pay for quality",
  "experience_level": "enthusiast"
}

Rules:
- Keep the prose short and second-person ("You lean toward..."). It is shown to the user occasionally and should sound like Sommy talking to them.
- 3-6 flavour tags, lowercase, descriptive (not generic like "good wines").
- Structure values: body in {"light","medium-light","medium","medium-full","full"}; acidity in {"low","moderate","bright","high"}; tannin in {"none","soft","moderate","firm","grippy"}.
- adventurousness_band: "cautious" (1-2), "moderate" (3), "open" (4), "adventurous" (5).
- budget_band: "value", "mid", "premium", "luxury".
- Output ONLY the JSON. No prose, no markdown, no commentary.
`.trim();

// The final score is computed SERVER-SIDE as a weighted average of per-factor
// alignment_pct values. This is intentional — having Sommy pick a single number
// in 0-100 produces lazy clustering on round band midpoints. By making Sommy
// rate each factor and computing the aggregate ourselves, scores vary naturally
// based on the underlying analysis.
const MATCH_SCORE_SYSTEM = `You are Sommy, an expert sommelier. Given a user's palate digest AND a wine, rate this wine on FOUR factors. The final score is computed from your factor ratings, so RATE EACH FACTOR PRECISELY.

${MATCH_SCORE_RUBRIC}

Return ONLY valid JSON with this exact shape:

{
  "confidence": "high",
  "why_short": "Bold structured Bordeaux hits your sweet spot.",
  "why_long": "Cabernet-dominant Saint-Estèphe matches your love of structured reds. The 2014 vintage offers the firm tannin you prefer and sits comfortably within your premium budget. Aged Bordeaux is your wheelhouse.",
  "factors": [
    { "label": "Style fit",   "alignment_pct": 92 },
    { "label": "Region match", "alignment_pct": 95 },
    { "label": "Budget",       "alignment_pct": 78 },
    { "label": "Adventure",    "alignment_pct": 60 }
  ]
}

Factor rules (you MUST return exactly these 4 factors in this order, all with alignment_pct):
- "Style fit":   how well the wine's body/acidity/tannin/flavour profile matches the user's structure_profile + flavour_tags. 0=clashes, 100=textbook match.
- "Region match": how well the wine's region maps to regions_loved (high) or regions_curious (medium-high), with regions_loved scoring higher than regions_curious. Unknown regions score 30-50.
- "Budget":      how comfortably the wine sits inside the user's budget_band. Inside band = 80-100. 20% over = 60-75. Double the band = 20-40.
- "Adventure":   how well the wine matches the user's adventurousness_band. Cautious + safe wine = high. Adventurous + safe wine = moderate. Adventurous + unusual = high.

alignment_pct precision rules (CRITICAL — prevents clustering):
- Use the FULL 0-100 range. NEVER use round numbers like 50, 60, 65, 70, 75, 80, 85, 90.
- Pick precise values like 47, 63, 72, 84, 91, 96. Two factors hitting at slightly different strengths should get different numbers.
- A clear strong match: 85-98 range. A clear weak match: 10-35 range. Mid-ground: vary across 40-80.
- It is VERY rare for two wines to have identical factor scores. Find the difference.

Other fields:
- "why_short" is one line, max 12 words, second-person ("you"), Sommy's voice. Shown on the wine card.
- "why_long" is 2-3 sentences, max 60 words, second-person, conversational. Shown on tap. Explain honestly.
- "confidence" in {"high","medium","low"}. Be honest — if palate signal is thin OR wine is obscure, lower it.
- No emojis.

Output ONLY the JSON. No prose, no markdown, no commentary.
`.trim();

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

    const validKinds = ["tasting", "pairings", "awards", "palate_digest", "match"];
    if (!validKinds.includes(kind)) {
      return res.status(400).json({ error: `kind must be one of: ${validKinds.join(", ")}` });
    }
    // wine.id only required for kinds that persist a cache row
    if (["tasting", "pairings", "awards"].includes(kind) && !wineId) {
      return res.status(400).json({ error: "wine.id required" });
    }
    // palate_digest doesn't need a wine — it takes palate form data
    if (kind === "palate_digest") {
      const form = body.form || {};
      const userMessage = JSON.stringify(form, null, 2);
      const text = await callSommy(PALATE_DIGEST_SYSTEM, userMessage);
      let parsed;
      try { parsed = parseJSON(text); } catch (e) {
        return res.status(502).json({ error: "Sommy returned malformed digest" });
      }
      if (!parsed || !parsed.summary_prose) {
        return res.status(502).json({ error: "digest missing required fields" });
      }
      return res.status(200).json({ kind: "palate_digest", data: parsed });
    }
    // match needs both palate_digest and wine
    if (kind === "match") {
      const palate = body.palate_digest;
      if (!palate || !palate.summary_prose) {
        return res.status(400).json({ error: "palate_digest required" });
      }
      if (!wine.wine_name) return res.status(400).json({ error: "wine.wine_name required" });
      const userMessage = `PALATE:\n${JSON.stringify(palate, null, 2)}\n\nWINE:\n${describeWine(wine)}`;
      const text = await callSommy(MATCH_SCORE_SYSTEM, userMessage);
      let parsed;
      try { parsed = parseJSON(text); } catch (e) {
        return res.status(502).json({ error: "Sommy returned malformed match score" });
      }
      if (!parsed || !Array.isArray(parsed.factors)) {
        return res.status(502).json({ error: "match missing factors array" });
      }

      // Compute the final score DETERMINISTICALLY from factor alignment_pct values.
      // Weights reflect what most drives whether a user enjoys a wine:
      //   Style fit    30% — body/tannin/flavour, the actual sensory experience
      //   Region match 30% — strong proxy for many things at once
      //   Budget       20% — affordability gates real-world enjoyment
      //   Adventure    20% — calibrates risk tolerance
      const WEIGHTS = { "Style fit": 0.30, "Region match": 0.30, "Budget": 0.20, "Adventure": 0.20 };
      let weightedSum = 0, totalWeight = 0;
      const factorsClean = [];
      for (const f of parsed.factors) {
        if (!f || typeof f.alignment_pct !== "number" || !f.label) continue;
        const pct = Math.max(0, Math.min(100, Math.round(f.alignment_pct)));
        const w = WEIGHTS[f.label] ?? 0.25; // fallback if Sommy renames a factor
        weightedSum += pct * w;
        totalWeight += w;
        // Map alignment_pct → alignment label so the client can color chips
        const alignment = pct >= 80 ? "strong"
                       : pct >= 60 ? "moderate"
                       : pct >= 40 ? "neutral"
                       : "weak";
        factorsClean.push({ label: f.label, alignment, alignment_pct: pct });
      }
      if (totalWeight === 0) {
        return res.status(502).json({ error: "match has no valid factors" });
      }
      const score = Math.round(weightedSum / totalWeight);
      // Derive band from the computed score using the same cutoffs the UI uses.
      const band = score >= 90 ? "Perfect Match"
                 : score >= 75 ? "Strong Match"
                 : score >= 60 ? "Worth Trying"
                 : score >= 45 ? "A Stretch"
                 : "Off Profile";
      const out = {
        score,
        band,
        confidence: parsed.confidence || "medium",
        why_short: parsed.why_short || "",
        why_long:  parsed.why_long  || "",
        factors:   factorsClean,
      };
      return res.status(200).json({ kind: "match", data: out });
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
