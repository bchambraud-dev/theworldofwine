import { Switch, Route, Router, Link, useLocation } from "wouter";
// Using standard path routing (no hash)
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useCallback, useEffect, useMemo } from "react";
import FilterBar from "@/components/FilterBar";
import { useWineStore } from "@/lib/store";

import Landing from "@/pages/Landing";
import Explore from "@/pages/Explore";
import News from "@/pages/News";
import JourneysBrowse from "@/pages/JourneysBrowse";
import JourneyPlayer from "@/pages/JourneyPlayer";
import AcademyHub from "@/pages/AcademyHub";
import GuideDetail from "@/pages/GuideDetail";
import GrapeDetail from "@/pages/GrapeDetail";
import QuizPage from "@/pages/QuizPage";
import NotFound from "@/pages/not-found";
import DiscoverQuiz from "@/pages/DiscoverQuiz";
import FlavourMap from "@/pages/FlavourMap";
import SignIn from "@/pages/SignIn";
import AuthCallback from "@/pages/AuthCallback";
import Onboarding from "@/pages/Onboarding";
import SommyChat from "@/components/SommyChat";
import { AuthProvider, useAuth } from "@/lib/auth";
import ProfilePanel from "@/components/ProfilePanel";

type NavTab = "map" | "journeys" | "academy" | "list" | "news";

const navTabs: { key: NavTab; label: string; href: string }[] = [
  { key: "map", label: "MAP", href: "/explore" },
  { key: "journeys", label: "JOURNEYS", href: "/journeys" },
  { key: "academy", label: "GUIDES", href: "/guides" },
  { key: "list", label: "LIST", href: "/explore/list" },
  { key: "news", label: "NEWS", href: "/news" },
];

function getActiveTab(path: string): NavTab | null {
  if (path === "/explore/list") return "list";
  if (path.startsWith("/explore")) return "map";
  if (path.startsWith("/journey")) return "journeys";
  if (path.startsWith("/journeys")) return "journeys";
  if (path.startsWith("/guides") || path.startsWith("/quiz")) return "academy";
  if (path.startsWith("/news")) return "news";
  return null;
}

function NavBar({ onProfileOpen }: { onProfileOpen: () => void }) {
  const { user, profile } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeTab = getActiveTab(location);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Search navigates to explore if not already there
    if (!location.startsWith("/explore")) {
      setLocation("/explore");
    }
  }, [location, setLocation]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavLink = (href: string) => {
    setLocation(href);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="topbar" data-testid="topbar">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg
            viewBox="0 0 80 100"
            style={{ width: 22, height: 28, color: "var(--wine)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-label="The World of Wine"
          >
            <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
            <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
            <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
            <path d="M40 46 C40 46, 30 56, 30 64" strokeWidth="1" opacity="0.25" />
            <path d="M40 46 C40 46, 50 56, 50 64" strokeWidth="1" opacity="0.25" />
          </svg>
          <span className="logo-text"><span style={{ color: 'var(--text)' }}>The World of </span><span style={{ color: 'var(--wine)' }}>Wine</span></span>
        </Link>

        <div className="topbar-divider desktop-only" />

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input
            type="text"
            placeholder="Search regions, producers..."
            value={searchQuery}
            onChange={handleSearch}
            data-testid="search-input"
          />
        </div>

        {/* Desktop nav tabs */}
        <div className="nav-tabs-desktop" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {navTabs.map((tab) => (
            <Link key={tab.key} href={tab.href} style={{ textDecoration: "none" }}>
              <button
                className={`nav-btn ${activeTab === tab.key ? "active" : ""}`}
                data-testid={`nav-${tab.key}`}
              >
                {tab.label}
              </button>
            </Link>
          ))}

          {/* User avatar / sign in */}
          {user ? (
            <div style={{ position: "relative", marginLeft: 4 }}>
              <button
                onClick={onProfileOpen}
                title="Your journey"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name || ""} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border-c, #D4D1CA)" }} />
                ) : (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#8C1C2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#F7F4EF", fontSize: "0.75rem", fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>
                    {(profile?.display_name || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
              </button>
            </div>
          ) : (
            <Link href="/sign-in" style={{ textDecoration: "none", marginLeft: 4 }}>
              <button className="nav-btn" data-testid="nav-sign-in" style={{ color: "var(--wine, #8C1C2E)", fontWeight: 500 }}>
                SIGN IN
              </button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          data-testid="hamburger-btn"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`mobile-menu-panel ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        data-testid="mobile-menu"
      >
        {/* Close button */}
        <button
          className="mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo centered at top */}
        <div className="mobile-menu-logo">
          <svg
            viewBox="0 0 80 100"
            style={{ width: 36, height: 46, color: "var(--wine)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M40 8 C40 8, 12 48, 12 64 C12 80.6 24.5 92 40 92 C55.5 92 68 80.6 68 64 C68 48 40 8 40 8Z" />
            <ellipse cx="40" cy="64" rx="18" ry="18" strokeWidth="1.2" opacity="0.35" />
            <path d="M22 64 L58 64" strokeWidth="1" opacity="0.25" />
            <path d="M40 46 C40 46, 30 56, 30 64" strokeWidth="1" opacity="0.25" />
            <path d="M40 46 C40 46, 50 56, 50 64" strokeWidth="1" opacity="0.25" />
          </svg>
          <span className="logo-text" style={{ fontSize: "1.1rem" }}>
            <span style={{ color: 'var(--text)' }}>The World of </span>
            <span style={{ color: 'var(--wine)' }}>Wine</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="mobile-menu-nav">
          {navTabs.map((tab) => (
            <button
              key={tab.key}
              className={`mobile-menu-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => handleNavLink(tab.href)}
              data-testid={`mobile-nav-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}

          {/* Auth */}
          <div style={{ borderTop: "1px solid var(--border-c, #D4D1CA)", marginTop: 8, paddingTop: 8 }}>
            {user ? (
              <button
                className="mobile-menu-link"
                onClick={() => { setMenuOpen(false); onProfileOpen(); }}
                data-testid="mobile-nav-profile"
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#8C1C2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#F7F4EF", fontSize: "0.6rem", fontWeight: 500 }}>
                    {(profile?.display_name || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
                MY JOURNEY
              </button>
            ) : (
              <button
                className="mobile-menu-link"
                onClick={() => handleNavLink("/sign-in")}
                data-testid="mobile-nav-sign-in"
                style={{ color: "var(--wine, #8C1C2E)", fontWeight: 500 }}
              >
                SIGN IN
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/explore/region/:regionId" component={Explore} />
      <Route path="/explore/producer/:producerId" component={Explore} />
      <Route path="/news/:newsId" component={News} />
      <Route path="/explore" component={Explore} />
      <Route path="/explore/list" component={Explore} />
      <Route path="/journeys" component={JourneysBrowse} />
      <Route path="/journey/:id" component={JourneyPlayer} />
      <Route path="/guides" component={AcademyHub} />
      <Route path="/guides/grapes/:id" component={GrapeDetail} />
      <Route path="/guides/:guideId" component={GuideDetail} />
      <Route path="/quiz/:quizId" component={QuizPage} />
      <Route path="/news" component={News} />
      <Route path="/discover" component={DiscoverQuiz} />
      <Route path="/flavour-map" component={FlavourMap} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/onboarding" component={Onboarding} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalFilterBar() {
  const [location] = useLocation();
  const store = useWineStore();

  // Hide on landing, journey player, guide detail, grape detail, quiz
  const hideOn = location === "/" || location.startsWith("/journey/") ||
    (location.startsWith("/guides/") && location !== "/guides") ||
    location.startsWith("/quiz/");

  if (hideOn) return null;

  return (
    <FilterBar
      filters={store.filters}
      onUpdateFilter={store.updateFilter}
      onSetFilters={store.setFilters}
      onReset={store.resetFilters}
    />
  );
}

function App() {
  const [sommyOpen, setSommyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const toggleSommy = useCallback(() => setSommyOpen(o => !o), []);

  // Auto-open Sommy after onboarding
  useEffect(() => {
    if (window.location.search.includes("welcome=1")) {
      setTimeout(() => setSommyOpen(true), 800);
      // Clean up the URL without a reload
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router>
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }} data-testid="app-root">
            <NavBar onProfileOpen={() => setProfileOpen(true)} />
            <GlobalFilterBar />
            <AppRouter />
            <SommyChat isOpen={sommyOpen} onToggle={toggleSommy} />
            <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
          </div>
        </Router>
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
