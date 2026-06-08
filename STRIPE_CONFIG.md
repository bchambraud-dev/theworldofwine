# Stripe Configuration — The World of Wine

## Account
- **Display name:** The World of Wine sandbox
- **Account ID:** acct_1TX5tw4Q9NUKXYqw
- **Mode:** SANDBOX (livemode: false)

## Product
- **Name:** The World of Wine Premium
- **ID:** `prod_UepJeW0w1ikCj6`
- **Description:** Unlimited cellar, journal, wishlist, and Sommy chat. Match scores, drinking-window alerts, persona, exports, and proactive coaching. Wine, taken personally.

## Prices (multi-currency)

Both prices have `currency_options` set for SGD (base), USD, GBP, EUR, AUD, NZD, CAD. Stripe Checkout picks display currency from customer locale.

### Monthly — `price_1Tfbfz4Q9NUKXYqw2NWJU8oS` (lookup_key: `twow_premium_monthly`)

| Currency | Amount |
|---|---|
| SGD | 4.99 |
| USD | 3.99 |
| GBP | 2.99 |
| EUR | 3.49 |
| AUD | 5.99 |
| NZD | 6.49 |
| CAD | 4.99 |

### Yearly — `price_1Tfbfz4Q9NUKXYqwWp6ScGqz` (lookup_key: `twow_premium_yearly`)

| Currency | Amount |
|---|---|
| SGD | 29.99 |
| USD | 23.99 |
| GBP | 17.99 |
| EUR | 19.99 |
| AUD | 35.99 |
| NZD | 38.99 |
| CAD | 29.99 |

## Archived prices (do not use)
- `price_1TfVfR4Q9NUKXYqwaFg2EWd4` — original SGD-only monthly
- `price_1TfVfR4Q9NUKXYqwTzgxpIUj` — original SGD-only yearly
- `price_1TfbfQ4Q9NUKXYqwVlSSo92U` — sanity-check SGD-only monthly

## Vercel env vars (current state)
```
STRIPE_PUBLISHABLE_KEY=pk_test_...   set in Vercel (sensitive)
STRIPE_SECRET_KEY=sk_test_...        set in Vercel (sensitive)
TWOW_STRIPE_PRICE_MONTHLY=price_1Tfbfz4Q9NUKXYqw2NWJU8oS
TWOW_STRIPE_PRICE_YEARLY=price_1Tfbfz4Q9NUKXYqwWp6ScGqz
STRIPE_WEBHOOK_SECRET=whsec_...      pending — added after webhook endpoint created
```

## Trial model
- **Option A** confirmed: no card upfront
- Free 30-day trial granted at signup via DB flag (`tier='trial'`, `trial_ends_at=now()+30d`)
- No Stripe Subscription exists during trial
- At day 25 + day 28: in-app + email reminder
- Day 30 + 1: user drops to `tier='free'` (no card was captured, no charge possible)
- "Continue with Premium" CTA → creates Stripe Checkout → first charge that day

## Grandfathering
- Policy: TBD — awaiting Brice's call (Policy A: all 11 real users; Policy B: curated list)
- TWOW test account (twow.review@gmail.com) NEVER grandfathered

## When going to production
1. Toggle Stripe to live mode
2. Re-create product + prices in live mode (different IDs)
3. Swap env vars to live keys + live price IDs
4. Re-create webhook endpoint in live mode
