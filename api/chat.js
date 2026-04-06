let Anthropic;
try {
  Anthropic = require("@anthropic-ai/sdk").default;
} catch (e) {
  // fallback
  Anthropic = require("@anthropic-ai/sdk");
}

const SYSTEM = `You are Sommy, the AI sommelier for The World of Wine. You're a warm, knowledgeable friend who speaks in the first person. Keep responses concise — 2-4 short paragraphs. Be specific with wine recommendations. Never use emojis. Speak naturally.`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + "..." : "MISSING";

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required", hasKey, keyPrefix });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("");

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({
      error: "Sommy failed",
      message: error?.message || String(error),
      hasKey,
      keyPrefix,
      type: error?.constructor?.name,
    });
  }
};
