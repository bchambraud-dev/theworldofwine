// POST /api/stripe-create-portal-session
// Authenticated. No body required.
// Returns: { url: string } — redirect the user to Stripe Customer Portal
// (manage payment method, view invoices, cancel subscription).

import {
  getStripe,
  authUser,
  getUserProfile,
} from "../lib/stripe-shared.js";

export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { user_id } = await authUser(req);
    const profile = await getUserProfile(user_id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    if (profile.grandfathered === true) {
      return res.status(400).json({
        error: "grandfathered",
        message: "Grandfathered Premium accounts don't have a billing portal.",
      });
    }
    if (!profile.stripe_customer_id) {
      return res.status(400).json({
        error: "no_customer",
        message: "No subscription on file. Start a subscription first.",
      });
    }

    const stripe = getStripe();
    const origin = req.headers.origin || "https://theworldofwine.org";
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/premium`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    const status = e.status || 500;
    console.error("[stripe-create-portal-session] error:", e);
    return res.status(status).json({ error: e.message || "Server error" });
  }
}
