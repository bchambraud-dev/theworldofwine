import { Switch, Route, Router, Link, useLocation } from "wouter";
// Using standard path routing (no hash)
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Component, type ReactNode, type ErrorInfo } from "react";

// Global error boundary — a crash in any component shows a recovery UI
// instead of a blank white screen.
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("App crash:", error, info.componentStack); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F4EF", padding: 32 }}>
          <div style={{ textAlign: "center", maxWidth: 380 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", color: "#1A1410", marginBottom: 12 }}>Something went wrong</div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "#5A5248", lineHeight: 1.6, marginBottom: 20 }}>
              The app ran into an error. A page refresh usually fixes it.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: "10px 24px", border: "none", borderRadius: 20, background: "#8C1C2E", color: "#F7F4EF", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", cursor: "pointer" }}
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
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
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Journal from "@/pages/Journal";
import Admin from "@/pages/Admin";
import VintageGuide from "@/pages/VintageGuide";
import SommyChat from "@/components/SommyChat";
import { AuthProvider, useAuth } from "@/lib/auth";
import { UserDataProvider } from "@/lib/useUserData";
import ProfilePanel from "@/components/ProfilePanel";
import JourneyLayout from "@/components/JourneyLayout";
import ProfilePage from "@/pages/ProfilePage";
import Cellar from "@/pages/Cellar";
import WishlistPage from "@/pages/Wishlist";

type NavTab = "map" | "academy" | "list" | "news" | "cellar" | "experiences" | "wishlist";

const navTabs: { key: NavTab; label: string; href: string }[] = [
  { key: "map", label: "MAP", href: "/explore" },
  { key: "academy", label: "GUIDES", href: "/guides" },
  { key: "list", label: "LIST", href: "/explore/list" },
  { key: "news", label: "NEWS", href: "/news" },
];

const personalTabs: { key: NavTab; label: string; href: string }[] = [
  { key: "cellar", label: "MY CELLAR", href: "/journey/cellar" },
  { key: "experiences", label: "MY EXPERIENCES", href: "/journey/journal" },
  { key: "wishlist", label: "MY WISHLIST", href: "/journey/wishlist" },
];

function getActiveTab(path: string): NavTab | null {
  if (path === "/explore/list") return "list";
  if (path.startsWith("/explore")) return "map";
  if (path.startsWith("/journey/cellar")) return "cellar";
  if (path.startsWith("/journey/journal")) return "experiences";
  if (path.startsWith("/journey/wishlist")) return "wishlist";
  if (path.startsWith("/journal")) return "experiences";
  if (path.startsWith("/guides") || path.startsWith("/quiz")) return "academy";
  if (path.startsWith("/news")) return "news";
  return null;
}

function NavBar() {
  const { user, profile, signOut } = useAuth();
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
          <Link href="/journey/journal?log=1" style={{ textDecoration: "none", marginRight: 4 }}>
            <button
              className="nav-btn"
              data-testid="nav-log-wine"
              style={{
                background: "#8C1C2E", color: "#F7F4EF",
                borderRadius: 20, padding: "6px 14px",
                fontFamily: "'Geist Mono', monospace", fontSize: "0.52rem",
                letterSpacing: "0.08em", border: "none", cursor: "pointer",
              }}
            >+ LOG A WINE</button>
          </Link>
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

          {/* Divider between main and personal tabs */}
          <div style={{ width: 1, height: 16, background: "#EDEAE3", margin: "0 6px", flexShrink: 0 }} />
          {personalTabs.map((tab) => (
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
              <Link href="/journey/profile" style={{ textDecoration: "none" }}>
              <button
                title="My profile"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6 }}
              >
                {(profile?.avatar_url || (user?.user_metadata?.avatar_url as string) || (user?.user_metadata?.picture as string)) ? (
                  <img src={profile?.avatar_url || (user?.user_metadata?.avatar_url as string) || (user?.user_metadata?.picture as string)} alt={profile?.display_name || ""} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--border-c, #D4D1CA)" }} />
                ) : (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#8C1C2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#F7F4EF", fontSize: "0.75rem", fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>
                    {(profile?.display_name || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
              </button>
              </Link>
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
          {/* LOG A WINE button */}
          <button
            className="mobile-menu-link"
            onClick={() => handleNavLink("/journey/journal?log=1")}
            data-testid="mobile-nav-log-wine"
            style={{
              background: "#8C1C2E", color: "#F7F4EF",
              borderRadius: 8, padding: "10px 16px", marginBottom: 8,
              fontFamily: "'Geist Mono', monospace", fontSize: "0.6rem",
              letterSpacing: "0.1em", border: "none", cursor: "pointer",
              textAlign: "center", width: "100%",
            }}
          >+ LOG A WINE</button>

          {/* Divider */}
          <div style={{ height: 1, background: "#EDEAE3", margin: "8px 0" }} />

          {/* Main nav tabs */}
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

          {/* Personal section */}
          <div style={{ height: 1, background: "#EDEAE3", margin: "8px 0" }} />
          {personalTabs.map((tab) => (
            <button
              key={tab.key}
              className={`mobile-menu-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => handleNavLink(tab.href)}
              data-testid={`mobile-nav-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
          {user && (
            <button
              className="mobile-menu-link"
              onClick={() => handleNavLink("/journey/profile")}
              data-testid="mobile-nav-profile"
            >
              MY PROFILE
            </button>
          )}

          {/* Auth */}
          <div style={{ height: 1, background: "#EDEAE3", margin: "8px 0" }} />
          {user ? (
            <button
              className="mobile-menu-link"
              onClick={async () => {
                await signOut();
                setMenuOpen(false);
              }}
              data-testid="mobile-nav-signout"
              style={{ color: "#5A5248" }}
            >
              Sign out
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
        </nav>
      </div>
    </>
  );
}

// Redirect helper for wouter
function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to, { replace: true }); }, [to, setLocation]);
  return null;
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
      {/* My Journey section — specific routes before the :id wildcard */}
      <Route path="/journey/profile">{() => <JourneyLayout><ProfilePage /></JourneyLayout>}</Route>
      <Route path="/journey/cellar">{() => <JourneyLayout><Cellar /></JourneyLayout>}</Route>
      <Route path="/journey/journal">{() => <JourneyLayout><Journal /></JourneyLayout>}</Route>
      <Route path="/journey/wishlist">{() => <JourneyLayout><WishlistPage /></JourneyLayout>}</Route>
      {/* Learning journey player (e.g. /journey/abc123) */}
      <Route path="/journey/:id" component={JourneyPlayer} />
      <Route path="/journey"><Redirect to="/journey/profile" /></Route>
      {/* Backward compat: /journal → /journey/journal */}
      <Route path="/journal"><Redirect to="/journey/journal" /></Route>
      <Route path="/guides" component={AcademyHub} />
      <Route path="/guides/grapes/:id" component={GrapeDetail} />
      <Route path="/guides/flavourmap/:view?" component={FlavourMap} />
      <Route path="/guides/vintages/:view?" component={VintageGuide} />
      <Route path="/guides/:guideId" component={GuideDetail} />
      <Route path="/quiz/:quizId" component={QuizPage} />
      <Route path="/news" component={News} />
      <Route path="/discover" component={DiscoverQuiz} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalFilterBar() {
  const [location] = useLocation();
  const store = useWineStore();

  // Only relevant on the map and wine list — hide everywhere else
  const showFilter = location.startsWith("/explore");
  if (!showFilter) return null;

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
  // Profile panel no longer used (profile is now a full page at /journey/profile)
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
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router>
          <UserDataProvider>
            <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }} data-testid="app-root">
              <NavBar />
              <GlobalFilterBar />
              <AppRouter />
              <SommyChat isOpen={sommyOpen} onToggle={toggleSommy} />
              {/* ProfilePanel kept as component file but no longer rendered here — profile is at /journey/profile */}
            </div>
          </UserDataProvider>
        </Router>
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
