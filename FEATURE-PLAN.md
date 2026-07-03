# iRacingHub — Enhancement Plan (3 non-cluttering features)

> Self-contained implementation doc. A later session can execute this without
> re-exploring the codebase. All file paths are repo-relative to
> `C:\workspace\iRacing-Schedule`.

## Context / Goal

iRacingHub is a mature React 18 + TypeScript + Vite PWA (Zustand store) for planning an
iRacing season (currently 2026 Season 3). It already has filtering, a garage/ownership
system, favorites, a Buy Guide with real bulk-discount pricing, and exports. These three
enhancements **add value without adding UI weight**, and reuse existing data/logic. No
new dependencies, no store/type/data-model changes.

Build/verify commands: `npm run typecheck`, `npm run dev`, `npm run build`.

Key existing facts to rely on:
- Search input has `id="search"` (`src/components/SearchBox.tsx`).
- Tab display order in `src/components/TabNav.tsx`: **All Series, By Week, My Schedule,
  Buy Guide, Special Events** → `Tab` values `'all' | 'week' | 'my' | 'buy' | 'events'`.
- Store actions available: `setActiveTab(tab)`, `selectedWeek`, `setSelectedWeek(n)`,
  `toggleTheme()`, `closeDrawer()`, `ownedCars: Set<string>`, `ownedTracks: Set<string>`,
  `mySchedule: Record<string, RaceEntry>` (`src/store/useStore.ts`).
- `baseTrackName(track)` strips the ` - Config` suffix (`src/utils/helpers.ts`).
- Ownership sets store **base track names** and **car names** as used across the app.
- `RaceEntry` fields: `id, rawName, weekNum, displayName, category, cls, cars, track,
  date, laps, rain?, frequency` (`src/types.ts`). `mySchedule` id = `rawName + '_' + weekNum`.

---

## Groundwork: extract shared pricing helpers → `src/utils/pricing.ts` (NEW)

These currently live *inside* `src/components/BuyGuidePanel.tsx` (lines ~44–57) and must
be shared. Create `src/utils/pricing.ts`:

```ts
import { TRACK_SKUS, CAR_SKUS } from '../data/iracing-skus';
import { baseTrackName } from './helpers';
import type { Series, Week } from '../types';

export const FALLBACK_PRICE = 11.95;

export function getTrackPrice(name: string): number {
  return TRACK_SKUS[name]?.price ?? FALLBACK_PRICE;
}
export function getCarPrice(name: string): number {
  return CAR_SKUS[name]?.price ?? FALLBACK_PRICE;
}
export function getTrackSku(name: string): number | null {
  return TRACK_SKUS[name]?.sku ?? null;
}
export function getCarSku(name: string): number | null {
  return CAR_SKUS[name]?.sku ?? null;
}

/** Eligible, purchasable car names from a comma-separated cars string.
 *  Mirrors buildCarList() filtering in BuyGuidePanel (drops "See race…" placeholders). */
export function parseCars(cars: string): string[] {
  return cars.split(',').map(c => c.trim()).filter(n => n && !n.startsWith('See race'));
}

export interface RaceReadiness {
  /** true only when garage is populated AND track+car are both satisfied */
  ready: boolean;
  /** garage empty → neutral (don't show cost spam to first-time visitors) */
  neutral: boolean;
  needsTrack: boolean;
  needsCar: boolean;
  unlockCost: number; // raw sum of missing track + cheapest missing car; no bulk discount
}

export function getRaceReadiness(
  carsString: string,
  track: string,
  ownedCars: Set<string>,
  ownedTracks: Set<string>,
): RaceReadiness {
  const garagePopulated = ownedCars.size > 0 || ownedTracks.size > 0;
  const baseTrack = baseTrackName(track);
  const eligibleCars = parseCars(carsString);

  const needsTrack = !ownedTracks.has(baseTrack);
  const needsCar = eligibleCars.length > 0 && !eligibleCars.some(c => ownedCars.has(c));

  let unlockCost = 0;
  if (needsTrack) unlockCost += getTrackPrice(baseTrack);
  if (needsCar) {
    unlockCost += Math.min(...eligibleCars.map(getCarPrice));
  }

  return {
    neutral: !garagePopulated,
    ready: garagePopulated && !needsTrack && !needsCar,
    needsTrack,
    needsCar,
    unlockCost,
  };
}
```

Then edit **`src/components/BuyGuidePanel.tsx`**: delete the local `FALLBACK_PRICE`,
`getTrackPrice`, `getCarPrice`, `getTrackSku`, `getCarSku` definitions and import them
from `../utils/pricing` instead. Everything else in BuyGuidePanel stays the same.

---

## Feature 1: Unified "Ready to race" badge

The app currently scatters `✓ Car` / `✓ Track` / `Owned` badges the user must mentally
combine. Replace them **per race** with one signal:
- `ready` → **`✓ Ready`** (green, reuse existing owned-badge color).
- not ready & not neutral → **`$X`** amber pill, `title` = what's missing
  (e.g. `"Need track + car"`, `"Need track"`, `"Need car"`).
- `neutral` (empty garage) → render **nothing** (avoid cost spam for new visitors).

Small shared presentational component is optional; inline JSX is fine. Suggested markup:
```tsx
// ready:
<span className="race-ready-badge" title="You own the track and an eligible car">✓ Ready</span>
// needs unlock:
<span className="race-cost-badge" title={missingLabel}>${r.unlockCost.toFixed(2)}</span>
```

Apply to the three **per-race** cards (NOT `SeriesCard` — its header is series-level and
the track varies per week, so keep its existing `✓ Car` badge as-is):

### `src/components/WeekCell.tsx`
Currently shows only a track `Owned` badge (line ~43). Replace the `{isOwned && ...}`
badge with readiness computed from `series.cars` + `week.track`. Add `ownedCars` to the
store selectors (only `ownedTracks` is read today):
```tsx
const ownedCars = useStore(s => s.ownedCars);
const r = getRaceReadiness(series.cars, week.track, ownedCars, ownedTracks);
```
Render the unified badge in the `.week-track` area (where the `Owned` badge was).

### `src/components/TwCard.tsx`
Remove the fragmented pieces:
- inline `{trackOwned && <span className="track-owned-badge">Owned</span>}` (line ~45),
- the top-right `{carOwned && <span className="car-owned-badge">✓ Car</span>}` (line ~52),
- the whole `{(trackOwned || carOwned) && <div className="tw-card-owned-row">…</div>}`
  block (lines ~71–76).
Replace with a single unified badge (compute `getRaceReadiness(series.cars, week.track,
ownedCars, ownedTracks)`; both `ownedCars`/`ownedTracks` are already selected). Place it
where the `.tw-card-owned-row` was, or inline in `.tw-card-meta`.

### `src/components/MyRaceCard.tsx`
Currently only shows a track `Owned` badge (line ~41). Add `ownedCars` selector, then:
```tsx
// prefer full car list from source series; fall back to the flattened entry.cars
const series = SCHEDULE_DATA.find(s => s.name === entry.rawName); // already imported
const carsString = series?.cars ?? entry.cars;
const r = getRaceReadiness(carsString, entry.track, ownedCars, ownedTracks);
```
Replace the `Owned` track badge with the unified badge in `.my-race-meta`.

### Styling — `src/style.css`
Add near the existing `.track-owned-badge` / `.car-owned-badge` rules (search for them to
match tone/size exactly):
```css
.race-ready-badge { /* copy visual style of .car-owned-badge (green) */ }
.race-cost-badge  { /* amber/muted pill, same font-size/padding as owned badges */ }
```
Keep padding/font-size identical to the badges being replaced so row density is unchanged
(net: fewer badges than today).

---

## Feature 2: My Schedule summary bar

Edit **`src/components/MySchedulePanel.tsx`**. Today `.my-schedule-header` holds only the
"N races saved" `.count-label` + `<ExportButtons />` (lines ~50–53). Add a compact stats
line below the count label.

Compute from `entries` (already the sorted array of `RaceEntry`):
```tsx
const weeks = new Set(entries.map(e => e.weekNum)).size;
const tracks = new Set(entries.map(e => baseTrackName(e.track))).size; // import baseTrackName

// cost to complete — mirror BuyGuidePanel's smart-select exactly:
const schedTracks = new Set(entries.map(e => baseTrackName(e.track)));
const schedCars = new Set<string>();
entries.forEach(e => parseCars(e.cars).forEach(c => schedCars.add(c)));
const missingTrackPrices = [...schedTracks].filter(t => !ownedTracks.has(t)).map(getTrackPrice);
const missingCarPrices   = [...schedCars].filter(c => !ownedCars.has(c)).map(getCarPrice);
const cost = calcTotal([...missingTrackPrices, ...missingCarPrices]); // from ../data/iracing-prices
```
Add store selectors: `ownedCars`, `ownedTracks`, `setActiveTab`.

Render:
```tsx
<div className="my-schedule-summary">
  <span>{entries.length} races · {weeks} weeks · {tracks} tracks</span>
  {cost.count === 0
    ? <span className="mss-complete">✓ You own everything</span>
    : <button className="mss-cost" onClick={() => setActiveTab('buy')}
        title="Open Buy Guide (use ⚡ My Schedule to select these)">
        ${cost.total.toFixed(2)} to complete
      </button>}
</div>
```
The Buy Guide's existing `⚡ My Schedule` smart-select already picks exactly these items,
so the button just needs `setActiveTab('buy')`. Using `calcTotal` makes the number match
what the Buy Guide will charge (with bulk discount).

Add `.my-schedule-summary`, `.mss-cost`, `.mss-complete` to `src/style.css`. One line;
wraps under the count on mobile.

> Note: deliberately NOT adding an "estimated total time" stat — `laps` mixes
> `"40 mins"` and `"35 laps"`, and laps→time can't be converted reliably.

---

## Feature 3: Keyboard shortcuts

Create **`src/components/KeyboardShortcuts.tsx`**, mount once in `src/App.tsx` next to
`<Toast />`. Attaches a `keydown` listener + renders a help overlay (local `useState`,
no store changes).

Bindings:
| Key | Action |
|-----|--------|
| `/` | focus `document.getElementById('search')`, `preventDefault()` |
| `1`–`5` | `setActiveTab('all'|'week'|'my'|'buy'|'events')` (tab display order) |
| `←` / `→` | only if `activeTab === 'week'`: `setSelectedWeek(clamp(selectedWeek ± 1, 1, 12))` |
| `t` | `toggleTheme()` |
| `?` (Shift+/) | toggle shortcuts overlay |
| `Esc` | close overlay; also `closeDrawer()` |

Guards (critical): inside the handler, if `e.ctrlKey || e.metaKey || e.altKey` → ignore
(except leave browser defaults alone). If the event target is an `INPUT`, `TEXTAREA`,
`SELECT`, or `isContentEditable` → ignore everything **except** `Escape`. This ensures
typing in the search/filter boxes is never hijacked. `/` should focus search only when
not already in an input.

Sketch:
```tsx
import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

export default function KeyboardShortcuts() {
  const setActiveTab = useStore(s => s.setActiveTab);
  const activeTab = useStore(s => s.activeTab);
  const selectedWeek = useStore(s => s.selectedWeek);
  const setSelectedWeek = useStore(s => s.setSelectedWeek);
  const toggleTheme = useStore(s => s.toggleTheme);
  const closeDrawer = useStore(s => s.closeDrawer);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
        || el.tagName === 'SELECT' || el.isContentEditable);

      if (e.key === 'Escape') { setHelpOpen(false); closeDrawer(); return; }
      if (typing) return;

      const tabs = ['all','week','my','buy','events'] as const;
      switch (e.key) {
        case '/': e.preventDefault(); document.getElementById('search')?.focus(); break;
        case '1': case '2': case '3': case '4': case '5':
          setActiveTab(tabs[Number(e.key) - 1]); break;
        case 't': toggleTheme(); break;
        case '?': setHelpOpen(o => !o); break;
        case 'ArrowLeft':
          if (activeTab === 'week') setSelectedWeek(Math.max(1, selectedWeek - 1)); break;
        case 'ArrowRight':
          if (activeTab === 'week') setSelectedWeek(Math.min(12, selectedWeek + 1)); break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTab, selectedWeek, setActiveTab, setSelectedWeek, toggleTheme, closeDrawer]);

  if (!helpOpen) return null;
  return (/* overlay listing shortcuts; style like ShareModal/GarageModal */);
}
```
Overlay: a centered modal listing the shortcuts with `<kbd>`-style key caps. Style to
match existing modal classes in `src/style.css`; add a `.kbd` key-cap style. Discoverable
via `?`; no persistent on-screen affordance (keeps it clutter-free).

Mount in `src/App.tsx`:
```tsx
import KeyboardShortcuts from './components/KeyboardShortcuts';
// …inside the returned fragment, alongside <Toast />:
<KeyboardShortcuts />
```

---

## Files touched (summary)

**New:** `src/utils/pricing.ts`, `src/components/KeyboardShortcuts.tsx`
**Edit:** `src/components/BuyGuidePanel.tsx` (import extracted helpers),
`src/components/WeekCell.tsx`, `src/components/TwCard.tsx`,
`src/components/MyRaceCard.tsx`, `src/components/MySchedulePanel.tsx`,
`src/App.tsx`, `src/style.css`

---

## Verification

1. `npm run typecheck` — clean.
2. `npm run dev`, then:
   - **Badge:** Open Garage, own a track + a car of a known series → its WeekCell / By-Week
     card shows **✓ Ready**. Un-own the track → **$X** equals `TRACK_SKUS[base].price`
     (+ cheapest eligible car price if car also unowned). Empty garage → neutral (no badge).
   - **Summary bar:** Add races across multiple weeks/tracks → `races · weeks · tracks`
     correct; **$X to complete** matches the Buy Guide `⚡ My Schedule` total (incl. bulk
     discount). Own everything needed → **✓ You own everything**. Click cost → Buy Guide.
   - **Shortcuts:** `/` focuses search; `1`–`5` switch tabs; on By Week `←/→` change weeks
     and clamp at 1/12; `t` toggles theme; `?` opens / `Esc` closes overlay; typing in the
     search box triggers **no** shortcut.
3. Regression-check Buy Guide after the helper extraction (prices, discount tiers,
   "Buy on iRacing" SKUs unchanged).
