// Shared raw-fetch helpers for ALL Supabase operations.
// The Supabase JS client's internal auth lock (navigator.locks + initializePromise)
// can hang indefinitely on ANY operation — reads AND writes. All Supabase calls
// should go through raw fetch() to bypass the auth lock entirely.

export const SUPABASE_URL = "https://auth.theworldofwine.org";
export const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYxMzEsImV4cCI6MjA4NzM1MjEzMX0.QMqRA-a89wOTNNOnc_zchjSnqQ9QDfbYWiXXcu-4dg4";

const STORAGE_KEY = "sb-ycgxczvsxiilqzvyzpso-auth-token";

export function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.access_token || null;
  } catch {
    return null;
  }
}

/** Check if the stored token is expired (or within 60s of expiry). */
function isTokenExpired(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    if (!parsed?.expires_at) return false; // can't tell, assume ok
    return parsed.expires_at < Math.floor(Date.now() / 1000) + 60;
  } catch {
    return true;
  }
}

/** Refresh the access token using the stored refresh_token. */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.refresh_token) return null;

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": ANON_KEY },
      body: JSON.stringify({ refresh_token: parsed.refresh_token }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.access_token) {
      // Update localStorage with new tokens
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

/** Get a valid access token, refreshing if expired. */
export async function getValidToken(): Promise<string | null> {
  if (!isTokenExpired()) return getAccessToken();
  return await refreshAccessToken();
}

function authHeaders(token: string, json = true): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    apikey: ANON_KEY,
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export async function directInsert(
  table: string,
  row: Record<string, unknown>,
  timeoutMs = 15000,
): Promise<void> {
  const token = await getValidToken();
  if (!token) throw new Error("Session expired. Please sign in again.");

  const res = await Promise.race([
    fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...authHeaders(token), Prefer: "return=minimal" },
      body: JSON.stringify(row),
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Save timed out. Please try again.")), timeoutMs),
    ),
  ]);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Insert failed (${res.status})`);
  }
}

export async function directUpdate(
  table: string,
  id: string,
  updates: Record<string, unknown>,
  timeoutMs = 15000,
): Promise<void> {
  const token = await getValidToken();
  if (!token) throw new Error("Session expired. Please sign in again.");

  const res = await Promise.race([
    fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...authHeaders(token), Prefer: "return=minimal" },
      body: JSON.stringify(updates),
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Update timed out. Please try again.")), timeoutMs),
    ),
  ]);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Update failed (${res.status})`);
  }
}

/**
 * SELECT rows from a table via raw fetch. Returns parsed JSON array.
 * queryParams: PostgREST query string, e.g. "select=*&user_id=eq.abc&order=created_at.desc"
 */
export async function directSelect<T = any>(
  table: string,
  queryParams: string,
  timeoutMs = 15000,
): Promise<T[]> {
  const token = await getValidToken();
  if (!token) throw new Error("Session expired. Please sign in again.");

  const res = await Promise.race([
    fetch(`${SUPABASE_URL}/rest/v1/${table}?${queryParams}`, {
      method: "GET",
      headers: authHeaders(token, false),
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Load timed out. Please try again.")), timeoutMs),
    ),
  ]);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Query failed (${res.status})`);
  }

  return res.json();
}

export async function directDelete(
  table: string,
  id: string,
  timeoutMs = 15000,
): Promise<void> {
  const token = await getValidToken();
  if (!token) throw new Error("Session expired. Please sign in again.");

  const res = await Promise.race([
    fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: authHeaders(token, false),
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Delete timed out. Please try again.")), timeoutMs),
    ),
  ]);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Delete failed (${res.status})`);
  }
}
