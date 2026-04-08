import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `You are Sommy, the AI sommelier for The World of Wine. You're a warm, knowledgeable friend who speaks directly to the person — first person, never third person. Warm, direct, approachable — never stuffy. You make wine feel accessible without dumbing it down. Keep responses concise — 2-4 short paragraphs max. Lead with the answer. Use concrete examples with specific regions, producers, and price ranges. Never use emojis. Never say "great question!" or start with "As a sommelier...". Speak naturally in flowing prose, not bullet points.

WHEN ANALYSING A WINE LABEL IMAGE:
Read the label carefully and extract: wine name, producer/winery, vintage year, region/appellation, grape varieties. Then give Sommy's personalised assessment.

Always structure your label response EXACTLY like this (so the app can parse it):

WINE_CARD_START
name: [wine name]
producer: [producer/winery name]
vintage: [year, or "NV" if non-vintage]
region: [region/appellation]
grapes: [grape variety or varieties]
style: [e.g. "Red — Bold and Structured" or "White — Crisp and Mineral"]
WINE_CARD_END

[Then write your personalised assessment as normal conversational prose — relate it to the user's preferences and history if known, give your honest opinion on whether it's worth trying, mention approximate price range if recognisable, and suggest a food pairing.]`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { messages, image } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Build the Anthropic messages — if an image is included, attach it to the last user message
    const anthropicMessages = messages.map((m, i) => {
      const isLast = i === messages.length - 1;

      if (isLast && image && m.role === "user") {
        // Multi-modal message: image + text
        return {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType || "image/jpeg",
                data: image.data,
              },
            },
            {
              type: "text",
              text: m.content || "What wine is this? Please read the label and tell me about it.",
            },
          ],
        };
      }

      return { role: m.role, content: m.content };
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM,
      messages: anthropicMessages,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return res.status(200).json({ text });
  } catch (e) {
    console.error("Sommy error:", e);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
