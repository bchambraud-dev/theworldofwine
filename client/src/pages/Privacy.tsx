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
  h1: {
    fontFamily: "'Fraunces', serif",
    fontSize: "2rem",
    fontWeight: 400,
    color: "#1A1410",
    marginBottom: 8,
    lineHeight: 1.2,
  } as React.CSSProperties,
  meta: {
    fontFamily: "'Geist Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "#D4D1CA",
    marginBottom: 48,
  } as React.CSSProperties,
  h2: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1.15rem",
    fontWeight: 400,
    color: "#1A1410",
    marginTop: 40,
    marginBottom: 12,
  } as React.CSSProperties,
  p: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.92rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.75,
    marginBottom: 16,
  } as React.CSSProperties,
  ul: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.92rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.75,
    paddingLeft: 20,
    marginBottom: 16,
  } as React.CSSProperties,
  hr: {
    border: "none",
    borderTop: "1px solid #EDEAE3",
    margin: "48px 0",
  } as React.CSSProperties,
  a: {
    color: "#8C1C2E",
    textDecoration: "none",
  } as React.CSSProperties,
};

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <button style={s.back} onClick={() => setLocation("/")}>← BACK TO THE WORLD OF WINE</button>

        <div style={s.wordmark}>
          The World of <span style={{ color: "#8C1C2E" }}>Wine</span>
        </div>

        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.meta}>Last updated: April 2026</p>

        <p style={s.p}>
          The World of Wine ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application at theworldofwine.org.
        </p>

        <h2 style={s.h2}>Information We Collect</h2>
        <p style={s.p}>When you sign in with Google, we receive the following information from your Google account:</p>
        <ul style={s.ul}>
          <li>Your name and first name</li>
          <li>Your email address</li>
          <li>Your profile photo</li>
        </ul>
        <p style={s.p}>As you use the app, we also store:</p>
        <ul style={s.ul}>
          <li>Your wine preferences (experience level, preferred wine styles) set during onboarding or in your profile</li>
          <li>Conversations you have with Sommy, your personal wine companion</li>
          <li>Wine regions and guides you explore</li>
          <li>Wines you log in your personal journal</li>
          <li>Goals you set within the app</li>
        </ul>

        <h2 style={s.h2}>How We Use Your Information</h2>
        <p style={s.p}>We use the information we collect to:</p>
        <ul style={s.ul}>
          <li>Personalise your experience and remember your wine preferences across sessions</li>
          <li>Allow Sommy to give contextually relevant recommendations based on your taste and history</li>
          <li>Track your wine learning journey and progress</li>
          <li>Improve the quality of our recommendations and content</li>
        </ul>
        <p style={s.p}>We do not sell your personal information to third parties. We do not use your data for advertising purposes.</p>

        <h2 style={s.h2}>Data Storage</h2>
        <p style={s.p}>
          Your data is stored securely using Supabase, a cloud database platform. Our database is hosted in the Asia-Pacific (Singapore) region. All data is encrypted in transit and at rest.
        </p>
        <p style={s.p}>
          Conversations with Sommy are processed via Anthropic's Claude API. Message content is transmitted to Anthropic's servers solely to generate responses and is not used to train their models under the standard API terms.
        </p>

        <h2 style={s.h2}>Data Retention</h2>
        <p style={s.p}>
          We retain your data for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us at the address below.
        </p>

        <h2 style={s.h2}>Your Rights</h2>
        <p style={s.p}>You have the right to:</p>
        <ul style={s.ul}>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and personal data</li>
          <li>Export your data in a portable format</li>
        </ul>

        <h2 style={s.h2}>Cookies and Local Storage</h2>
        <p style={s.p}>
          We use browser local storage to maintain your authenticated session between visits. We do not use third-party advertising or tracking cookies. Google Tag Manager is used solely to understand aggregate usage patterns.
        </p>

        <h2 style={s.h2}>Third-Party Services</h2>
        <p style={s.p}>The app integrates with the following third-party services:</p>
        <ul style={s.ul}>
          <li><strong>Google OAuth</strong> — for authentication. Governed by Google's Privacy Policy.</li>
          <li><strong>Supabase</strong> — for database and authentication infrastructure.</li>
          <li><strong>Anthropic Claude</strong> — for AI-powered wine recommendations via Sommy.</li>
          <li><strong>Google Tag Manager</strong> — for aggregate analytics.</li>
        </ul>

        <h2 style={s.h2}>Children's Privacy</h2>
        <p style={s.p}>
          The World of Wine is intended for adults of legal drinking age in their country of residence. We do not knowingly collect data from anyone under the age of 18.
        </p>

        <h2 style={s.h2}>Changes to This Policy</h2>
        <p style={s.p}>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Continued use of the app after changes constitutes acceptance of the updated policy.
        </p>

        <h2 style={s.h2}>Contact</h2>
        <p style={s.p}>
          For any privacy-related questions or to exercise your data rights, please contact us at:{" "}
          <a href="mailto:hello@theworldofwine.org" style={s.a}>hello@theworldofwine.org</a>
        </p>

        <hr style={s.hr} />

        <p style={{ ...s.p, color: "#D4D1CA", fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} The World of Wine. All rights reserved.{" "}
          <button onClick={() => setLocation("/terms")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8C1C2E", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", padding: 0 }}>Terms of Service</button>
        </p>
      </div>
    </div>
  );
}
