// Shared raw-fetch helpers for Supabase write operations.
// The Supabase JS client's internal auth lock hangs indefinitely on write
// operations, so all inserts/updates/deletes go through raw fetch().

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
