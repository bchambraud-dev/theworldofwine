// Analytics — pushes custom events to GTM dataLayer.
// GA4 picks these up via GTM tags configured in the container.

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function push(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }
}

// ── User lifecycle ──────────────────────────────────────────────────────────
export const trackSignUp = () => push("sign_up", { method: "google" });
export const trackSignIn = () => push("login", { method: "google" });

// ── Core actions ────────────────────────────────────────────────────────────
export const trackWineScan = (wineName?: string) =>
  push("wine_scan", { wine_name: wineName });

export const trackWineLog = (wineName?: string, method?: string) =>
  push("wine_log", { wine_name: wineName, log_method: method });

export const trackWishlistAdd = (wineName?: string, source?: string) =>
  push("wishlist_add", { wine_name: wineName, source });

export const trackTastingComplete = (wineName?: string) =>
  push("tasting_complete", { wine_name: wineName });

// ── Exploration ─────────────────────────────────────────────────────────────
export const trackRegionView = (regionName: string) =>
  push("region_view", { region_name: regionName });

export const trackProducerView = (producerName: string) =>
  push("producer_view", { producer_name: producerName });

export const trackGuideComplete = (guideName: string) =>
  push("guide_complete", { guide_name: guideName });

export const trackQuizComplete = (quizName: string, score: number) =>
  push("quiz_complete", { quiz_name: quizName, score });

// ── Sommy ───────────────────────────────────────────────────────────────────
export const trackSommyChat = () => push("sommy_chat_start");
