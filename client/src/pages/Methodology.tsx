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
    maxWidth: 760,
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
    marginTop: 56,
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
  ul: {
    margin: "0 0 18px",
    paddingLeft: 20,
  } as React.CSSProperties,
  li: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 300,
    color: "#1A1410",
    lineHeight: 1.7,
    marginBottom: 6,
  } as React.CSSProperties,
  callout: {
    background: "rgba(140,28,46,0.04)",
    borderLeft: "2px solid #8C1C2E",
    padding: "14px 18px",
    marginTop: 12,
    marginBottom: 18,
    borderRadius: 4,
  } as React.CSSProperties,
  calloutText: {
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem",
    fontWeight: 400,
    color: "#1A1410",
    lineHeight: 1.6,
    margin: 0,
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
};

export default function Methodology() {
  const [, setLocation] = useLocation();

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <button style={s.back} onClick={() => setLocation("/")}>← BACK</button>
        <div style={s.wordmark}>
          The World of <em>Wine</em>
        </div>

        <div style={s.eyebrow}>METHODOLOGY · MAY 2026</div>
        <h1 style={s.h1}>How The World of Wine Works</h1>
        <p style={s.lede}>
          A plain-English account of how the app produces what you see — what's
          hand-written, what's generated, and what we deliberately don't claim.
          We publish this because trust is the foundation of everything we do.
        </p>

        {/* 01 — Editorial */}
        <div style={s.sectionLabel}>01</div>
        <h2 style={s.h2}>The editorial backbone</h2>
        <p style={s.p}>
          59 wine regions, 280 producers, 24 grape varieties, 18 guides, 10 journeys,
          and 20 quizzes — all hand-written by the team. Vintage commentary is sourced
          from published vintage reports. News headlines are curated archives, not a
          live feed. None of this changes without a code release.
        </p>

        {/* 02 — Sommy */}
        <div style={s.sectionLabel}>02</div>
        <h2 style={s.h2}>Sommy chat</h2>
        <p style={s.p}>
          Sommy is powered by Claude Sonnet 4 (Anthropic). Conversations are
          stateless — each request includes recent history, but Anthropic does not
          retain or train on the data. Sommy speaks in first person, keeps replies
          short, and quotes prices in your preferred currency. When you ask Sommy to
          analyse a label photo, it reads the image and returns a structured wine card
          (name, producer, vintage, region, grapes, sensory profile, drinking window).
        </p>

        {/* 03 — Drinking windows */}
        <div style={s.sectionLabel}>03</div>
        <h2 style={s.h2}>Drinking windows</h2>
        <p style={s.p}>
          Every wine in your cellar has four years that define when it should be
          opened — drink from, peak start, peak end, drink until. Sommy estimates
          these the first time the wine is added, drawing on grape variety, region,
          vintage quality, producer style, and typical aging curves. The phase you see
          (Hold, Young, Peak, Drink Soon, Past Peak) is then computed deterministically
          from those years and the current date.
        </p>
        <p style={s.p}>
          Every value is editable. If you disagree with Sommy's window, override it —
          your edit takes precedence for your cellar.
        </p>

        {/* 04 — Decanting */}
        <div style={s.sectionLabel}>04</div>
        <h2 style={s.h2}>Decanting guidance</h2>
        <p style={s.p}>
          Decanting is the only part of the cellar experience with no AI involvement.
          Sommelier consensus on decanting is well established and predictable, so we
          encode it as straightforward rules based on grape, style, region, and vintage
          age. The same wine will always get the same recommendation. The rules follow
          working consensus from Jancis Robinson's <em>Oxford Companion to Wine</em>,
          Karen MacNeil's <em>Wine Bible</em>, the WSET diploma materials, and Decanter's
          editorial guidance — and they err on the side of gentler treatment.
        </p>

        {/* 05 — Valuations */}
        <div style={s.sectionLabel}>05</div>
        <h2 style={s.h2}>Wine valuations</h2>
        <p style={s.p}>
          Each bottle's estimated value is generated by Sommy when the wine is first
          added to your cellar. The estimate represents typical retail / market value
          for a single bottle at current trade, drawing on the model's training corpus
          of secondary-market prices (Wine-Searcher, Vivino, retailer listings).
          Values are stored in USD and converted to your preferred currency at display
          time using exchange rates refreshed every 12 hours from a public open-data API.
        </p>
        <p style={s.p}>
          Your <strong>Cellar Value</strong> is the sum of (estimated value × quantity)
          across active wines, then converted to your currency. Wines marked consumed
          or gifted are excluded.
        </p>
        <div style={s.callout}>
          <p style={s.calloutText}>
            <strong>What we explicitly don't claim.</strong> The valuation is an
            educated estimate, not a market quote, not an insurance valuation, and
            not investment advice. We don't account for provenance, condition, fill
            level, label quality, storage history, auction premiums, or jurisdictional
            duties. For any actual transaction, consult Wine-Searcher, Liv-ex, or a
            fine wine merchant.
          </p>
        </div>

        {/* 06 — Fun facts / Read more */}
        <div style={s.sectionLabel}>06</div>
        <h2 style={s.h2}>Fun facts &amp; Read More</h2>
        <p style={s.p}>
          On region and producer pages, the hand-written bio comes first. Two AI
          features extend it on demand: <strong>Read More</strong> generates 3–4 paragraphs
          of continuation (not a fresh introduction), and <strong>Interesting Facts</strong>
          returns 5–6 bullet points mixing history, geography, technique, and surprising
          statistics. Both are cached, so repeat visitors see the same answer over time —
          and any reported error can be permanently corrected by invalidating its cache entry.
        </p>
        <p style={s.p}>
          Generated facts can be wrong, especially for less-documented producers. The
          editorial bio is always the primary source of truth; AI content extends it
          rather than replacing it. We'll add retrieval-grounded fact checking against
          authoritative sources in a future release.
        </p>

        {/* 07 — Retailer search */}
        <div style={s.sectionLabel}>07</div>
        <h2 style={s.h2}>Retailer search</h2>
        <p style={s.p}>
          When you tap <strong>Find Retailers</strong> on a wishlist wine, Sommy runs a
          live web search (capped at 2 searches per request) and returns real product
          page URLs in your country. The prompt explicitly forbids fabricated URLs,
          and any returned item missing a real link is filtered out. Results are cached
          for 48 hours, then re-fetched. If the search returns nothing useful, you'll
          see fallback links to Vivino and Wine-Searcher.
        </p>
        <p style={s.p}>
          We don't use affiliate links. Retailer order is determined by search relevance,
          not paid placement.
        </p>

        {/* 08 — Wishlist */}
        <div style={s.sectionLabel}>08</div>
        <h2 style={s.h2}>Wishlist &amp; recommendations</h2>
        <p style={s.p}>
          Wines Sommy recommends in chat are shown as saveable cards. <strong>Nothing
          gets added to your wishlist without you clicking to save it.</strong> No
          producer or retailer pays for placement. The same question to Sommy at
          different times for different users will produce different answers — that's
          conversational variation, not commercial bias.
        </p>

        {/* What we don't claim */}
        <div style={s.sectionLabel}>09</div>
        <h2 style={s.h2}>What we don't claim</h2>
        <ul style={s.ul}>
          <li style={s.li}>We don't provide investment advice.</li>
          <li style={s.li}>We don't guarantee retailer prices, stock, or availability.</li>
          <li style={s.li}>We don't certify a bottle's provenance, storage, or authenticity.</li>
          <li style={s.li}>We don't predict the experience of any specific bottle — drinking
            windows describe typical aging arcs under typical storage.</li>
          <li style={s.li}>We don't score wines. Sommy reflects, not grades.</li>
          <li style={s.li}>We don't fact-check generated content against external sources at runtime.</li>
        </ul>

        {/* Privacy summary */}
        <div style={s.sectionLabel}>10</div>
        <h2 style={s.h2}>Privacy &amp; what we share</h2>
        <p style={s.p}>
          Your cellar, wishlist, journal, and chat history are stored in Supabase
          (Asia-Pacific region) under your authenticated account. Your messages and
          label photos are sent to Anthropic for inference only — Anthropic's policy
          is not to train models on this data. We use Google OAuth for sign-in and
          Google Analytics for aggregate engagement metrics (no wine-level data is
          shared). We don't sell your data, train models on it, or run personalised ads.
          You can delete your account and all associated data from your profile page.
        </p>

        {/* Corrections */}
        <div style={s.sectionLabel}>11</div>
        <h2 style={s.h2}>Found something wrong?</h2>
        <p style={s.p}>
          Every cellar wine is fully editable — name, producer, vintage, region, grapes,
          drinking window, tasting notes, value. For errors in our editorial content
          (region pages, producer bios, vintage commentary, fun facts) please write to
          us. We aim to acknowledge corrections within 5 business days; substantive edits
          ship in the next release; critical errors are hot-fixed within 48 hours.
        </p>

        <div style={s.contactBox}>
          <div style={s.contactLabel}>CONTACT</div>
          <p style={s.contactBody}>
            Corrections, questions, or deeper detail:{" "}
            <a style={s.link} href="mailto:contact@theworldofwine.org">contact@theworldofwine.org</a>
          </p>
        </div>

        <hr style={s.divider} />

        <div style={s.meta}>
          THE WORLD OF WINE · METHODOLOGY V1.0 · MAY 2026
        </div>
      </div>
    </div>
  );
}
