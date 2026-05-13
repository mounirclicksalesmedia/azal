// Inline SVGs reused across Arsh. All accept a className for sizing/colour.

export function ArrowOut({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowLeft({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  villa: (
    <path
      d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  office: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  area: (
    <path d="M4 4h16v16H4z M4 12h16M12 4v16" stroke="currentColor" strokeWidth="1.6" />
  ),
  green: (
    <path
      d="M12 22V12M12 12c0-4 3-8 8-8 0 5-3 8-8 8zM12 12c0-3-2-7-7-7 0 4 2 7 7 7z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  fb: (
    <path
      d="M7 3v8a3 3 0 006 0V3M10 3v18M17 3c2 3 2 6 0 8v10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  lounge: (
    <path
      d="M3 13v6h18v-6M5 13V9a3 3 0 013-3h8a3 3 0 013 3v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  parking: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 17V7h3.5a3 3 0 010 6H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  access: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s-7-7.5-7-13a7 7 0 1114 0c0 5.5-7 13-7 13z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;

export function FeatureIcon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {ICONS[name]}
    </svg>
  );
}
