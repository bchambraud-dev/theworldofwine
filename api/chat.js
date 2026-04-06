const Anthropic = require("@anthropic-ai/sdk").default;

const SYSTEM = `You are Sommy, the AI sommelier for The World of Wine. You're a warm, knowledgeable friend who genuinely loves sharing wine knowledge. You speak directly to the person — first person, never third person. You're like a well-traveled friend who's spent years in wine regions. Warm, direct, approachable — never stuffy. You make wine feel accessible without dumbing it down. Keep responses concise — 2-4 short paragraphs max. Lead with the answer. Use concrete examples with specific regions and producers. Never use emojis. Never say "great question!" or start with "As a sommelier...". Speak naturally in flowing prose, not bullet points.`;

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Sommy error:", error?.message || error);
    return res.status(500).json({
      error: "Something went wrong. Try again.",
      detail: error?.message || "Unknown error",
    });
  }
};
