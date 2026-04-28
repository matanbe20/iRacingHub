import React from 'react';

function OvalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 5c-3.314 0-6 2.686-6 6v2c0 3.314 2.686 6 6 6h10c3.314 0 6-2.686 6-6v-2c0-3.314-2.686-6-6-6H7zm0 3c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3h10c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H7z" />
    </svg>
  );
}

function SportsCarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

function FormulaCarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <rect x="10" y="2" width="4" height="20" rx="2" />
      <rect x="4" y="4" width="16" height="3" rx="1.5" />
      <rect x="5" y="17" width="14" height="3" rx="1.5" />
      <rect x="2.5" y="6" width="3.5" height="6" rx="1.75" />
      <rect x="18" y="6" width="3.5" height="6" rx="1.75" />
      <rect x="2.5" y="13" width="3.5" height="5" rx="1.75" />
      <rect x="18" y="13" width="3.5" height="5" rx="1.75" />
    </svg>
  );
}

function DirtOvalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 5c-3.314 0-6 2.686-6 6v2c0 3.314 2.686 6 6 6h10c3.314 0 6-2.686 6-6v-2c0-3.314-2.686-6-6-6H7zm0 3c-1.657 0-3 1.343-3 3v2c0 1.657 1.343 3 3 3h10c1.657 0 3-1.343 3-3v-2c0-1.657-1.343-3-3-3H7z" />
      <circle cx="9" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="15" cy="12" r="1.2" />
    </svg>
  );
}

function DirtRoadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M4 21C6 17 9 15 12 13C15 11 18 9 20 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="16.5" cy="10" r="1.5" />
    </svg>
  );
}

const ICONS: Record<string, () => React.ReactElement> = {
  'OVAL': OvalIcon,
  'SPORTS CAR': SportsCarIcon,
  'FORMULA CAR': FormulaCarIcon,
  'DIRT OVAL': DirtOvalIcon,
  'DIRT ROAD': DirtRoadIcon,
};

export default function CategoryIcon({ category }: { category: string }) {
  const Icon = ICONS[category];
  return Icon ? <Icon /> : null;
}
