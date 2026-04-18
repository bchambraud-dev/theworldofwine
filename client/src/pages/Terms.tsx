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

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <button style={s.back} onClick={() => setLocation("/")}>← BACK TO THE WORLD OF WINE</button>

        <div style={s.wordmark}>
          The World of <span style={{ color: "#8C1C2E" }}>Wine</span>
        </div>

        <h1 style={s.h1}>Terms of Service</h1>
        <p style={s.meta}>Last updated: April 2026</p>

        <p style={s.p}>
          Welcome to The World of Wine. By accessing or using our application at theworldofwine.org, you agree to be bound by these Terms of Service. Please read them carefully before using the service.
        </p>

        <h2 style={s.h2}>1. The Service</h2>
        <p style={s.p}>
          The World of Wine is an interactive wine education and exploration platform. It includes a personal wine companion (Sommy), an interactive wine region map, curated guides, producer listings, wine journaling tools, and personalised learning features.
        </p>
        <p style={s.p}>
          The service is provided free of charge during its current phase. We reserve the right to introduce paid features in the future with appropriate notice.
        </p>

        <h2 style={s.h2}>2. Eligibility</h2>
        <p style={s.p}>
          You must be of legal drinking age in your country of residence to use this service. By creating an account, you confirm that you meet this requirement. The World of Wine does not encourage excessive alcohol consumption.
        </p>

        <h2 style={s.h2}>3. Your Account</h2>
        <p style={s.p}>
          You sign in using your Google account. You are responsible for maintaining the security of your account and for all activity that occurs under it. Notify us immediately if you suspect unauthorised access.
        </p>
        <p style={s.p}>
          You may not share your account with others or use the service on behalf of another person without their consent.
        </p>

        <h2 style={s.h2}>4. Acceptable Use</h2>
        <p style={s.p}>When using The World of Wine, you agree not to:</p>
        <ul style={s.ul}>
          <li>Use the service for any unlawful purpose</li>
          <li>Attempt to access, tamper with, or disrupt the service's infrastructure</li>
          <li>Reverse engineer, copy, or redistribute any part of the platform</li>
          <li>Use automated scripts or bots to interact with the service</li>
          <li>Submit false, misleading, or harmful content</li>
        </ul>

        <h2 style={s.h2}>5. AI Recommendations (Sommy)</h2>
        <p style={s.p}>
          Sommy is a personal wine companion designed to provide educational information and general wine recommendations. Sommy's responses are generated computationally and should be treated as guidance rather than professional advice.
        </p>
        <p style={s.p}>
          Wine recommendations, food pairings, and tasting notes are subjective. We do not guarantee that any recommendation will suit your personal taste or be appropriate for your specific circumstances. Always drink responsibly.
        </p>

        <h2 style={s.h2}>6. User-Generated Content</h2>
        <p style={s.p}>
          Content you create within the app — including wine journal entries, notes, and conversations with Sommy — remains yours. By storing this content in our platform, you grant us a limited licence to process and display it solely for the purpose of providing the service to you.
        </p>
        <p style={s.p}>
          We do not claim ownership over your personal notes or content.
        </p>

        <h2 style={s.h2}>7. Intellectual Property</h2>
        <p style={s.p}>
          All content on The World of Wine — including text, design, illustrations, maps, and code — is the property of The World of Wine and may not be reproduced, distributed, or used without prior written permission.
        </p>
        <p style={s.p}>
          Wine producer information, regional data, and educational content are curated for accuracy but may not be exhaustive. We welcome corrections at the contact address below.
        </p>

        <h2 style={s.h2}>8. Disclaimers</h2>
        <p style={s.p}>
          The World of Wine is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that any specific features will remain available. Wine information, pricing, and availability are subject to change without notice.
        </p>

        <h2 style={s.h2}>9. Limitation of Liability</h2>
        <p style={s.p}>
          To the maximum extent permitted by law, The World of Wine and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability for any claim shall not exceed the amount you paid to use the service in the twelve months preceding the claim.
        </p>

        <h2 style={s.h2}>10. Changes to These Terms</h2>
        <p style={s.p}>
          We may update these Terms of Service from time to time. We will notify you of material changes by updating the date at the top of this page. Continued use of the service after changes are posted constitutes your acceptance of the revised terms.
        </p>

        <h2 style={s.h2}>11. Termination</h2>
        <p style={s.p}>
          We reserve the right to suspend or terminate access to the service at our discretion, particularly in cases of misuse or violation of these terms. You may delete your account at any time by contacting us.
        </p>

        <h2 style={s.h2}>12. Governing Law</h2>
        <p style={s.p}>
          These terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation in the first instance.
        </p>

        <h2 style={s.h2}>13. Contact</h2>
        <p style={s.p}>
          Questions about these terms can be directed to:{" "}
          <a href="mailto:hello@theworldofwine.org" style={s.a}>hello@theworldofwine.org</a>
        </p>

        <hr style={s.hr} />

        <p style={{ ...s.p, color: "#D4D1CA", fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} The World of Wine. All rights reserved.{" "}
          <button onClick={() => setLocation("/privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8C1C2E", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", padding: 0 }}>Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
