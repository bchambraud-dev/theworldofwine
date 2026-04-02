/**
 * Analytics tracking hook — Phase 2/3 skeleton.
 * Phase 1: logs to console. Phase 2: logs to Supabase user activity.
 */
export function useTrack() {
  return (event: string, properties?: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      console.log(`[track] ${event}`, properties || {});
    }
  };
}
