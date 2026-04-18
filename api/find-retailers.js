// Vercel serverless function — searches the web for actual retailers selling a specific wine.
// Uses Anthropic with web search tool to find real product pages, not guesses.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { wine, country } = req.query;
  if (!wine) return res.status(400).json({ error: "wine parameter required" });

  const location = country || "Singapore";

  // Fallback search links — always useful
  const fallbackLinks = [
    { name: "Vivino", url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wine)}`, note: "Search and compare prices globally" },
    { name: "Wine-Searcher", url: `https://www.wine-searcher.com/find/${encodeURIComponent(wine)}/${encodeURIComponent(location).toLowerCase()}`, note: `Price comparison across ${location} retailers` },
  ];

  if (!ANTHROPIC_KEY) {
    return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
  }

  try {
    const searchPrompt = `Search for where to buy the wine "${wine}" in ${location}. I need ACTUAL product pages from real online wine retailers — not guesses.

Search for: "${wine}" buy ${location}

For each result you find that is a real product page (not a generic homepage or blog), extract:
- The retailer name
- The exact product page URL
- The price if visible
- Brief availability note

Return ONLY a JSON object like this (no markdown, no explanation):
{
  "found": [
    { "name": "Retailer Name", "url": "https://exact-product-page-url", "note": "S$XX - In stock" }
  ],
  "search_quality": "good" or "limited" or "none"
}

Rules:
- Only include results where you found an ACTUAL product page URL for this specific wine
- Do NOT fabricate or guess URLs — if you can't find a real link, return an empty array
- If the wine name is ambiguous, include the closest matches
- Maximum 5 results, sorted by relevance`;

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
        messages: [{ role: "user", content: searchPrompt }],
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("Anthropic error:", apiRes.status, errText);
      return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
    }

    const data = await apiRes.json();

    // Extract the final text response (after tool use)
    let resultText = "";
    for (const block of data.content) {
      if (block.type === "text") resultText += block.text;
    }

    // Parse JSON from the response
    let parsed;
    try {
      const jsonStr = resultText.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return fallbacks
      return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
    }

    const found = (parsed.found || []).filter(r => r.url && r.name);
    const quality = parsed.search_quality || (found.length > 0 ? "good" : "none");

    return res.status(200).json({
      retailers: found,
      fallbacks: quality === "none" || found.length === 0 ? fallbackLinks : [],
      searchQuality: quality,
      wine,
      country: location,
    });
  } catch (err) {
    console.error("find-retailers error:", err);
    return res.status(200).json({ retailers: [], fallbacks: fallbackLinks, wine, country: location });
  }
}
