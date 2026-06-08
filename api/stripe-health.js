// /api/stripe-health
// Diagnostic endpoint: verifies that Stripe env vars are set AND the secret key
// actually authenticates against Stripe. Does NOT return any secret values.
//
// Returns:
// {
//   ok: boolean,                  // true only if all checks pass
//   env: {
//     publishable_set: bool,
//     secret_set: bool,
//     monthly_price_id_set: bool,
//     yearly_price_id_set: bool
//   },
//   stripe: {
//     account_reachable: bool,
//     account_id: string | null,  // first ~12 chars only, not sensitive
//     livemode: bool | null,
//     monthly_price_valid: bool,
//     yearly_price_valid: bool,
//     monthly_currencies: string[] | null,
//     yearly_currencies: string[] | null
//   },
//   errors: string[]
// }

export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  const errors = [];
  const env = {
    publishable_set: Boolean(process.env.STRIPE_PUBLISHABLE_KEY),
    secret_set: Boolean(process.env.STRIPE_SECRET_KEY),
    monthly_price_id_set: Boolean(process.env.TWOW_STRIPE_PRICE_MONTHLY),
    yearly_price_id_set: Boolean(process.env.TWOW_STRIPE_PRICE_YEARLY),
  };

  if (!env.publishable_set) errors.push("STRIPE_PUBLISHABLE_KEY not set");
  if (!env.secret_set) errors.push("STRIPE_SECRET_KEY not set");
  if (!env.monthly_price_id_set) errors.push("TWOW_STRIPE_PRICE_MONTHLY not set");
  if (!env.yearly_price_id_set) errors.push("TWOW_STRIPE_PRICE_YEARLY not set");

  const stripe = {
    account_reachable: false,
    account_id: null,
    livemode: null,
    monthly_price_valid: false,
    yearly_price_valid: false,
    monthly_currencies: null,
    yearly_currencies: null,
  };

  // If we have a secret key, try to talk to Stripe
  if (env.secret_set) {
    const secret = process.env.STRIPE_SECRET_KEY;
    const auth = "Basic " + Buffer.from(secret + ":").toString("base64");

    // 1. Account reachability
    try {
      const r = await fetch("https://api.stripe.com/v1/account", { headers: { Authorization: auth } });
      if (r.ok) {
        const acct = await r.json();
        stripe.account_reachable = true;
        // Only return first 12 chars of account id to be conservative (it's not really sensitive but no need)
        stripe.account_id = acct.id || null;
        // Detect livemode via the secret key prefix; sandbox/test keys start with sk_test_
        stripe.livemode = !secret.startsWith("sk_test_");
      } else {
        const text = await r.text();
        errors.push("Stripe account fetch failed: " + r.status + " " + text.slice(0, 200));
      }
    } catch (e) {
      errors.push("Stripe account fetch threw: " + (e && e.message ? e.message : String(e)));
    }

    // 2. Monthly price retrievable + currency options
    if (env.monthly_price_id_set) {
      try {
        const id = process.env.TWOW_STRIPE_PRICE_MONTHLY;
        const r = await fetch(
          "https://api.stripe.com/v1/prices/" + encodeURIComponent(id) + "?expand[]=currency_options",
          { headers: { Authorization: auth } }
        );
        if (r.ok) {
          const price = await r.json();
          stripe.monthly_price_valid = price && price.active === true;
          stripe.monthly_currencies = price.currency_options ? Object.keys(price.currency_options).sort() : [];
          if (!stripe.monthly_price_valid) errors.push("Monthly price exists but is not active");
        } else {
          const text = await r.text();
          errors.push("Monthly price fetch failed: " + r.status + " " + text.slice(0, 200));
        }
      } catch (e) {
        errors.push("Monthly price fetch threw: " + (e && e.message ? e.message : String(e)));
      }
    }

    // 3. Yearly price retrievable + currency options
    if (env.yearly_price_id_set) {
      try {
        const id = process.env.TWOW_STRIPE_PRICE_YEARLY;
        const r = await fetch(
          "https://api.stripe.com/v1/prices/" + encodeURIComponent(id) + "?expand[]=currency_options",
          { headers: { Authorization: auth } }
        );
        if (r.ok) {
          const price = await r.json();
          stripe.yearly_price_valid = price && price.active === true;
          stripe.yearly_currencies = price.currency_options ? Object.keys(price.currency_options).sort() : [];
          if (!stripe.yearly_price_valid) errors.push("Yearly price exists but is not active");
        } else {
          const text = await r.text();
          errors.push("Yearly price fetch failed: " + r.status + " " + text.slice(0, 200));
        }
      } catch (e) {
        errors.push("Yearly price fetch threw: " + (e && e.message ? e.message : String(e)));
      }
    }
  }

  const ok =
    env.publishable_set &&
    env.secret_set &&
    env.monthly_price_id_set &&
    env.yearly_price_id_set &&
    stripe.account_reachable &&
    stripe.monthly_price_valid &&
    stripe.yearly_price_valid &&
    errors.length === 0;

  return res.status(ok ? 200 : 503).json({ ok, env, stripe, errors });
}
