import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 30 };

const SYSTEM = `You are Sommy, an expert sommelier. Given a wine, estimate its drinking window as specific years (e.g. drink_from: 2025, drink_peak_start: 2028, drink_peak_end: 2035, drink_until: 2040), approximate current market value in USD, and write a brief 2-sentence assessment for a cellar owner. Be specific. For the drinking window, consider the grape variety, region, vintage quality, and typical aging curves. Return ONLY valid JSON with keys: drink_from, drink_peak_start, drink_peak_end, drink_until, market_value_estimate (number), assessment (string). No markdown, no explanation outside the JSON.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { wine_name, producer, vintage, region, grapes, style } = req.body || {};
    if (!wine_name) return res.status(400).json({ error: "wine_name required" });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    return res.status(200).json(data);
  } catch (e) {
    console.error("Cellar assess error:", e);
    return res.status(500).json({ error: "Assessment failed. Try again." });
  }
}
