// Small set of SVG icons used across the UI. Inline SVG keeps site self-contained.
export const ICONS = {
  logo: `<svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="flixoraLogoPrime" x1="0" y1="0" x2="100" y2="100">
        <stop stop-color="#FAD961"/>
        <stop offset="0.45" stop-color="#F76B1C"/>
        <stop offset="1" stop-color="#A855F7"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill="#0D0D14"/>
    <rect x="10" y="10" width="80" height="80" rx="22" fill="url(#flixoraLogoPrime)" opacity="0.96"/>
    <path d="M32 28h14v42h18v10H32V28zm23 0h14v62H55V28z" fill="#05070C"/>
    <path d="M54 58l18-12v13l-18 12V58z" fill="#F7F7F9" opacity="0.96"/>
  </svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  play: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`
};

export function icon(name){
  return ICONS[name] || '';
}
