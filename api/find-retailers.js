// Vercel serverless function — searches the web for actual retailers selling a specific wine.
// Uses lean prompt (2 web searches max) to minimize token cost.
// Caches results in Supabase for 48 hours to avoid redundant searches.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ycgxczvsxiilqzvyzpso.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── Cache helpers ──────────────────────────────────────────────────────────
async function getCachedRetailers(wineKey) {
  if (!SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/retailer_cache?wine_key=eq.${encodeURIComponent(wineKey)}&select=*&limit=1`,
      { headers: { Authorization: `Bearer ${SUPABASE_KEY}`, apikey: SUPABASE_KEY } }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows.length) return null;
    const row = rows[0];
    // Check if cache is fresh (48 hours)
    const age = Date.now() - new Date(row.updated_at).getTime();
    if (age > 48 * 60 * 60 * 1000) return null; // stale
    return { retailers: row.retailers || [], fallbacks: row.fallbacks || [] };
  } catch { return null; }
}

async function cacheRetailers(wineKey, retailers, fallbacks) {
  if (!SUPABASE_KEY) return;
  try {
    // Upsert
    await fetch(`${SUPABASE_URL}/rest/v1/retailer_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        wine_key: wineKey,
        retailers: retailers,
        fallbacks: fallbacks,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch { /* non-critical */ }
}

// ── Main handler ───────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { wine, country } = req.query;
  if (!wine) return res.status(400).json({ error: "wine parameter required" });

  const location = country || "Singapore";
  const wineKey = `${wine}|${location}`.toLowerCase().replace(/\s+/g, " ").trim();

  // Fallback links — always useful
  const fallbackLinks = [
    { name: "Vivino", url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wine)}`, note: "Search and compare prices globally" },
    { name: "Wine-Searcher", url: `https://www.wine-searcher.com/find/${encodeURIComponent(wine)}`, note: `Price comparison across ${location} retailers` },
  ];

  // 1. Check cache first
  const cached = await getCachedRetailers(wineKey);
  if (cached) {
    return res.status(200).json({
      retailers: cached.retailers,
      fallbacks: cached.fallbacks,
      wine, country: location, fromCache: true,
    });
  }

  // 2. No API key → return fallbacks only
  if (!ANTHROPIC_KEY) {
    return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
  }

  // 3. Live web search — lean prompt, 2 searches max
  try {
    const prompt = `Search for: buy "${wine}" ${location} wine. Return JSON only: {"found":[{"name":"...","url":"...","note":"..."}],"search_quality":"good/limited/none"}. Only include REAL product page URLs from search results. Never fabricate URLs.`;

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 2 }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text().catch(() => "");
      // Rate limit → return fallbacks gracefully
      if (apiRes.status === 429) {
        return res.status(200).json({
          retailers: [], fallbacks: fallbackLinks,
          wine, country: location, rateLimited: true,
        });
      }
      console.error("Anthropic error:", apiRes.status, errBody.slice(0, 200));
      return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
    }

    const data = await apiRes.json();
    let resultText = "";
    for (const block of data.content) {
      if (block.type === "text") resultText += block.text;
    }

    let found = [];
    try {
      const jsonStr = resultText.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
      const parsed = JSON.parse(jsonStr);
      found = (parsed.found || []).filter(r => r.url && r.name);
    } catch { /* parsing failed, found stays empty */ }

    const resultFallbacks = found.length === 0 ? fallbackLinks : [];

    // 4. Cache the results
    await cacheRetailers(wineKey, found, resultFallbacks);

    return res.status(200).json({
      retailers: found,
      fallbacks: resultFallbacks,
      wine, country: location,
    });
  } catch (err) {
    console.error("find-retailers error:", err);
    return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
  }
}
