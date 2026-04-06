module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  
  try {
    const Anthropic = require("@anthropic-ai/sdk").default || require("@anthropic-ai/sdk");
    
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { messages } = req.body || {};
    
    if (!messages) return res.status(400).json({ error: "messages required" });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: "You are Sommy, a warm and knowledgeable wine sommelier friend. Keep responses concise. Never use emojis. Speak in first person.",
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const text = response.content.filter(b => b.type === "text").map(b => b.text).join("");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack?.split("\n").slice(0, 5) });
  }
};
