// Prerender.io middleware for Vercel
// Serves pre-rendered HTML to search engine crawlers for SEO
// while regular users get the normal SPA experience.

const PRERENDER_TOKEN = "LmP1uAWXzSXCa3PqWNIU";

const BOT_AGENTS = [
  "googlebot", "bingbot", "yandex", "baiduspider", "facebookexternalhit",
  "twitterbot", "rogerbot", "linkedinbot", "embedly", "quora link preview",
  "showyoubot", "outbrain", "pinterest", "slackbot", "vkShare", "W3C_Validator",
  "redditbot", "Applebot", "WhatsApp", "flipboard", "tumblr", "bitlybot",
  "SkypeUriPreview", "nuzzel", "Discordbot", "Google Page Speed", "Qwantify",
  "pinterestbot", "Bitrix link preview", "XING-contenttabreader", "Chrome-Lighthouse",
];

export default function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // Skip pre-rendering for API routes, static assets, and already-prerendered requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.match(/\.(js|css|xml|json|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|webp|mp4|webm)$/)
  ) {
    return;
  }

  // Check if the request is from a bot
  const isBot = BOT_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));

  if (isBot) {
    // Redirect to Prerender.io
    const prerenderUrl = `https://service.prerender.io/${url.href}`;
    return fetch(prerenderUrl, {
      headers: {
        "X-Prerender-Token": PRERENDER_TOKEN,
      },
    });
  }

  // Regular users get the normal response
  return;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
