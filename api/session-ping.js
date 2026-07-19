// POST /api/session-ping
// Authenticated. Updates user_profiles.last_active_at to now().
// Called by client on app mount + every 15 min while active.
// Cheap: single-row PATCH via service role.

import { authUser, updateUserProfile } from "../lib/stripe-shared.js";

export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { user_id } = await authUser(req);
    await updateUserProfile(user_id, { last_active_at: new Date().toISOString() });
    return res.status(200).json({ ok: true });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ error: e.message || "Server error" });
  }
}
