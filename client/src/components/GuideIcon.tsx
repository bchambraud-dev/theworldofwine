export default function GuideIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const s = { width: size, height: size, color: "var(--wine)" };
  const sw = "1.5";
  switch (icon) {
    case "terroir":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M8 8a4 4 0 0 1 8 0"/><circle cx="12" cy="5" r="2"/></svg>;
    case "tasting":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l-1 9a4 4 0 0 1-3 3.5A4 4 0 0 1 9 11L8 2z"/><line x1="12" y1="14.5" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg>;
    case "label":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
    case "scores":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "styles":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "pairing":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
    case "history":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "natural":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-4-4-8-7.5-8-12C4 5 8 2 12 2s8 3 8 8c0 4.5-4 8-8 12z"/><path d="M12 6v10"/><path d="M8 10c2 0 4 2 4 4"/></svg>;
    case "quiz":
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" style={s} fill="none" stroke="currentColor" strokeWidth={sw}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
