import React from 'react';
import useStore from '../store/useStore';
import { getCurrentWeek } from '../utils/schedule';
import { lapsShort, splitTrackName, shortDate } from '../utils/helpers';
import { getRaceReadiness } from '../utils/pricing';
import CarBadges from './CarBadges';
import RaceCostBadge from './RaceCostBadge';
import type { Series, Week } from '../types';

const currentWeek = getCurrentWeek();

const RainDropSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.5 9.5 4 13.5 4 17a8 8 0 0 0 16 0c0-3.5-2.5-7.5-8-15z"/>
  </svg>
);

interface WeekCellProps {
  series: Series;
  week: Week;
}

export default function WeekCell({ series, week }: WeekCellProps) {
  const mySchedule = useStore(s => s.mySchedule);
  const toggleRace = useStore(s => s.toggleRace);
  const ownedTracks = useStore(s => s.ownedTracks);
  const ownedCars = useStore(s => s.ownedCars);

  const [trackMain, trackConfig] = splitTrackName(week.track);
  const isCurrent = week.week === currentWeek;
  const readiness = getRaceReadiness(series.cars, week.track, ownedCars, ownedTracks);
  const raceId = series.name + '_' + week.week;
  const isAdded = !!mySchedule[raceId];

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    toggleRace(series.name, week.week);
  }

  return (
    <div className={'week-cell' + (isCurrent ? ' current' : '')}>
      <span className="week-num">Wk {week.week}{isCurrent ? ' ★' : ''}</span>
      <span className="week-date">{shortDate(week.date)}</span>
      <span className="week-track">
        {trackMain}{trackConfig && <span className="track-config"> - {trackConfig}</span>}
        <RaceCostBadge readiness={readiness} />
      </span>
      {week.car && <CarBadges cars={week.car} />}
      {week.rain != null && week.rain > 0 && (
        <span className="week-rain"><RainDropSvg /> {week.rain}%</span>
      )}
      {week.laps && <span className="week-laps" data-short={lapsShort(week.laps)}>{week.laps}</span>}
      <button
        className={'week-add-btn' + (isAdded ? ' added' : '')}
        data-raw-name={series.name}
        data-week={week.week}
        onClick={handleToggle}
        title={isAdded ? 'Remove from My Schedule' : 'Add to My Schedule'}
      >
        {isAdded ? '✓' : '+'}
      </button>
    </div>
  );
}
