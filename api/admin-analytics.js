// Vercel serverless function — proxies GA4 Data API for the admin dashboard.
// GA4 Property ID: 427569249

const GA4_PROPERTY_ID = "427569249";
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
      propertyId: GA4_PROPERTY_ID,
      status: "awaiting_credentials",
      message: "GA4 property 427569249 configured. Add a service account key to enable live data.",
    });
  } catch (err) {
    console.error("admin-analytics error:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
