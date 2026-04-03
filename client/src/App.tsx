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

type NavTab = "map" | "journeys" | "academy" | "list" | "news";

const navTabs: { key: NavTab; label: string; href: string }[] = [
  { key: "map", label: "MAP", href: "/explore" },
  { key: "journeys", label: "JOURNEYS", href: "/journeys" },
  { key: "academy", label: "ACADEMY", href: "/academy" },
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
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
        <svg
          viewBox="0 0 32 32"
          style={{ width: 24, height: 24, color: "var(--wine)" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-label="The World of Wine"
        >
          <path d="M16 3C16 3 8 10 8 17a8 8 0 0 0 16 0c0-7-8-14-8-14Z" />
          <path d="M12 17a4 4 0 0 0 8 0" strokeWidth="1" opacity="0.5" />
          <line x1="16" y1="25" x2="16" y2="30" />
          <line x1="12" y1="30" x2="20" y2="30" />
        </svg>
        <span className="logo-text">The World of Wine</span>
      </Link>

      <div className="topbar-divider desktop-only" />

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
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
