import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 60 };

const SYSTEM = `You are Sommy, the AI sommelier. The user just completed a guided tasting of a wine you identified. They recorded their observations, and now you're revealing your own assessment alongside theirs.

Your job is NOT to score or grade them. You are a thoughtful companion reflecting on how they experienced the wine versus how you'd describe it. Be warm, specific, and genuinely helpful.

Structure your response as:
1. Start with what they noticed well — be specific ("You picked up cherry and leather on the nose — spot on, those are the signature Nebbiolo aromas")
2. Gently mention 1-2 things they might explore next time ("Next time, see if you catch a hint of dried roses — it's subtle but it's there")
3. Reflect on their palate tendencies if you can see a pattern ("You consistently rate acidity a touch lower than I would — that's actually common and it means your palate is still calibrating, which is normal")
4. One insight that enriches their understanding ("What's interesting about this wine is...")

Keep it to 2-3 short paragraphs. Warm, direct, never condescending. No emojis. No bullet points. Flowing prose.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { wine_card, user_tasting, user_context } = req.body || {};
    if (!wine_card || !user_tasting) {
      return res.status(400).json({ error: "wine_card and user_tasting required" });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userMessage = `Here is the wine I identified:
Name: ${wine_card.name || "Unknown"}
Producer: ${wine_card.producer || "Unknown"}
Region: ${wine_card.region || "Unknown"}
Grapes: ${wine_card.grapes || "Unknown"}
Style: ${wine_card.style || "Unknown"}

My tasting assessment (Sommy's notes):
Primary notes: ${wine_card.primary || "None noted"}
Secondary notes: ${wine_card.secondary || "None noted"}
Nose: ${wine_card.nose || "None noted"}
Texture: ${wine_card.texture || "None noted"}

Here is what the user observed during their guided tasting:
Appearance: ${user_tasting.appearance?.intensity || "Not noted"} intensity, ${user_tasting.appearance?.hue || "Not noted"} hue
Nose intensity: ${user_tasting.nose_intensity || "Not noted"}
Nose aromas: ${(user_tasting.nose_aromas || []).join(", ") || "None selected"}
Sweetness: ${user_tasting.sweetness || "Not noted"}
Acidity: ${user_tasting.acidity || "Not noted"}
Tannin: ${user_tasting.tannin || "Not noted"}
Body: ${user_tasting.body || "Not noted"}
Finish: ${user_tasting.finish || "Not noted"}
Palate flavours: ${(user_tasting.palate_flavours || []).join(", ") || "None selected"}
Rating: ${user_tasting.rating || "Not rated"}/5
User's notes: ${user_tasting.user_notes || "No notes"}

${user_context ? `User context: ${user_context}` : ""}

Now reflect on their tasting experience compared to yours. Be warm and specific.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: SYSTEM,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return res.status(200).json({ text });
  } catch (e) {
    console.error("Tasting compare error:", e);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
