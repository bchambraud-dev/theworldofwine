// POST /api/stripe-webhook
// Receives Stripe webhook events. Verifies signature with STRIPE_WEBHOOK_SECRET.
// Is the SOLE writer of tier columns on user_profiles.
//
// IMPORTANT: Stripe webhook signature verification requires the RAW request body.
// We disable bodyParser and read the stream manually.

import {
  getStripe,
  findUserByStripeCustomer,
  updateUserProfile,
  stripeTsToIso,
} from "../lib/stripe-shared.js";

export const config = {
  maxDuration: 15,
  api: { bodyParser: false },
};

async function bufferReq(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).json({ error: "Missing stripe-signature header" });
  }

  let event;
  try {
    const buf = await bufferReq(req);
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err.message);
    return res.status(400).json({ error: `Signature verification failed: ${err.message}` });
  }

  try {
    await processEvent(event);
  } catch (e) {
    console.error("[stripe-webhook] handler error for", event.type, ":", e);
    // Return 500 so Stripe retries (idempotency-safe since we write deterministically)
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json({ received: true, type: event.type });
}

async function processEvent(event) {
  const stripe = getStripe();
  const type = event.type;
  const data = event.data.object;

  // ── checkout.session.completed ────────────────────────────────────────────
  if (type === "checkout.session.completed") {
    const userId = data.client_reference_id || (data.metadata && data.metadata.user_id);
    if (!userId) {
      console.warn("[stripe-webhook] checkout.session.completed without user_id");
      return;
    }
    if (!data.subscription) return;
    const sub = await stripe.subscriptions.retrieve(data.subscription);
    await updateUserProfile(userId, {
      tier: "premium",
      stripe_customer_id: data.customer,
      stripe_subscription_id: sub.id,
      subscription_status: sub.status,
      current_period_end: stripeTsToIso(sub.current_period_end),
      subscription_cancel_at_period_end: sub.cancel_at_period_end || false,
      subscription_canceled_at: null,
    });
    return;
  }

  // ── customer.subscription.updated ─────────────────────────────────────────
  if (type === "customer.subscription.updated") {
    const sub = data;
    const profile = await findUserByStripeCustomer(sub.customer);
    if (!profile) {
      console.warn("[stripe-webhook] no profile for customer", sub.customer);
      return;
    }
    const fields = {
      stripe_subscription_id: sub.id,
      subscription_status: sub.status,
      current_period_end: stripeTsToIso(sub.current_period_end),
      subscription_cancel_at_period_end: sub.cancel_at_period_end || false,
    };
    if (sub.status === "active" || sub.status === "trialing" || sub.status === "past_due") {
      // Past_due keeps Premium access during Stripe's smart-retry window
      fields.tier = "premium";
    } else if (
      sub.status === "canceled" ||
      sub.status === "incomplete_expired" ||
      sub.status === "unpaid"
    ) {
      fields.tier = "cancelled";
      fields.subscription_canceled_at = new Date().toISOString();
    }
    await updateUserProfile(profile.id, fields);
    return;
  }

  // ── customer.subscription.deleted ─────────────────────────────────────────
  if (type === "customer.subscription.deleted") {
    const sub = data;
    const profile = await findUserByStripeCustomer(sub.customer);
    if (!profile) return;
    await updateUserProfile(profile.id, {
      tier: "cancelled",
      subscription_status: "canceled",
      subscription_canceled_at: new Date().toISOString(),
      subscription_cancel_at_period_end: false,
    });
    return;
  }

  // ── invoice.payment_succeeded ─────────────────────────────────────────────
  if (type === "invoice.payment_succeeded") {
    const inv = data;
    if (!inv.subscription) return;
    const sub = await stripe.subscriptions.retrieve(inv.subscription);
    const profile = await findUserByStripeCustomer(sub.customer);
    if (!profile) return;
    await updateUserProfile(profile.id, {
      tier: "premium",
      subscription_status: sub.status,
      current_period_end: stripeTsToIso(sub.current_period_end),
    });
    return;
  }

  // ── invoice.payment_failed ────────────────────────────────────────────────
  if (type === "invoice.payment_failed") {
    const inv = data;
    if (!inv.subscription) return;
    const sub = await stripe.subscriptions.retrieve(inv.subscription);
    const profile = await findUserByStripeCustomer(sub.customer);
    if (!profile) return;
    await updateUserProfile(profile.id, {
      subscription_status: sub.status, // typically 'past_due'
    });
    return;
  }

  // Unhandled event types — log and ignore (Stripe sends many we don't care about)
  console.log("[stripe-webhook] ignored event type:", type);
}
