import React from 'react';
import useStore from '../store/useStore';
import { cleanName } from '../utils/helpers';
import { getRaceReadiness } from '../utils/pricing';
import { localizedFrequencyLabel } from '../utils/raceTimes';
import CarBadges from './CarBadges';
import { CatBadge, ClassBadge } from './CatBadge';
import RaceCostBadge from './RaceCostBadge';
import { LapsBadge, RainBadge, TrackName } from './RaceMeta';
import RaceTime from './RaceTime';
import SeriesLogo from './SeriesLogo';
import type { Series, Week } from '../types';

interface TwCardProps {
  series: Series;
  week: Week;
}

export default function TwCard({ series, week }: TwCardProps) {
  const mySchedule = useStore(s => s.mySchedule);
  const favorites = useStore(s => s.favorites);
  const toggleRace = useStore(s => s.toggleRace);
  const toggleFavorite = useStore(s => s.toggleFavorite);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const timeZone = useStore(s => s.timeZone);
  const timeFormat = useStore(s => s.timeFormat);

  const raceId = series.name + '_' + week.week;
  const isAdded = !!mySchedule[raceId];
  const isFav = favorites.has(series.name);
  const readiness = getRaceReadiness(series.cars, week.track, ownedCars, ownedTracks);

  function handleToggleRace(e: React.MouseEvent) {
    e.stopPropagation();
    toggleRace(series.name, week.week);
  }

  return (
    <div className="tw-card">
      <CatBadge category={series.category} />
      <ClassBadge cls={series.class} />
      <div className="tw-card-info">
        <div className="tw-card-title">
          <SeriesLogo category={series.category} name={series.name} className="series-logo" />
          {cleanName(series.name)}
        </div>
        <div className="tw-card-meta">
          <TrackName track={week.track} className="tw-card-track" />
          <RainBadge rain={week.rain} />
          {series.cars && <CarBadges cars={series.cars} />}
          <LapsBadge laps={week.laps} />
          <RaceCostBadge readiness={readiness} />
          <RaceTime frequency={series.frequency} weekDates={[week.date]} />
        </div>
      </div>
      <span className="series-freq" data-freq={localizedFrequencyLabel(series.frequency, week.date, timeZone, timeFormat)}>!</span>
      <div className="tw-card-actions">
        <button
          className={'tw-fav-btn' + (isFav ? ' active' : '')}
          onClick={() => toggleFavorite(series.name)}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '★' : '☆'}
        </button>
        <button
          className={'week-add-btn' + (isAdded ? ' added' : '')}
          data-raw-name={series.name}
          data-week={week.week}
          onClick={handleToggleRace}
          title={isAdded ? 'Remove from My Schedule' : 'Add to My Schedule'}
        >
          {isAdded ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
}
