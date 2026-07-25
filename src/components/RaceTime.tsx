import React from 'react';
import useStore from '../store/useStore';
import { useNow } from '../utils/useNow';
import { formatCountdown, formatSessionTime, nextSessionAcross } from '../utils/raceTimes';

const ClockSvg = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

interface RaceTimeProps {
  frequency: string;
  /**
   * `Week.date` values, normalized to their race weeks internally. Pass one date to
   * scope the countdown to a single race, or a series' whole schedule to count down
   * to whichever of its races comes next.
   */
  weekDates: string[];
  /** Time only, with the countdown moved into the tooltip. For dense grids. */
  compact?: boolean;
}

/**
 * The next session start in the viewer's timezone, with a live countdown. Renders
 * nothing when the series' frequency carries no usable timing information or every
 * given race week is already over.
 */
export default function RaceTime({ frequency, weekDates, compact }: RaceTimeProps) {
  const showRaceTimes = useStore(s => s.showRaceTimes);
  const timeZone = useStore(s => s.timeZone);
  const timeFormat = useStore(s => s.timeFormat);
  const now = useNow();

  if (!showRaceTimes) return null;

  const next = nextSessionAcross(frequency, weekDates, now);
  if (next === null) return null;

  const time = formatSessionTime(next, timeZone, timeFormat, now);
  const remaining = next - now;
  // "Now" already reads as a phrase, so it doesn't take the "in" preposition.
  const countdown = remaining <= 60_000 ? 'now' : 'in ' + formatCountdown(remaining);
  const soon = remaining <= 10 * 60_000;

  const className = 'race-time'
    + (compact ? ' compact' : '')
    + (soon ? ' race-time-soon' : '');

  return (
    <span className={className} title={compact ? `Next race ${time} · ${countdown}` : frequency}>
      <ClockSvg />
      {compact ? time : <>{time} <span className="race-time-count">· {countdown}</span></>}
    </span>
  );
}
