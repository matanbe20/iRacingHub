import React, { useMemo, useState } from 'react';
import useStore from '../store/useStore';
import { cleanName, isFixed } from '../utils/helpers';
import { parseCars } from '../utils/pricing';
import { localizedFrequencyLabel, upcomingWeek } from '../utils/raceTimes';
import CarBadges from './CarBadges';
import { CatBadge, ClassBadge } from './CatBadge';
import RaceTime from './RaceTime';
import SeriesLogo from './SeriesLogo';
import WeekCell from './WeekCell';
import { IconRainDrop } from './icons';
import type { Series } from '../types';

interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mySchedule = useStore(s => s.mySchedule);
  const toggleSeries = useStore(s => s.toggleSeries);
  const filterByCategory = useStore(s => s.filterByCategory);
  const filterByClass = useStore(s => s.filterByClass);
  const ownedCars = useStore(s => s.ownedCars);
  const timeZone = useStore(s => s.timeZone);
  const timeFormat = useStore(s => s.timeFormat);

  const displayName = cleanName(series.name);
  const fixed = isFixed(series.name);
  const hasRain = series.weeks.some(w => w.rain != null && w.rain > 0);
  const allAdded = series.weeks.every(w => !!mySchedule[series.name + '_' + w.week]);

  const carOwned = ownedCars.size > 0 && parseCars(series.cars).some(c => ownedCars.has(c));

  // Timing is series-level here, so count down to whichever of this series' races
  // comes next, and anchor the DST-sensitive frequency restatement to that week.
  const weekDates = useMemo(() => series.weeks.map(w => w.date), [series]);
  const anchorWeek = upcomingWeek(series.weeks, Date.now()) ?? series.weeks[0];
  const freqLabel = anchorWeek
    ? localizedFrequencyLabel(series.frequency, anchorWeek.date, timeZone, timeFormat)
    : series.frequency;

  function handleToggleSeries(e: React.MouseEvent) {
    e.stopPropagation();
    toggleSeries(series.name);
  }

  function handleFilterCat(e: React.MouseEvent) {
    e.stopPropagation();
    filterByCategory(series.category);
  }

  function handleFilterClass(e: React.MouseEvent) {
    e.stopPropagation();
    filterByClass(series.class);
  }

  return (
    <div className={'series-card' + (expanded ? ' expanded' : '')}>
      <div className="series-header" onClick={() => setExpanded(e => !e)}>
        <CatBadge category={series.category} onFilter={handleFilterCat} />
        <ClassBadge cls={series.class} onFilter={handleFilterClass} />
        <span className="series-title">
          <SeriesLogo category={series.category} name={series.name} className="series-logo" />
          {displayName}
          {fixed && <span className="series-fixed-tag"> [Fixed]</span>}
        </span>
        <span className="series-cars"><CarBadges cars={series.cars} /></span>
        <RaceTime frequency={series.frequency} weekDates={weekDates} />
        <span className="series-freq" data-freq={freqLabel}>!</span>
        {hasRain && (
          <span className="series-rain-icon" title="Rain forecast in some weeks">
            <IconRainDrop size={12} />
          </span>
        )}
        {carOwned && (
          <span className="car-owned-badge" title="You own this car">✓ Car</span>
        )}
        <button
          className={'series-add-btn' + (allAdded ? ' added' : '')}
          data-raw-name={series.name}
          onClick={handleToggleSeries}
          title={allAdded ? 'Remove all weeks from My Schedule' : 'Add all weeks to My Schedule'}
        >
          {allAdded ? '✓ All' : '+ All'}
        </button>
        <span className="expand-icon">&#9662;</span>
      </div>
      <div className="schedule-body">
        <div className="schedule-body-inner">
          <div className="week-grid">
            {series.weeks.map((week, i) => (
              <WeekCell key={i} series={series} week={week} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
