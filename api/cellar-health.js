import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 30 };

const SYSTEM = `You are Sommy. Analyze the user's wine cellar against their stated goals. Give a warm, specific assessment: what's strong in their collection, what's missing, and 1-2 specific wine suggestions to add with reasoning. Keep it to 3-4 sentences. No emojis.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { cellar, goals, user_context } = req.body || {};
    if (!cellar || !goals) return res.status(400).json({ error: "cellar and goals required" });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.ANTH_KEY });

    const cellarSummary = cellar.map((w) =>
      `${w.wine_name} (${w.region || "unknown region"}, ${w.grapes || "unknown grapes"}, ${w.style || ""}, ${w.vintage || "NV"}) x${w.quantity || 1} — ${w.status || "active"}`
    ).join("\n");

    const goalsText = [
      goals.goal_style && `Goal: ${goals.goal_style}`,
      goals.budget_range && `Budget: ${goals.budget_range}`,
      goals.preferred_regions && `Preferred regions: ${goals.preferred_regions}`,
      goals.preferred_styles && `Preferred styles: ${goals.preferred_styles}`,
    ].filter(Boolean).join("\n");

    const prompt = `Here is my cellar:\n${cellarSummary}\n\nMy goals:\n${goalsText}${user_context ? `\n\nAdditional context: ${user_context}` : ""}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return res.status(200).json({ assessment: text });
  } catch (e) {
    console.error("Cellar health error:", e);
    return res.status(500).json({ error: "Health assessment failed. Try again." });
  }
}
