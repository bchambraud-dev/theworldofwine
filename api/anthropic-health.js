// /api/anthropic-health
// Minimal diagnostic to surface the real Anthropic API error (chat.js wraps everything in a generic 500).
// Returns ONLY booleans + error message string, never the key value.

import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 25 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  const out = {
    env: {
      key_set: Boolean(process.env.ANTHROPIC_API_KEY),
      key_prefix: process.env.ANTHROPIC_API_KEY
        ? process.env.ANTHROPIC_API_KEY.slice(0, 10) + "…"
        : null,
    },
    anthropic: {
      reachable: false,
      model_used: "claude-sonnet-4-6",
      response_id: null,
      error_status: null,
      error_message: null,
      error_type: null,
    },
  };

  if (!out.env.key_set) {
    return res.status(500).json({ ok: false, ...out, message: "ANTHROPIC_API_KEY not set" });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    // List available models (lets us see what's current after Anthropic deprecations).
    let available_models = null;
    try {
      const list = await client.models.list();
      available_models = (list?.data || []).map((m) => ({ id: m.id, display_name: m.display_name, created_at: m.created_at }));
    } catch (le) {
      out.anthropic.list_error = le.message || String(le);
    }
    out.anthropic.available_models = available_models;
    return res.status(200).json({ ok: true, ...out });
  } catch (e) {
    out.anthropic.error_status = e.status || null;
    out.anthropic.error_message = e.message || String(e);
    out.anthropic.error_type = e.error?.type || e.name || null;
    return res.status(500).json({ ok: false, ...out });
  }
}
