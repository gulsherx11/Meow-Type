export function CatLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <polygon points="4,12 4,2 9,7" fill="#f472b6"/>
      <polygon points="24,12 24,2 19,7" fill="#f472b6"/>
      <rect x="4" y="10" width="20" height="14" rx="5" fill="#f472b6"/>
      <circle cx="10" cy="16" r="2" fill="#0e0617"/>
      <circle cx="18" cy="16" r="2" fill="#0e0617"/>
      <circle cx="10.8" cy="15.2" r="0.7" fill="#fff"/>
      <circle cx="18.8" cy="15.2" r="0.7" fill="#fff"/>
      <path d="M12 20 Q14 22 16 20" stroke="#0e0617" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <line x1="6" y1="17" x2="1" y2="16" stroke="#c4b5fd" strokeWidth="0.8"/>
      <line x1="6" y1="18" x2="1" y2="19" stroke="#c4b5fd" strokeWidth="0.8"/>
      <line x1="22" y1="17" x2="27" y2="16" stroke="#c4b5fd" strokeWidth="0.8"/>
      <line x1="22" y1="18" x2="27" y2="19" stroke="#c4b5fd" strokeWidth="0.8"/>
    </svg>
  );
}

export function CatHero({ size = 64 }) {
  return (
    <svg className="hero-cat" width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="10,28 10,6 22,18" fill="#f472b6"/>
      <polygon points="54,28 54,6 42,18" fill="#f472b6"/>
      <rect x="8" y="22" width="48" height="34" rx="12" fill="#f472b6"/>
      <circle cx="23" cy="38" r="5" fill="#0e0617"/>
      <circle cx="41" cy="38" r="5" fill="#0e0617"/>
      <circle cx="25" cy="36" r="1.8" fill="#fff"/>
      <circle cx="43" cy="36" r="1.8" fill="#fff"/>
      <path d="M27 48 Q32 52 37 48" stroke="#0e0617" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="14" y1="39" x2="2" y2="37" stroke="#c4b5fd" strokeWidth="1.2"/>
      <line x1="14" y1="42" x2="2" y2="44" stroke="#c4b5fd" strokeWidth="1.2"/>
      <line x1="50" y1="39" x2="62" y2="37" stroke="#c4b5fd" strokeWidth="1.2"/>
      <line x1="50" y1="42" x2="62" y2="44" stroke="#c4b5fd" strokeWidth="1.2"/>
    </svg>
  );
}

export function CatResult({ size = 56 }) {
  return (
    <svg className="result-cat" width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="10,28 10,6 22,18" fill="#f472b6"/>
      <polygon points="54,28 54,6 42,18" fill="#f472b6"/>
      <rect x="8" y="22" width="48" height="34" rx="12" fill="#f472b6"/>
      <circle cx="23" cy="38" r="5" fill="#0e0617"/>
      <circle cx="41" cy="38" r="5" fill="#0e0617"/>
      <circle cx="25" cy="36" r="1.8" fill="#fff"/>
      <circle cx="43" cy="36" r="1.8" fill="#fff"/>
      <path d="M20 46 Q32 54 44 46" stroke="#0e0617" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="14" y1="39" x2="2" y2="37" stroke="#c4b5fd" strokeWidth="1.2"/>
      <line x1="14" y1="42" x2="2" y2="44" stroke="#c4b5fd" strokeWidth="1.2"/>
      <line x1="50" y1="39" x2="62" y2="37" stroke="#c4b5fd" strokeWidth="1.2"/>
      <line x1="50" y1="42" x2="62" y2="44" stroke="#c4b5fd" strokeWidth="1.2"/>
    </svg>
  );
}