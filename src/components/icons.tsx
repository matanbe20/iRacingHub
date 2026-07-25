/**
 * Every inline SVG used in more than one place. Each icon takes its size from the
 * call site's `size` prop and paints with `currentColor`, so a badge, a button and
 * a card row can share one glyph without copies drifting apart.
 */

interface IconProps {
  /** Width and height in px. Icons are square unless noted. */
  size?: number;
  className?: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IconCar = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size * 0.875} viewBox="0 0 18 14" className={className} {...stroke}>
    <path d="M3.5 7L5.5 2h7l2 5" />
    <rect x="1" y="7" width="16" height="4" rx="1.5" />
    <circle cx="4.5" cy="12" r="1.5" />
    <circle cx="13.5" cy="12" r="1.5" />
  </svg>
);

export const IconTrack = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size * 0.875} viewBox="0 0 18 14" className={className} {...stroke}>
    <ellipse cx="9" cy="7" rx="7.5" ry="5" />
    <ellipse cx="9" cy="7" rx="4" ry="2.2" />
  </svg>
);

export const IconGrid = ({ size = 15, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} {...stroke}>
    <rect x="1" y="1" width="6" height="6" rx="1.2" />
    <rect x="9" y="1" width="6" height="6" rx="1.2" />
    <rect x="1" y="9" width="6" height="6" rx="1.2" />
    <rect x="9" y="9" width="6" height="6" rx="1.2" />
  </svg>
);

export const IconList = ({ size = 15, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="currentColor" className={className}>
    <rect x="1" y="2" width="13" height="2" rx="1" />
    <rect x="1" y="6.5" width="13" height="2" rx="1" />
    <rect x="1" y="11" width="13" height="2" rx="1" />
  </svg>
);

export const IconCalendar = ({ size = 15, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} {...stroke}>
    <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
    <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" />
    <line x1="5" y1="1" x2="5" y2="4" />
    <line x1="11" y1="1" x2="11" y2="4" />
    <line x1="4.5" y1="10" x2="7.5" y2="10" />
  </svg>
);

export const IconBookmark = ({ size = 15, className }: IconProps) => (
  <svg width={size * 0.933} height={size} viewBox="0 0 14 16" className={className} {...stroke}>
    <path d="M2 1.5h10a.5.5 0 0 1 .5.5v12l-5.5-3.5L1.5 14V2a.5.5 0 0 1 .5-.5z" />
  </svg>
);

export const IconTrophy = ({ size = 15, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className} {...stroke}>
    <path d="M5 1h6v5.5A3 3 0 0 1 8 9.5a3 3 0 0 1-3-3V1z" />
    <path d="M5 3.5H2.5A1.5 1.5 0 0 0 1 5a2.5 2.5 0 0 0 2.5 2.5H5" />
    <path d="M11 3.5h2.5A1.5 1.5 0 0 1 15 5a2.5 2.5 0 0 1-2.5 2.5H11" />
    <line x1="8" y1="9.5" x2="8" y2="12" />
    <path d="M5 15h6" />
    <line x1="8" y1="12" x2="8" y2="15" />
  </svg>
);

export const IconCart = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size * 0.94} viewBox="0 0 17 16" className={className} {...stroke}>
    <path d="M1 1h2.5l1.8 8h7.4l1.8-5.5H5" />
    <circle cx="7" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconGear = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/** The sidebar's "Manage garage" glyph: a flat outline building with a roll-up door. */
export const IconGarageOutline = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2}>
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="M16 8h5l2 4v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

/** Full-colour garage used inside the race-cost popover, where it reads as an action. */
export const IconGarageSolid = ({ className }: { className?: string }) => (
  <svg width="15" height="14" viewBox="0 0 16 15" className={className}>
    <polygon points="0,7.5 8,1 16,7.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" strokeLinejoin="round" />
    <rect x="2" y="7" width="12" height="7" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
    <rect x="6.2" y="9.5" width="3.6" height="4.5" fill="#92400e" />
  </svg>
);

/** Full-colour coin, the popover's "add to Buy Guide" action. */
export const IconMoney = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" className={className}>
    <circle cx="8" cy="8" r="6.5" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
    <text x="8" y="11.2" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#f0fdf4" fontFamily="Arial, sans-serif">$</text>
  </svg>
);

export const IconRainDrop = ({ size = 9, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.5 9.5 4 13.5 4 17a8 8 0 0 0 16 0c0-3.5-2.5-7.5-8-15z" />
  </svg>
);

export const IconClock = ({ size = 9, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2.5}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const IconShare = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2}>
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const IconDownload = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const IconCalendarExport = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const IconPdf = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const IconSearch = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
    <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconDiscord = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size * 0.758} viewBox="0 0 127.14 96.36" fill="currentColor" className={className}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
  </svg>
);

export const IconYouTube = ({ size = 13, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.5 6.2s-.2-1.6-1-2.3c-.9-1-1.9-1-2.4-1C17.2 2.7 12 2.7 12 2.7s-5.2 0-8.1.2c-.5.1-1.5.1-2.4 1-.7.7-1 2.3-1 2.3S.3 8 .3 9.8v1.7c0 1.8.2 3.6.2 3.6s.2 1.6 1 2.3c.9 1 2.1.9 2.6 1C5.8 18.6 12 18.6 12 18.6s5.2 0 8.1-.2c.5-.1 1.5-.1 2.4-1 .7-.7 1-2.3 1-2.3s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.7 14.5V7.9l6.6 3.3-6.6 3.3z" />
  </svg>
);

export const IconTwitch = ({ size = 13, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);
