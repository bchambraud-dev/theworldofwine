// Shared helpers for Stripe + Supabase admin operations.
// Imported by /api/stripe-*.js endpoints.

import Stripe from "stripe";

const SUPABASE_URL = "https://auth.theworldofwine.org";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" });
}

// Authenticate a user-facing request via Supabase JWT in Authorization header.
// Returns { user_id, email } or throws an error with .status set.
export async function authUser(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    const e = new Error("Missing Bearer token");
    e.status = 401;
    throw e;
  }
  const token = auth.slice(7);
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: token,
    },
  });
  if (!r.ok) {
    const e = new Error("Invalid or expired token");
    e.status = 401;
    throw e;
  }
  const u = await r.json();
  if (!u || !u.id) {
    const e = new Error("Invalid user");
    e.status = 401;
    throw e;
  }
  return { user_id: u.id, email: u.email };
}

function serviceRoleKey() {
  const sr = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!sr) throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  return sr;
}

// Fetch a user_profiles row by user id (service-role; bypasses RLS).
export async function getUserProfile(userId) {
  const sr = serviceRoleKey();
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${encodeURIComponent(userId)}&select=*`,
    { headers: { apikey: sr, Authorization: `Bearer ${sr}` } }
  );
  if (!r.ok) throw new Error(`Profile fetch failed: ${r.status}`);
  const rows = await r.json();
  return rows[0] || null;
}

// PATCH fields on a user_profiles row by user id (service-role).
export async function updateUserProfile(userId, fields) {
  const sr = serviceRoleKey();
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        apikey: sr,
        Authorization: `Bearer ${sr}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(fields),
    }
  );
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Profile update failed: ${r.status} ${text}`);
  }
  const rows = await r.json();
  return rows[0] || null;
}

// Find a user_profile by their Stripe customer id (for webhook events).
export async function findUserByStripeCustomer(customerId) {
  const sr = serviceRoleKey();
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profiles?stripe_customer_id=eq.${encodeURIComponent(customerId)}&select=*`,
    { headers: { apikey: sr, Authorization: `Bearer ${sr}` } }
  );
  if (!r.ok) throw new Error(`Stripe-customer lookup failed: ${r.status}`);
  const rows = await r.json();
  return rows[0] || null;
}

// Convert a Stripe unix timestamp (seconds) to ISO string for Postgres.
export function stripeTsToIso(seconds) {
  if (!seconds) return null;
  return new Date(seconds * 1000).toISOString();
}
