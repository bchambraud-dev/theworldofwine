// Generates fun facts and expanded descriptions for regions/producers.
// Results are cached in Supabase — first request generates, subsequent requests served from cache.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || process.env.ANTH_KEY;
const SUPABASE_URL = "https://auth.theworldofwine.org";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getCached(key) {
  if (!SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/content_cache?cache_key=eq.${encodeURIComponent(key)}&select=content&limit=1`,
      { headers: { Authorization: `Bearer ${SUPABASE_KEY}`, apikey: SUPABASE_KEY } }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0]?.content || null;
  } catch { return null; }
}

async function setCache(key, content) {
  if (!SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/content_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`, apikey: SUPABASE_KEY,
        "Content-Type": "application/json", Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ cache_key: key, content, updated_at: new Date().toISOString() }),
    });
  } catch { /* non-critical */ }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { type, name, context } = req.query;
  // type = "fun_facts" | "read_more"
  // name = region or producer name
  // context = brief description for Sommy to expand on

  if (!type || !name) return res.status(400).json({ error: "type and name required" });
  if (!ANTHROPIC_KEY) return res.status(200).json({ content: null, error: "API key not configured" });

  const cacheKey = `${type}|v2|${name}`.toLowerCase();

  // Check cache first
  const cached = await getCached(cacheKey);
  if (cached) return res.status(200).json({ content: cached, fromCache: true });

  try {
    let prompt;
    if (type === "fun_facts") {
      prompt = `You are Sommy, a knowledgeable and warm pocket sommelier. Generate 5-6 fascinating, surprising, or little-known facts about "${name}" (a wine region or producer). 

Rules:
- Each fact should be a single concise bullet point (1-2 sentences max)
- Mix history, geography, winemaking techniques, cultural significance, and surprising statistics
- Be specific — include real names, dates, numbers where possible
- Tone: enthusiastic but not cheesy. Like sharing secrets with a friend over a glass
- Do NOT start with generic statements like "Did you know..."
- Return ONLY a JSON array of strings, no markdown: ["fact 1", "fact 2", ...]`;
    } else if (type === "read_more") {
      prompt = `You are Sommy, a knowledgeable wine companion. The user just read this about "${name}":

"${context || name}"

Your job is to CONTINUE that text naturally — as if you're writing the next 3-4 paragraphs that follow directly from where it left off. Do NOT reintroduce the subject. Do NOT repeat what was already said. Do NOT start with the name of the region or producer as if starting fresh. Pick up the thread and go deeper.

Cover things like:
- What makes the wines here distinctive (terroir, climate, winemaking philosophy)
- Specific wines, vintages, or styles worth knowing
- What to look for when buying or tasting
- Any fascinating historical or cultural context not yet mentioned

Tone: warm, authoritative, conversational. Speak directly to the reader using "you" and "I". No corporate jargon. No emojis.

IMPORTANT: Separate each paragraph with a blank line (double newline). Do NOT write one solid block of text.

Return ONLY the continuation text as a plain string (no JSON, no markdown headers, no title).`;
    } else {
      return res.status(400).json({ error: "type must be fun_facts or read_more" });
    }

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: type === "fun_facts" ? 400 : 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      if (apiRes.status === 429) return res.status(200).json({ content: null, rateLimited: true });
      return res.status(200).json({ content: null });
    }

    const data = await apiRes.json();
    const text = data.content[0].text.trim();

    let content;
    if (type === "fun_facts") {
      try {
        content = JSON.parse(text.replace(/^```json\n?/, "").replace(/\n?```$/, ""));
      } catch {
        content = text.split("\n").filter(l => l.trim()).map(l => l.replace(/^[-•*]\s*/, "").trim());
      }
    } else {
      content = text;
    }

    // Cache it
    await setCache(cacheKey, content);

    return res.status(200).json({ content });
  } catch (err) {
    console.error("region-content error:", err);
    return res.status(200).json({ content: null });
  }
}
