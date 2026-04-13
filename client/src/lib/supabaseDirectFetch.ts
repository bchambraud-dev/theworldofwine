// Shared raw-fetch helpers for ALL Supabase operations.
// The Supabase JS client's internal auth lock (navigator.locks + initializePromise)
// can hang indefinitely on ANY operation — reads AND writes. All Supabase calls
// should go through raw fetch() to bypass the auth lock entirely.

export const SUPABASE_URL = "https://ycgxczvsxiilqzvyzpso.supabase.co";
export const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ3hjenZzeGlpbHF6dnl6cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYxMzEsImV4cCI6MjA4NzM1MjEzMX0.QMqRA-a89wOTNNOnc_zchjSnqQ9QDfbYWiXXcu-4dg4";

export function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem("sb-ycgxczvsxiilqzvyzpso-auth-token");
    if (!raw) return null;
    return JSON.parse(raw)?.access_token || null;
  } catch {
    return null;
  }
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
  const token = getAccessToken();
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
  const token = getAccessToken();
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
  const token = getAccessToken();
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
  const token = getAccessToken();
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
