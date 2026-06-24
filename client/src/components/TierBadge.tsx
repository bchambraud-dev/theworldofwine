import { Link } from "wouter";
import {
  isPremiumExperience,
  TWOW_GOLD,
  TWOW_GOLD_DEEP,
  type SubscriptionTier,
} from "@/lib/supabase";

// What the badge shows inline next to the user's display name.
// Five tier states render distinct chips; free/cancelled/null render NOTHING.
//
// State machine:
//   grandfathered=true                  → "PREMIUM"
//   tier='premium' (paid, active)       → "PREMIUM"
//   tier='trial', days_left > 5         → "TRIAL · N DAYS LEFT"   (quiet, no CTA)
//   tier='trial', days_left 1-5         → "N DAYS LEFT · CONTINUE →"  (CTA grows)
//   tier='trial', days_left = 0         → "TRIAL ENDING TODAY · CONTINUE →"
//   tier='free' | 'cancelled' | null    → render nothing
//
// Free users see NO chip at all — Brice's anti-shame stance.

interface TierBadgeProps {
  profile: {
    tier?: SubscriptionTier;
    trial_ends_at?: string | null;
    grandfathered?: boolean;
  } | null | undefined;
}

function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  // Ceil — partial days count as full days remaining
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

const chipBase: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "0.55rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  padding: "3px 8px",
  borderRadius: 4,
  whiteSpace: "nowrap",
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

export default function TierBadge({ profile }: TierBadgeProps) {
  if (!profile) return null;
  if (!isPremiumExperience(profile)) return null; // free / cancelled / null

  const isPaidOrGrandfathered =
    profile.grandfathered === true || profile.tier === "premium";

  // ── Grandfathered + paid Premium: simple PREMIUM chip ──
  if (isPaidOrGrandfathered) {
    return (
      <span
        style={{
          ...chipBase,
          color: TWOW_GOLD_DEEP,
          border: `1px solid ${TWOW_GOLD}`,
          background: "rgba(201,169,97,0.06)",
        }}
        data-testid="tier-badge"
        data-tier="premium"
      >
        Premium
      </span>
    );
  }

  // ── Trial: chip changes shape based on days remaining ──
  if (profile.tier === "trial") {
    const daysLeft = daysUntil(profile.trial_ends_at);
    if (daysLeft === null) {
      // No expiry on file — render a calm "Trial" chip, no CTA
      return (
        <span
          style={{
            ...chipBase,
            color: TWOW_GOLD_DEEP,
            border: `1px solid ${TWOW_GOLD}`,
            background: "rgba(201,169,97,0.06)",
          }}
          data-testid="tier-badge"
          data-tier="trial"
        >
          Trial
        </span>
      );
    }

    const isUrgent = daysLeft <= 5;
    const labelText =
      daysLeft === 0
        ? "Trial ending today"
        : daysLeft === 1
        ? "1 day left"
        : `Trial · ${daysLeft} days left`;

    // Calm state: just the label, no CTA
    if (!isUrgent) {
      return (
        <span
          style={{
            ...chipBase,
            color: TWOW_GOLD_DEEP,
            border: `1px solid ${TWOW_GOLD}`,
            background: "rgba(201,169,97,0.06)",
          }}
          data-testid="tier-badge"
          data-tier="trial"
          data-days-left={daysLeft}
        >
          {labelText}
        </span>
      );
    }

    // Urgent state (≤ 5 days): pill grows a CTA, links to /premium
    return (
      <Link
        href="/premium"
        style={{ textDecoration: "none" }}
        data-testid="tier-badge"
        data-tier="trial-urgent"
        data-days-left={daysLeft}
      >
        <span
          style={{
            ...chipBase,
            color: "#FAF6EE",
            border: `1px solid ${TWOW_GOLD_DEEP}`,
            background: TWOW_GOLD_DEEP,
            cursor: "pointer",
          }}
        >
          <span>{daysLeft === 0 ? "Trial ending today" : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`}</span>
          <span style={{ opacity: 0.85 }}>·</span>
          <span style={{ textTransform: "none", letterSpacing: "0.05em" }}>
            Continue with Premium →
          </span>
        </span>
      </Link>
    );
  }

  return null;
}
