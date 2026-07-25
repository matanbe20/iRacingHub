# iRacingHub

React + TypeScript + Vite SPA over a static season schedule (`src/data.ts`). Zustand store,
one stylesheet (`src/style.css`), no router — five tabs switched from store state. Deployed to
GitHub Pages on push to `main`.

`npm run dev` · `npm run typecheck` · `npm run build`

## Component gallery — `/storybook`

Every component in the app, rendered from the real components and stylesheet, at
`storybook/index.html` (a second Vite entry, so it is a real URL). `src/storybook/` holds the
shell, the fixtures and one file per section.

**Open it instead of clicking through the app** when checking anything visual:

- States that are awkward to reach for real are staged as standing variants — owned/locked rows,
  the unpriced `$?` chip, the neutral empty-garage state, no-results, dimmed past weeks,
  completed vs. live events, disabled buttons.
- The search box matches story names, descriptions and CSS class names, so it answers "which
  component owns `.list-badge`?" faster than grepping.
- Open it after any `src/data.ts` update. Fixtures are picked out of `SCHEDULE_DATA` by
  predicate, so the gallery renders the new season's real content and data gaps show up
  immediately — that is how `laps: 'mins'` and a `$0.00` price chip were caught.

Rules:

- Add a story for any new shared component. The icons section enumerates every `Icon*` export
  automatically; follow that pattern where a family is likely to grow.
- The dependency is one-way: app code must never import from `src/storybook/`.
  `SpecialEventCard` is exported solely so the gallery can render it.
- The page sets `window.__IRACING_EPHEMERAL__`, which makes `utils/storage.ts` drop every read
  and write. Demo interactions must never reach a visitor's saved data — keep it that way.
- Gallery CSS lives in `src/storybook/storybook.css` and is entirely `sb-`prefixed.

## Conventions

- Shared UI primitives live in `src/components/`: `Modal` (every overlay), `CheckRow` (every
  selectable content row), `CatBadge`/`ClassBadge`, `RaceMeta` (`TrackName`, `LapsBadge`,
  `RainBadge`), `icons.tsx` (every SVG used more than once). Reach for these before writing
  new markup — the duplicates they replaced had already drifted apart.
- Category and licence-class metadata (label, short label, abbreviation, colour) come from
  `utils/helpers.ts`; class hues are the `--class-*` variables. Do not re-declare either.
- The car and track catalogues come from `utils/catalog.ts`. Anything offered as a filter must
  be something the Buy Guide can price.
- All `localStorage` access goes through `utils/storage.ts`.
- Verify visual changes with Playwright in both themes before finishing; save screenshots to
  `.screenshots/` (git-ignored), not the project root.
