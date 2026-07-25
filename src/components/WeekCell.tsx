import React from 'react';
import useStore from '../store/useStore';
import { getCurrentWeek } from '../utils/schedule';
import { shortDate } from '../utils/helpers';
import { getRaceReadiness } from '../utils/pricing';
import CarBadges from './CarBadges';
import RaceCostBadge from './RaceCostBadge';
import { LapsBadge, RainBadge, TrackName } from './RaceMeta';
import type { Series, Week } from '../types';

const currentWeek = getCurrentWeek();

interface WeekCellProps {
  series: Series;
  week: Week;
}

export default function WeekCell({ series, week }: WeekCellProps) {
  const mySchedule = useStore(s => s.mySchedule);
  const toggleRace = useStore(s => s.toggleRace);
  const ownedTracks = useStore(s => s.ownedTracks);
  const ownedCars = useStore(s => s.ownedCars);

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
        <TrackName track={week.track} />
        <RaceCostBadge readiness={readiness} />
      </span>
      {week.car && <CarBadges cars={week.car} />}
      <RainBadge rain={week.rain} />
      <LapsBadge laps={week.laps} />
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
