import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 60 };

/**
 * Sommy-as-teacher tasting feedback (June 6 2026 rewrite).
 *
 * Returns STRUCTURED feedback as JSON instead of flowing prose. The client
 * renders these as labelled cards:
 *   - opener: 1-2 warm sentences acknowledging the tasting attempt
 *   - nailed: array of things the user identified correctly + a short
 *     affirmation per item
 *   - look_for_next_time: array of {note, tip} pairs. Things the wine
 *     commonly shows that the user didn't mention, with a concrete tip
 *     on how to spot it
 *   - calibration: OPTIONAL array of {what_user_said, gentle_reframe}.
 *     Only include when user said something technically off; otherwise
 *     omit. Frame as "a small calibration", never "you got it wrong"
 *   - insight: one sentence that enriches understanding of this wine
 *
 * Tone rules (non-negotiable, also encoded in system prompt):
 *   - NEVER use words like "missed", "wrong", "incorrect", "mistake"
 *   - Always frame as opportunity ("next time you'll catch it")
 *   - No emojis
 *   - Stay specific to THIS wine, not generic style commentary
 */

const SYSTEM = `You are Sommy, a warm and encouraging sommelier-tutor. The user just completed a guided tasting of a wine you've identified. Your job is to help them become a better taster by reflecting on their notes versus your own assessment of this specific wine.

CRITICAL TONE RULES (these override everything):
- NEVER use words like "missed", "wrong", "incorrect", "mistake", "off". These break trust.
- Always frame gaps as opportunities: "Next time you'll catch...", "Worth looking for...", "Try this approach to spot..."
- If the user said something that's technically inaccurate, label it gently as "a small calibration" and explain WHY the alternate framing fits this wine better. Never make them feel judged.
- Be warm but specific. Generic praise is condescending. Specific praise builds confidence.
- No emojis. Light cream brand voice, no exclamation points.

RESPONSE FORMAT — return ONLY a JSON object with this exact shape:

{
  "opener": "1-2 sentences acknowledging their tasting. Warm, specific to what they did, not generic.",
  "nailed": [
    { "note": "the specific thing they identified", "affirmation": "one short sentence affirming + adding context" }
  ],
  "look_for_next_time": [
    { "note": "a tasting characteristic this wine commonly shows that the user did not mention", "tip": "a concrete sensory tip on how to spot it next time, written like a friend, not a textbook" }
  ],
  "calibration": [
    { "what_user_said": "the user's phrasing", "gentle_reframe": "warm explanation of why an alternate framing fits this wine better" }
  ],
  "insight": "one sentence that enriches the user's understanding of THIS wine — its history, region, vintage, or what makes it interesting"
}

RULES FOR EACH SECTION:
- "nailed": 2-4 items max. Only include notes the user actually wrote that align with the wine. Quality over quantity. If they wrote thin notes, include 1-2 small wins.
- "look_for_next_time": 2-3 items max. Be specific to THIS wine (use the wine's nose/palate/texture profile). Each tip must be a concrete sensory technique, not a textbook fact.
- "calibration": OMIT THE ARRAY ENTIRELY if there's nothing to calibrate. Better empty than forced. Maximum 2 items. Only include when something is technically inaccurate AND worth flagging without bruising confidence.
- "insight": one sentence. Specific to this exact wine — its terroir, vintage, producer, or style quirk.

RETURN ONLY VALID JSON. No markdown fences. No prose around it.`;

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

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || process.env.ANTH_KEY });

    const userMessage = `Here is the wine I identified:
Name: ${wine_card.name || "Unknown"}
Producer: ${wine_card.producer || "Unknown"}
Region: ${wine_card.region || "Unknown"}
Grapes: ${wine_card.grapes || "Unknown"}
Style: ${wine_card.style || "Unknown"}

My (Sommy's) tasting profile for this exact wine — these are the canonical notes you should reference when figuring out what to highlight under "nailed", "look_for_next_time", and "calibration":
Nose: ${wine_card.nose || "None noted"}
Palate: ${wine_card.palate || "None noted"}
Texture: ${wine_card.texture || "None noted"}

The user's tasting notes:
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
Free-form notes: ${user_tasting.user_notes || "None"}

${user_context ? `User context: ${user_context}` : ""}

Now produce your structured response as JSON, following all the tone and format rules. Remember: warm, specific to THIS wine, never condescending. Use the canonical nose/palate/texture above to ground your "look_for_next_time" tips.`;

    // temperature 0.3 — keep tone consistent + structured output deterministic
    // but allow some variety in phrasing across users
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      temperature: 0.3,
      system: SYSTEM,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    // Robust JSON extraction — the model is told to return only JSON, but
    // belt and suspenders in case it wraps in fences or prose.
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch {}
      }
    }

    if (!parsed || typeof parsed !== "object") {
      // Fallback to the older flowing-prose shape so the client never gets
      // an empty render. The client checks for `feedback` first and falls
      // back to `text`.
      return res.status(200).json({ text, _parseError: true });
    }

    // Normalize: ensure arrays exist and aren't huge
    const feedback = {
      opener: typeof parsed.opener === "string" ? parsed.opener : "",
      nailed: Array.isArray(parsed.nailed) ? parsed.nailed.slice(0, 4) : [],
      look_for_next_time: Array.isArray(parsed.look_for_next_time) ? parsed.look_for_next_time.slice(0, 3) : [],
      calibration: Array.isArray(parsed.calibration) ? parsed.calibration.slice(0, 2) : [],
      insight: typeof parsed.insight === "string" ? parsed.insight : "",
    };

    // Also return a flat `text` for backwards compatibility (old clients
    // and the existing wine_journal.sommy_comparison column).
    const flatText = [
      feedback.opener,
      feedback.nailed.length ? "\nWhat you nailed:\n" + feedback.nailed.map(n => `• ${n.note} — ${n.affirmation}`).join("\n") : "",
      feedback.look_for_next_time.length ? "\nTo look for next time:\n" + feedback.look_for_next_time.map(n => `• ${n.note}. ${n.tip}`).join("\n") : "",
      feedback.calibration.length ? "\nA small calibration:\n" + feedback.calibration.map(n => `• You said "${n.what_user_said}" — ${n.gentle_reframe}`).join("\n") : "",
      feedback.insight ? "\n" + feedback.insight : "",
    ].filter(Boolean).join("\n").trim();

    return res.status(200).json({ feedback, text: flatText });
  } catch (e) {
    console.error("Tasting compare error:", e);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
