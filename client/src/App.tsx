import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useCallback } from "react";
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

type NavTab = "map" | "journeys" | "academy" | "list" | "news";

const navTabs: { key: NavTab; label: string; href: string }[] = [
  { key: "map", label: "MAP", href: "/explore" },
  { key: "journeys", label: "JOURNEYS", href: "/journeys" },
  { key: "academy", label: "GUIDES", href: "/academy" },
  { key: "list", label: "LIST", href: "/explore/list" },
  { key: "news", label: "NEWS", href: "/news" },
];

function getActiveTab(path: string): NavTab | null {
  if (path === "/explore/list") return "list";
  if (path.startsWith("/explore")) return "map";
  if (path.startsWith("/journey")) return "journeys";
  if (path.startsWith("/journeys")) return "journeys";
  if (path.startsWith("/academy") || path.startsWith("/quiz")) return "academy";
  if (path.startsWith("/news")) return "news";
  return null;
}

function NavBar() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const activeTab = getActiveTab(location);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Search navigates to explore if not already there
    if (!location.startsWith("/explore")) {
      setLocation("/explore");
    }
  }, [location, setLocation]);

  return (
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

      {/* Nav tabs */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
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
      </div>
    </header>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/explore" component={Explore} />
      <Route path="/explore/list" component={Explore} />
      <Route path="/journeys" component={JourneysBrowse} />
      <Route path="/journey/:id" component={JourneyPlayer} />
      <Route path="/academy" component={AcademyHub} />
      <Route path="/academy/grapes/:id" component={GrapeDetail} />
      <Route path="/academy/:guideId" component={GuideDetail} />
      <Route path="/quiz/:quizId" component={QuizPage} />
      <Route path="/news" component={News} />
      <Route path="/discover" component={DiscoverQuiz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalFilterBar() {
  const [location] = useLocation();
  const store = useWineStore();

  // Hide on landing, journey player, guide detail, grape detail, quiz
  const hideOn = location === "/" || location.startsWith("/journey/") ||
    (location.startsWith("/academy/") && location !== "/academy") ||
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={useHashLocation}>
          <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }} data-testid="app-root">
            <NavBar />
            <GlobalFilterBar />
            <AppRouter />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
