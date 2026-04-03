export default function JourneyIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  const s = { width: size, height: size, color: 'rgba(255,255,255,0.9)' };
  const sw = "1.5";
  switch (icon) {
    case "grapes":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="2.5"/><circle cx="8" cy="13" r="2.5"/><circle cx="16" cy="13" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M12 2v3.5" strokeWidth="1.2"/><path d="M14 3c-1 1-2 1-2 1" strokeWidth="1"/></svg>;
    case "globe":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
    case "france":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>;
    case "italy":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/></svg>;
    case "leaf":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-4-4-8-7.5-8-12C4 5 8 2 12 2s8 3 8 8c0 4.5-4 8-8 12z"/><path d="M12 6v10"/><path d="M8 10c2 0 4 2 4 4"/><path d="M16 10c-2 0-4 2-4 4"/></svg>;
    case "sparkle":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>;
    case "glass":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l-1 9a4 4 0 0 1-3 3.5A4 4 0 0 1 9 11L8 2z"/><line x1="12" y1="14.5" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg>;
    case "gem":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 12 22 2 8.5"/><polyline points="2 8.5 12 12 22 8.5"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
    case "drop":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C12 2 6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12z"/></svg>;
    case "earth":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10"/><path d="M12 2a15 15 0 0 0-4 10 15 15 0 0 0 4 10"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
