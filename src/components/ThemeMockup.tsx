import React from 'react';
import type { Theme } from '../types';

/**
 * A miniature of the iRacingHub page used as the theme chooser's preview: header
 * with logo and search, the tab bar, and three race rows. Palettes mirror the
 * real CSS custom properties in `style.css` (`:root` and `:root[data-theme=light]`),
 * so each swatch actually looks like the site it selects.
 */

interface Palette {
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  dim: string;
  accent: string;
  tabNav: string;
  headerFrom: string;
  headerTo: string;
}

const PALETTES: Record<Theme, Palette> = {
  dark: {
    bg: '#0f1117', surface: '#1a1d27', surface2: '#232736', border: '#2d3148',
    text: '#e4e6f0', dim: '#8b8fa3', accent: '#3b82f6', tabNav: '#141720',
    headerFrom: '#1e2235', headerTo: '#0f1117',
  },
  light: {
    bg: '#d8dce9', surface: '#e4e7f2', surface2: '#cdd1e3', border: '#b0b5cc',
    text: '#1a1d2e', dim: '#6b7190', accent: '#2563eb', tabNav: '#cdd1e3',
    headerFrom: '#c8cee0', headerTo: '#d8dce9',
  },
};

/** Category badge hues are theme-independent in the real app. */
const CATEGORY_COLORS = ['#22c55e', '#a855f7', '#ef4444'];

interface ThemeMockupProps {
  variant: Theme;
}

export default function ThemeMockup({ variant }: ThemeMockupProps) {
  const p = PALETTES[variant];
  const clipId = `tm-clip-${variant}`;
  const gradId = `tm-hdr-${variant}`;

  return (
    <svg
      className="theme-mockup"
      viewBox="0 0 132 92"
      role="img"
      aria-label={`${variant === 'dark' ? 'Dark' : 'Light'} theme preview`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="132" height="92" rx="6" />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.55" y2="1">
          <stop offset="0%" stopColor={p.headerFrom} />
          <stop offset="100%" stopColor={p.headerTo} />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="132" height="92" fill={p.bg} />

        {/* Header: "iRacing Hub" wordmark, season lines, search box */}
        <rect x="0" y="0" width="132" height="27" fill={`url(#${gradId})`} />
        <rect x="8" y="7" width="17" height="5" rx="1.5" fill={p.accent} />
        <rect x="27" y="7" width="11" height="5" rx="1.5" fill={p.text} />
        <rect x="8" y="15" width="22" height="3" rx="1.5" fill={p.dim} />
        <rect x="8" y="20.5" width="15" height="2.5" rx="1.25" fill={p.dim} opacity="0.6" />
        <rect x="52" y="8.5" width="72" height="11" rx="5.5" fill={p.surface2} stroke={p.border} strokeWidth="0.8" />
        <circle cx="58.5" cy="14" r="2" fill="none" stroke={p.dim} strokeWidth="0.9" />
        <line x1="60" y1="15.5" x2="61.3" y2="16.8" stroke={p.dim} strokeWidth="0.9" strokeLinecap="round" />

        {/* Tab bar with the first tab active */}
        <rect x="0" y="27" width="132" height="11" fill={p.tabNav} />
        <rect x="8" y="31" width="16" height="3" rx="1.5" fill={p.accent} />
        <rect x="8" y="36.2" width="16" height="1.3" fill={p.accent} />
        {[30, 52, 74].map(x => (
          <rect key={x} x={x} y="31" width="14" height="3" rx="1.5" fill={p.dim} opacity="0.5" />
        ))}

        {/* Race rows: category badge, series name, track, laps + time chip, add button */}
        {[0, 1, 2].map(i => {
          const y = 43 + i * 16;
          return (
            <g key={i}>
              <rect x="8" y={y} width="116" height="14" rx="3" fill={p.surface} stroke={p.border} strokeWidth="0.8" />
              <rect x="12" y={y + 3} width="12" height="4.5" rx="1.5" fill={CATEGORY_COLORS[i]} opacity="0.85" />
              <rect x="27" y={y + 3} width="32" height="4.5" rx="1.5" fill={p.text} opacity="0.8" />
              <rect x="27" y={y + 9.5} width="22" height="3" rx="1.5" fill={p.dim} opacity="0.8" />
              <rect x="70" y={y + 4} width="9" height="4" rx="2" fill="#f59e0b" opacity="0.85" />
              <rect x="83" y={y + 4} width="21" height="4" rx="2" fill={p.dim} opacity="0.55" />
              <circle cx="114" cy={y + 7} r="4" fill={p.surface2} stroke={p.border} strokeWidth="0.8" />
              <line x1="111.8" y1={y + 7} x2="116.2" y2={y + 7} stroke={p.dim} strokeWidth="1" strokeLinecap="round" />
              <line x1="114" y1={y + 4.8} x2="114" y2={y + 9.2} stroke={p.dim} strokeWidth="1" strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      <rect x="0.5" y="0.5" width="131" height="91" rx="5.5" fill="none" stroke={p.border} strokeWidth="1" />
    </svg>
  );
}
