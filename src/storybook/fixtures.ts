import { SCHEDULE_DATA } from '../data';
import { cleanName, isFixed } from '../utils/helpers';
import { getCurrentWeek } from '../utils/schedule';
import useStore from '../store/useStore';
import type { RaceEntry, Series, Week } from '../types';

/**
 * Demo data for the gallery, picked out of the real season schedule rather than
 * invented, so every story shows the component with the shape of content it
 * actually has to render — real series names, logos, car lists and rain figures.
 * Each lookup falls back to the first series of its kind, so a new season's data
 * can never leave a story blank.
 */

function find(predicate: (s: Series) => boolean, fallback: (s: Series) => boolean): Series {
  return SCHEDULE_DATA.find(predicate) ?? SCHEDULE_DATA.find(fallback) ?? SCHEDULE_DATA[0];
}

const byCategory = (cat: string) => (s: Series) => s.category === cat;

/** A top-licence sports car series: long name, logo, single car. */
export const sportsCarSeries = find(
  s => s.category === 'SPORTS CAR' && s.class === 'A',
  byCategory('SPORTS CAR'),
);

/** Multi-class field — exercises the grouped car badges and their tooltip. */
export const multiClassSeries = find(
  s => s.cars.split(',').length >= 5,
  s => s.cars.split(',').length >= 3,
);

export const formulaSeries = find(byCategory('FORMULA CAR'), byCategory('FORMULA CAR'));

/** A fixed-setup series, for the "[Fixed]" tag on the series card. */
export const fixedSetupSeries = find(s => isFixed(s.name), byCategory('FORMULA CAR'));
export const ovalSeries = find(byCategory('OVAL'), byCategory('OVAL'));
export const dirtSeries = find(byCategory('DIRT OVAL'), byCategory('DIRT OVAL'));

/** A series whose schedule includes a wet week, for the rain indicators. */
export const rainySeries = find(
  s => s.weeks.some(w => (w.rain ?? 0) > 0),
  () => true,
);

export const currentWeekNumber = getCurrentWeek();

export function weekOf(series: Series, weekNum = currentWeekNumber): Week {
  return series.weeks.find(w => w.week === weekNum) ?? series.weeks[0];
}

export const rainyWeek: Week =
  rainySeries.weeks.find(w => (w.rain ?? 0) > 0) ?? rainySeries.weeks[0];

export function entryOf(series: Series, week: Week): RaceEntry {
  return {
    id: series.name + '_' + week.week,
    rawName: series.name,
    weekNum: week.week,
    displayName: cleanName(series.name),
    category: series.category,
    cls: series.class,
    cars: series.cars,
    track: week.track,
    date: week.date,
    laps: week.laps || '',
    rain: week.rain,
    frequency: series.frequency,
  };
}

/**
 * Puts the store into a state where both sides of every toggle are on show: one
 * series saved to My Schedule, one favourited. Writes are dropped in this page's
 * ephemeral mode, so nothing here reaches a visitor's own data.
 */
export function seedDemoState(): void {
  const store = useStore.getState();
  store.addRace(sportsCarSeries.name, weekOf(sportsCarSeries).week);
  store.addRace(formulaSeries.name, weekOf(formulaSeries).week);
  if (!store.favorites.has(ovalSeries.name)) store.toggleFavorite(ovalSeries.name);
}

/** The saved-race id the "added" variants use. */
export const addedRaceId = sportsCarSeries.name + '_' + weekOf(sportsCarSeries).week;
