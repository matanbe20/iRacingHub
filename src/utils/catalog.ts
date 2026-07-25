import { SCHEDULE_DATA } from '../data';
import { baseTrackName } from './helpers';
import { parseCars } from './pricing';

/**
 * The season's content, derived once from the schedule: every purchasable car and
 * every base track name, sorted for display. The filter autocomplete, My Garage and
 * the Buy Guide all pick from these same two lists, so a name that is buyable in one
 * is buyable in all of them.
 */

export const ALL_CARS: string[] = (() => {
  const cars = new Set<string>();
  SCHEDULE_DATA.forEach(s => parseCars(s.cars).forEach(c => cars.add(c)));
  return [...cars].sort((a, b) => a.localeCompare(b));
})();

export const ALL_TRACKS: string[] = (() => {
  const tracks = new Set<string>();
  SCHEDULE_DATA.forEach(s => s.weeks.forEach(w => { if (w.track) tracks.add(baseTrackName(w.track)); }));
  return [...tracks].sort((a, b) => a.localeCompare(b));
})();
