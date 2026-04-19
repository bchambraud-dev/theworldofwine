import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 30 };

const SUPABASE_URL = "https://ycgxczvsxiilqzvyzpso.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc3NjEzMSwiZXhwIjoyMDg3MzUyMTMxfQ.JEXkuSX8vPCTMf8v5w1Wm5t-vIGMgYRLvPSQBgp5Vlk";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYxMzEsImV4cCI6MjA4NzM1MjEzMX0.QMqRA-a89wOTNNOnc_zchjSnqQ9QDfbYWiXXcu-4dg4";

function buildWineKey(name, vintage, producer) {
  return [name, vintage, producer].filter(Boolean).join("|").toLowerCase().trim();
}

async function getCached(wineKey) {
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

async function updateCache(wineKey, data) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/wine_assessments?wine_key=eq.${encodeURIComponent(wineKey)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        drink_from: data.drink_from || null,
        drink_peak_start: data.drink_peak_start || null,
        drink_peak_end: data.drink_peak_end || null,
        drink_until: data.drink_until || null,
        market_value_usd: data.market_value_estimate || null,
        cellar_assessment: data.assessment || null,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch { /* non-critical */ }
}

const SYSTEM = `You are Sommy, an expert sommelier. Given a wine, estimate its drinking window as specific years (e.g. drink_from: 2025, drink_peak_start: 2028, drink_peak_end: 2035, drink_until: 2040), approximate current market value in USD, and write a brief 2-sentence assessment for a cellar owner. Be specific. For the drinking window, consider the grape variety, region, vintage quality, and typical aging curves. Return ONLY valid JSON with keys: drink_from, drink_peak_start, drink_peak_end, drink_until, market_value_estimate (number in USD), assessment (string). No markdown, no explanation outside the JSON.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { wine_name, producer, vintage, region, grapes, style } = req.body || {};
    if (!wine_name) return res.status(400).json({ error: "wine_name required" });

    const wineKey = buildWineKey(wine_name, vintage, producer);

    // Check cache for drinking window + value
    const cached = await getCached(wineKey);
    if (cached && cached.drink_from && cached.market_value_usd) {
      return res.status(200).json({
        drink_from: cached.drink_from,
        drink_peak_start: cached.drink_peak_start,
        drink_peak_end: cached.drink_peak_end,
        drink_until: cached.drink_until,
        market_value_estimate: cached.market_value_usd,
        assessment: cached.cellar_assessment || "A fine addition to your cellar.",
      });
    }

    // Not cached — call Claude
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.ANTH_KEY });

    const parts = [
      `Wine: ${wine_name}`,
      producer && `Producer: ${producer}`,
      vintage && `Vintage: ${vintage}`,
      region && `Region: ${region}`,
      grapes && `Grapes: ${grapes}`,
      style && `Style: ${style}`,
    ].filter(Boolean).join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM,
      messages: [{ role: "user", content: parts }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const data = JSON.parse(text);

    // Cache the result (always in USD)
    if (wineKey) await updateCache(wineKey, data);

    return res.status(200).json(data);
  } catch (e) {
    console.error("Cellar assess error:", e);
    return res.status(500).json({ error: "Assessment failed. Try again." });
  }
}
