// Vercel serverless function — proxies GA4 Data API for the admin dashboard.
// Uses Google Analytics Data API v1 with the service account from GA4 property.
// For now, returns graceful empty state — will populate once GA4 accumulates data.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  // For now, return placeholder indicating GA4 is collecting data
  // Once the property ID is confirmed, this will query the GA4 Data API
  try {
    const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
    
    if (!GA4_PROPERTY_ID) {
      // Return a structured empty response — the frontend handles this gracefully
      return res.status(200).json({
        channelData: [],
        topPages: [],
        dailyTraffic: [],
        totalSessions: 0,
        organicSessions: 0,
        status: "awaiting_data",
        message: "GA4 is collecting data. Metrics will appear once traffic accumulates.",
      });
    }

    // TODO: Once GA4 property ID is set, query the Data API here
    return res.status(200).json({
      channelData: [],
      topPages: [],
      dailyTraffic: [],
      totalSessions: 0,
      organicSessions: 0,
      status: "awaiting_data",
    });
  } catch (err) {
    console.error("admin-analytics error:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
