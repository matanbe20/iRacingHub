import React from 'react';
import useStore from '../store/useStore.js';
import { catClass, catLabel, catLabelShort } from '../utils/helpers.js';

export default function MyRaceCard({ entry }) {
  const removeRace = useStore(s => s.removeRace);
  const cc = catClass(entry.category);
  const meta = [entry.track, entry.laps, entry.cars].filter(Boolean).join(' · ');

  return (
    <div className="my-race-card">
      <span className={'cat-badge ' + cc} data-short={catLabelShort(entry.category)}>{catLabel(entry.category)}</span>
      <span className={'class-badge ' + entry.cls}>{entry.cls}</span>
      <div className="my-race-info">
        <div className="my-race-title">{entry.displayName}</div>
        <div className="my-race-meta">{meta}</div>
      </div>
      <button className="my-race-remove" onClick={() => removeRace(entry.id)} title="Remove">&#x2715;</button>
    </div>
  );
}
