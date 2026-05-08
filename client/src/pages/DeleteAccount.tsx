import { useLocation } from "wouter";

const s = {
  page: {
    position: "fixed",
    inset: 0,
    overflowY: "auto",
    background: "#F7F4EF",
    padding: "60px 24px 80px",
    zIndex: 50,
  } as React.CSSProperties,
  inner: {
    maxWidth: 720,
    margin: "0 auto",
  } as React.CSSProperties,
  back: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.12em",
    color: "#8C1C2E",
    padding: 0,
    marginBottom: 40,
    display: "block",
  } as React.CSSProperties,
  wordmark: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1rem",
    fontWeight: 400,
    color: "#1A1410",
    marginBottom: 48,
  } as React.CSSProperties,
  eyebrow: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.62rem",
    letterSpacing: "0.16em",
    color: "#8C1C2E",
    marginBottom: 14,
  } as React.CSSProperties,
  h1: {
    fontFamily: "'Fraunces', serif",
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "#1A1410",
    marginBottom: 14,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
  } as React.CSSProperties,
  lede: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "1.05rem",
    fontWeight: 300,
    color: "#5A5248",
    lineHeight: 1.6,
    marginBottom: 56,
  } as React.CSSProperties,
  h2: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1.3rem",
    fontWeight: 600,
    color: "#1A1410",
    marginTop: 48,
    marginBottom: 12,
    lineHeight: 1.3,
  } as React.CSSProperties,
  sectionLabel: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.55rem",
    letterSpacing: "0.18em",
    color: "#8C1C2E",
    marginBottom: 6,
  } as React.CSSProperties,
  p: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.7,
    marginBottom: 14,
  } as React.CSSProperties,
  ol: {
    margin: "0 0 18px",
    paddingLeft: 24,
  } as React.CSSProperties,
  li: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.75,
    marginBottom: 10,
  } as React.CSSProperties,
  divider: {
    border: "none",
    borderTop: "1px solid #D4D1CA",
    margin: "60px 0 0",
  } as React.CSSProperties,
  meta: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.6rem",
    letterSpacing: "0.14em",
    color: "#AAA59A",
    marginTop: 60,
    textAlign: "center" as const,
  } as React.CSSProperties,
  contactBox: {
    background: "#FAF7F2",
    border: "1px solid #EDEAE3",
    borderRadius: 12,
    padding: "24px 22px",
    marginTop: 24,
  } as React.CSSProperties,
  contactLabel: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.55rem",
    letterSpacing: "0.18em",
    color: "#5A5248",
    marginBottom: 8,
  } as React.CSSProperties,
  contactBody: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.92rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,
  link: {
    color: "#8C1C2E",
    textDecoration: "none",
    fontWeight: 400,
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: 8,
    marginBottom: 14,
  } as React.CSSProperties,
  th: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.6rem",
    letterSpacing: "0.14em",
    color: "#8C1C2E",
    fontWeight: 500,
    textAlign: "left" as const,
    padding: "10px 12px",
    borderBottom: "1px solid #8C1C2E",
    background: "#FAF7F2",
  } as React.CSSProperties,
  td: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.55,
    padding: "12px",
    borderBottom: "1px solid #EDEAE3",
    verticalAlign: "top" as const,
  } as React.CSSProperties,
};

export default function DeleteAccount() {
  const [, setLocation] = useLocation();

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <button style={s.back} onClick={() => setLocation("/")}>← BACK</button>
        <div style={s.wordmark}>
          The World of <em>Wine</em>
        </div>

        <div style={s.eyebrow}>ACCOUNT &amp; DATA DELETION</div>
        <h1 style={s.h1}>Delete your account</h1>
        <p style={s.lede}>
          You can permanently delete your World of Wine account and all
          associated data at any time. This page explains exactly how, and what
          happens when you do.
        </p>

        <div style={s.sectionLabel}>OPTION A</div>
        <h2 style={s.h2}>Delete from inside the app</h2>
        <p style={s.p}>
          The fastest way is to delete from your account page directly:
        </p>
        <ol style={s.ol}>
          <li style={s.li}>Open The World of Wine on your phone or visit{" "}
            <a style={s.link} href="https://theworldofwine.org">theworldofwine.org</a>.
          </li>
          <li style={s.li}>Sign in with the Google account you registered with.</li>
          <li style={s.li}>Tap the menu icon (top right) and choose <strong>Profile</strong>.</li>
          <li style={s.li}>Scroll to the bottom of the profile page and tap{" "}
            <strong>Delete account</strong>.
          </li>
          <li style={s.li}>Confirm the deletion. Your account and all associated data
            will be removed within 24 hours.
          </li>
        </ol>

        <div style={s.sectionLabel}>OPTION B</div>
        <h2 style={s.h2}>Email us to delete your account</h2>
        <p style={s.p}>
          If you can't sign in — for example, you've lost access to the Google
          account you registered with, or you uninstalled the app — email us
          and we'll process the deletion manually.
        </p>

        <div style={s.contactBox}>
          <div style={s.contactLabel}>SEND TO</div>
          <p style={s.contactBody}>
            <a style={s.link} href="mailto:contact@theworldofwine.org?subject=Delete%20my%20account">
              contact@theworldofwine.org
            </a>
          </p>
          <p style={{ ...s.contactBody, marginTop: 12 }}>
            <strong>Subject:</strong> Delete my account
          </p>
          <p style={{ ...s.contactBody, marginTop: 6 }}>
            <strong>Include:</strong> the email address you used to sign up.
            That's all we need to identify your account.
          </p>
        </div>

        <p style={{ ...s.p, marginTop: 24 }}>
          We acknowledge requests within 5 business days and complete the
          deletion within 30 days, in line with applicable data protection laws.
        </p>

        <div style={s.sectionLabel}>WHAT GETS DELETED</div>
        <h2 style={s.h2}>What we remove and what we keep</h2>
        <p style={s.p}>
          When you delete your account, we permanently remove all of the
          following from our database within 24 hours of an in-app deletion, or
          within 30 days of an email request:
        </p>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Data</th>
              <th style={s.th}>What happens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}><strong>Account profile</strong> (name, email, image, country, currency preference, experience level, taste preferences)</td>
              <td style={s.td}>Permanently deleted within 24 hours.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Cellar</strong> (every wine you've added, including notes, drinking windows, value estimates, status changes)</td>
              <td style={s.td}>Permanently deleted within 24 hours.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Wishlist</strong> (saved wines, retailer searches, notes)</td>
              <td style={s.td}>Permanently deleted within 24 hours.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Tasting Journal</strong> (structured tasting notes for every wine you've recorded)</td>
              <td style={s.td}>Permanently deleted within 24 hours.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Sommy chat history</strong> (every message you've sent, including images you've uploaded)</td>
              <td style={s.td}>Permanently deleted within 24 hours.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Cached wine assessments</strong> (drink windows, value estimates) keyed only on a wine name (not your identity)</td>
              <td style={s.td}>Retained — these contain no personal data and are shared anonymously across users.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Anonymized analytics events</strong> (page-view counts, GA4 metrics)</td>
              <td style={s.td}>Retained per Google Analytics' standard 14-month retention. These cannot be linked back to you after account deletion.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Server logs</strong> (technical request logs from Vercel and Supabase)</td>
              <td style={s.td}>Retained 90 days for security/debugging, then automatically deleted. Logs do not contain wine, journal, or chat content.</td>
            </tr>
            <tr>
              <td style={s.td}><strong>Records required by law</strong> (e.g. age-verification compliance records if applicable in your jurisdiction)</td>
              <td style={s.td}>Retained only as required by law, then deleted. None contain wine, journal, or chat content.</td>
            </tr>
          </tbody>
        </table>

        <div style={s.sectionLabel}>IMPORTANT</div>
        <h2 style={s.h2}>This action cannot be undone</h2>
        <p style={s.p}>
          Account deletion is permanent. We cannot restore deleted cellars,
          tasting journals, wishlists, or chat history once removed. If you'd
          like a copy of your data before deleting, email us at{" "}
          <a style={s.link} href="mailto:contact@theworldofwine.org?subject=Data%20export%20request">
            contact@theworldofwine.org
          </a>{" "}
          with the subject "Data export request" and we'll send you an export of
          your account within 30 days.
        </p>

        <p style={s.p}>
          Deleting your World of Wine account does not affect your Google
          account. You'll still be signed into Google for other apps and
          services.
        </p>

        <hr style={s.divider} />

        <div style={s.meta}>
          THE WORLD OF WINE · ACCOUNT DELETION · MAY 2026
        </div>
      </div>
    </div>
  );
}
