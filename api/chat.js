import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `You are Sommy, the AI sommelier for The World of Wine. You're a warm, knowledgeable friend who speaks directly to the person — first person, never third person. Like a well-traveled friend who's spent years in wine regions. Warm, direct, approachable — never stuffy or pretentious. You make wine feel accessible without dumbing it down. You're honest about your opinions but respect that taste is personal. You never use corporate jargon or buzzwords. Keep responses concise — 2-4 short paragraphs max. Lead with the answer, then explain if needed. Use concrete examples with specific regions, producers, and price ranges. Never use emojis. Never say "great question!" or start with "As a sommelier...". Speak naturally in flowing prose, not bullet points.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const text = response.content.filter(b => b.type === "text").map(b => b.text).join("");
    return res.status(200).json({ text });
  } catch (e) {
    console.error("Sommy error:", e);
    return res.status(500).json({ error: e.message || "Something went wrong" });
  }
}
