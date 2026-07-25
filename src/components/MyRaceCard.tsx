import React from 'react';
import useStore from '../store/useStore';
import { baseTrackName } from '../utils/helpers';
import { getRaceReadiness } from '../utils/pricing';
import { localizedFrequencyLabel } from '../utils/raceTimes';
import CarBadges from './CarBadges';
import { CatBadge, ClassBadge } from './CatBadge';
import RaceCostBadge from './RaceCostBadge';
import { LapsBadge, RainBadge, TrackName } from './RaceMeta';
import RaceTime from './RaceTime';
import SeriesLogo from './SeriesLogo';
import { SCHEDULE_DATA } from '../data';
import type { Category, RaceEntry } from '../types';

interface MyRaceCardProps {
  entry: RaceEntry;
}

export default function MyRaceCard({ entry }: MyRaceCardProps) {
  const removeRace = useStore(s => s.removeRace);
  const clearTrackFilter = useStore(s => s.clearTrackFilter);
  const addTrackFilter = useStore(s => s.addTrackFilter);
  const setActiveTab = useStore(s => s.setActiveTab);
  const ownedTracks = useStore(s => s.ownedTracks);
  const ownedCars = useStore(s => s.ownedCars);
  const timeZone = useStore(s => s.timeZone);
  const timeFormat = useStore(s => s.timeFormat);
  const series = SCHEDULE_DATA.find(s => s.name === entry.rawName);
  const carsString = series?.cars ?? entry.cars;
  const readiness = getRaceReadiness(carsString, entry.track, ownedCars, ownedTracks);
  const frequency = entry.frequency ?? series?.frequency ?? '';

  function handleTrackClick(e: React.MouseEvent) {
    e.stopPropagation();
    clearTrackFilter();
    addTrackFilter(baseTrackName(entry.track));
    setActiveTab('all');
  }

  return (
    <div className="my-race-card">
      <CatBadge category={entry.category} />
      <ClassBadge cls={entry.cls} />
      <div className="my-race-info">
        <div className="my-race-title">
          <SeriesLogo category={entry.category as Category} name={entry.rawName} className="series-logo" />
          {entry.displayName}
        </div>
        <div className="my-race-meta">
          <TrackName
            track={entry.track}
            className="my-race-track-badge"
            onClick={handleTrackClick}
            title="Filter by this track"
          />
          <RainBadge rain={entry.rain} />
          {entry.cars && <CarBadges cars={entry.cars} />}
          <LapsBadge laps={entry.laps} />
          <RaceCostBadge readiness={readiness} />
          <RaceTime frequency={frequency} weekDates={[entry.date]} />
        </div>
      </div>
      <span className="series-freq" data-freq={localizedFrequencyLabel(frequency, entry.date, timeZone, timeFormat)}>!</span>
      <button className="my-race-remove" onClick={() => removeRace(entry.id)} title="Remove">&#x2715;</button>
    </div>
  );
}
