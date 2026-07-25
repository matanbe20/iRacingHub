import { TRACK_SKUS, CAR_SKUS } from '../data/iracing-skus';
import { baseTrackName } from './helpers';

export const FALLBACK_PRICE = 11.95;

/**
 * A price for display. Content iRacing does not sell on its own — combined
 * layouts, bundled cars — is listed at 0 in the SKU tables, which is not a
 * price; those show as an em dash rather than a misleading "$0.00".
 */
export function priceTag(price: number): string {
  return price > 0 ? '$' + price.toFixed(2) : '—';
}

/** True when the SKU tables carry no sellable price for this content. */
export function isUnpriced(price: number): boolean {
  return price <= 0;
}

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
  /** base track name still missing, or null if owned/not applicable */
  missingTrackName: string | null;
  /** cheapest eligible car still missing, or null if owned/not applicable */
  missingCarName: string | null;
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

  const missingTrackName = needsTrack ? baseTrack : null;
  const missingCarName = needsCar
    ? eligibleCars.reduce((cheapest, c) => (getCarPrice(c) < getCarPrice(cheapest) ? c : cheapest), eligibleCars[0])
    : null;

  let unlockCost = 0;
  if (missingTrackName) unlockCost += getTrackPrice(missingTrackName);
  if (missingCarName) unlockCost += getCarPrice(missingCarName);

  return {
    neutral: !garagePopulated,
    ready: garagePopulated && !needsTrack && !needsCar,
    needsTrack,
    needsCar,
    missingTrackName,
    missingCarName,
    unlockCost,
  };
}
