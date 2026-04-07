export default function handler(req, res) {
  res.status(200).json({ ok: true, method: req.method, time: new Date().toISOString() });
}
// Tue Apr  7 00:21:11 UTC 2026
