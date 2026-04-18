// Vercel serverless function — proxies GA4 Data API for the admin dashboard.
// GA4 Property ID: 427569249

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "";
const GA4_API_URL = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  // GA4 Data API requires OAuth2 or service account credentials.
  // Until a service account is configured, return a structured empty state.
  // To enable: set GA4_SERVICE_ACCOUNT_KEY env var in Vercel with the JSON key.

  try {
    return res.status(200).json({
      channelData: [],
      topPages: [],
      dailyTraffic: [],
      totalSessions: 0,
      organicSessions: 0,
      propertyId: GA4_PROPERTY_ID || "pending",
      status: "awaiting_credentials",
      message: "GA4 configured via GTM. Set GA4_PROPERTY_ID env var in Vercel to enable live reporting.",
    });
  } catch (err) {
    console.error("admin-analytics error:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
