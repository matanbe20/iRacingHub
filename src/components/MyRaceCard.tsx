import React from 'react';
import useStore from '../store/useStore';
import { catClass, catLabel, baseTrackName, lapsShort, splitTrackName } from '../utils/helpers';
import CarBadges from './CarBadges';
import CategoryIcon from './CategoryIcon';
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
  const cc = catClass(entry.category);
  const trackOwned = ownedTracks.size > 0 && ownedTracks.has(baseTrackName(entry.track));
  const [trackMain, trackConfig] = splitTrackName(entry.track);
  const frequency = entry.frequency ?? SCHEDULE_DATA.find(s => s.name === entry.rawName)?.frequency ?? '';

  function handleTrackClick(e: React.MouseEvent) {
    e.stopPropagation();
    clearTrackFilter();
    addTrackFilter(baseTrackName(entry.track));
    setActiveTab('all');
  }

  return (
    <div className="my-race-card">
      <span className={'cat-badge ' + cc} title={catLabel(entry.category)}><CategoryIcon category={entry.category} /></span>
      <span className={'class-badge ' + entry.cls}>{entry.cls}</span>
      <div className="my-race-info">
        <div className="my-race-title">
          <SeriesLogo category={entry.category as Category} name={entry.rawName} className="series-logo" />
          {entry.displayName}
        </div>
        <div className="my-race-meta">
          <span className="my-race-track-badge" onClick={handleTrackClick} title="Filter by this track">{trackMain}{trackConfig && <span className="track-config"> - {trackConfig}</span>}{trackOwned && <span className="track-owned-badge">Owned</span>}</span>
          {entry.rain != null && entry.rain > 0 && <span className="week-rain">💧 {entry.rain}%</span>}
          {entry.cars && <CarBadges cars={entry.cars} />}
          {entry.laps && <span className="tw-card-laps" data-short={lapsShort(entry.laps)}>{entry.laps}</span>}
        </div>
      </div>
      <span className="series-freq" data-freq={frequency}>!</span>
      <button className="my-race-remove" onClick={() => removeRace(entry.id)} title="Remove">&#x2715;</button>
    </div>
  );
}
