import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";

const tabs = [
  { key: "profile", label: "PROFILE", href: "/journey/profile" },
  { key: "cellar", label: "CELLAR", href: "/journey/cellar", icon: true },
  { key: "journal", label: "JOURNAL", href: "/journey/journal" },
  { key: "wishlist", label: "WISHLIST", href: "/journey/wishlist" },
];

function getActiveKey(path: string): string {
  if (path.startsWith("/journey/cellar")) return "cellar";
  if (path.startsWith("/journey/journal")) return "journal";
  if (path.startsWith("/journey/wishlist")) return "wishlist";
  return "profile";
}

const CellarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
    <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" />
    <path d="M8 22v-8a4 4 0 0 1 8 0v8" />
    <line x1="4" y1="22" x2="20" y2="22" />
  </svg>
);

export default function JourneyLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const activeKey = getActiveKey(location);

  return (
    <>
      <div style={{
        position: "sticky", top: 52, zIndex: 10,
        background: "#F7F4EF",
        borderBottom: "1.5px solid #EDEAE3",
        display: "flex", justifyContent: "center",
        padding: "0 12px",
      }}>
        <div style={{
          display: "flex", gap: 0,
          maxWidth: 560, width: "100%",
        }}>
          {tabs.map(tab => {
            const isActive = activeKey === tab.key;
            return (
              <Link key={tab.key} href={tab.href} style={{ textDecoration: "none", flex: 1 }}>
                <button style={{
                  width: "100%",
                  padding: "10px 8px",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Geist Mono', monospace", fontSize: "0.55rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: isActive ? "#8C1C2E" : "#D4D1CA",
                  borderBottom: isActive ? "2px solid #8C1C2E" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "color 0.15s, border-color 0.15s",
                }}>
                  {tab.icon && <CellarIcon />}
                  {tab.label}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </>
  );
}
