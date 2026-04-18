// Vercel serverless function — finds wine retailers for a given wine + location
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { wine, country } = req.query;
  if (!wine) return res.status(400).json({ error: "wine parameter required" });

  const location = country || "your area";

  try {
    const prompt = `You are a wine retail expert. For the wine "${wine}", suggest 3-5 specific online or physical retailers where someone in ${location} can buy it. Return ONLY a JSON array, no markdown:
[
  { "name": "Retailer Name", "url": "https://...", "note": "brief note about price or availability" }
]
Focus on:
- Major online wine retailers that ship to ${location} (e.g. Wine.com, Vivino, local platforms)
- Well-known specialist wine shops in ${location}
- If ${location} is Singapore, prioritize: Wine Connection, 1855 The Bottle Shop, The Straits Wine Company, Cult Wines Singapore, Wine Rack, GrabWines
- Include actual working URLs where possible (retailer homepage or search page)
- Keep notes brief (e.g. "Usually S$45-65" or "Check availability" or "Good selection of Italian wines")
Return ONLY the JSON array.`;

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
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiRes.ok) throw new Error(`API error ${apiRes.status}`);

    const data = await apiRes.json();
    const text = data.content[0].text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const retailers = JSON.parse(text);

    return res.status(200).json({ retailers, wine, country: location });
  } catch (err) {
    console.error("find-retailers error:", err);
    return res.status(200).json({
      retailers: [
        { name: "Vivino", url: `https://www.vivino.com/search/wines?q=${encodeURIComponent(wine)}`, note: "Search and compare prices" },
        { name: "Wine-Searcher", url: `https://www.wine-searcher.com/find/${encodeURIComponent(wine)}`, note: "Price comparison across retailers" },
      ],
      wine,
      country: location,
      fallback: true,
    });
  }
}
