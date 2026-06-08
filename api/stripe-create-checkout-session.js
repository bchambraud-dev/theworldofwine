// POST /api/stripe-create-checkout-session
// Authenticated. Body: { interval: 'month' | 'year' }
// Returns: { url: string } — redirect the user here.

import {
  getStripe,
  authUser,
  getUserProfile,
  updateUserProfile,
} from "../lib/stripe-shared.js";

export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { user_id, email } = await authUser(req);
    const body = req.body || {};
    const interval = body.interval === "year" ? "year" : "month";

    const priceId = interval === "year"
      ? process.env.TWOW_STRIPE_PRICE_YEARLY
      : process.env.TWOW_STRIPE_PRICE_MONTHLY;
    if (!priceId) return res.status(500).json({ error: "Price not configured" });

    const profile = await getUserProfile(user_id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    // Grandfathered users already have lifetime Premium — block upgrade
    if (profile.grandfathered === true) {
      return res.status(400).json({
        error: "grandfathered",
        message:
          "You already have lifetime Premium as a founding member. No upgrade needed.",
      });
    }

    // If they already have an active subscription, point them at the portal
    const activeStatuses = new Set(["active", "trialing", "past_due"]);
    if (
      profile.tier === "premium" &&
      profile.subscription_status &&
      activeStatuses.has(profile.subscription_status)
    ) {
      return res.status(400).json({
        error: "already_subscribed",
        message:
          "You already have an active Premium subscription. Use Manage Subscription to make changes.",
      });
    }

    const stripe = getStripe();

    // Reuse the Stripe customer if we created one already; otherwise create
    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { user_id },
      });
      customerId = customer.id;
      await updateUserProfile(user_id, { stripe_customer_id: customerId });
    }

    const origin = req.headers.origin || "https://theworldofwine.org";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      // Stripe Checkout will auto-display the local currency from the price's currency_options
      success_url: `${origin}/premium/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium`,
      allow_promotion_codes: true,
      client_reference_id: user_id,
      metadata: { user_id, interval },
      subscription_data: {
        metadata: { user_id, interval },
      },
      billing_address_collection: "auto",
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    const status = e.status || 500;
    console.error("[stripe-create-checkout-session] error:", e);
    return res.status(status).json({ error: e.message || "Server error" });
  }
}
