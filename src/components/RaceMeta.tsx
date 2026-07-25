import React from 'react';
import { lapsShort, splitTrackName } from '../utils/helpers';
import { IconRainDrop } from './icons';

/**
 * The small facts a race row carries — track, distance, rain — rendered the same
 * way on the series week grid, the By Week cards and My Schedule.
 */

interface TrackNameProps {
  track: string;
  /** Wrapper class, so each card keeps its own layout rules. */
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

/** "Watkins Glen - Boot" with the layout dimmed after the dash. */
export function TrackName({ track, className, onClick, title }: TrackNameProps) {
  const [main, config] = splitTrackName(track);
  return (
    <span className={className} onClick={onClick} title={title}>
      {main}
      {config && <span className="track-config"> - {config}</span>}
    </span>
  );
}

interface LapsBadgeProps {
  /** Raw schedule text, e.g. "40 mins" or "18 laps". */
  laps: string | undefined;
}

/** Race distance. Narrow screens show the `data-short` form ("40M" / "18L") instead. */
export function LapsBadge({ laps }: LapsBadgeProps) {
  if (!laps) return null;
  return <span className="laps-badge" data-short={lapsShort(laps)}>{laps}</span>;
}

interface RainBadgeProps {
  /** Chance of rain in percent. Absent or zero renders nothing. */
  rain: number | undefined;
  size?: number;
}

export function RainBadge({ rain, size = 9 }: RainBadgeProps) {
  if (rain == null || rain <= 0) return null;
  return (
    <span className="week-rain">
      <IconRainDrop size={size} /> {rain}%
    </span>
  );
}
