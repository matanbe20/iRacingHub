import React from 'react';
import useStore from '../store/useStore';
import { CatBadge, ClassBadge } from './CatBadge';
import Modal from './Modal';
import type { RaceEntry } from '../types';

function SharedRaceRow({ entry }: { entry: RaceEntry }) {
  const mySchedule = useStore(s => s.mySchedule);
  const addSharedRace = useStore(s => s.addSharedRace);
  const alreadyAdded = !!mySchedule[entry.id];
  const meta = [entry.track, entry.laps, entry.cars].filter(Boolean).join(' · ');

  return (
    <div className="my-race-card">
      <CatBadge category={entry.category} />
      <ClassBadge cls={entry.cls} />
      <div className="my-race-info">
        <div className="my-race-title">{entry.displayName}</div>
        <div className="my-race-meta">{meta}</div>
      </div>
      <button
        className={'modal-add-btn' + (alreadyAdded ? ' added' : '')}
        onClick={() => !alreadyAdded && addSharedRace(entry.id)}
        disabled={alreadyAdded}
      >
        {alreadyAdded ? '✓' : '+'}
      </button>
    </div>
  );
}

export default function ShareModal() {
  const isShareModalOpen = useStore(s => s.isShareModalOpen);
  const sharedEntries = useStore(s => s.sharedEntries);
  const mySchedule = useStore(s => s.mySchedule);
  const closeShareModal = useStore(s => s.closeShareModal);
  const addAllShared = useStore(s => s.addAllShared);

  if (!isShareModalOpen) return null;

  const groups: Record<string, RaceEntry[]> = {};
  const groupOrder: string[] = [];
  sharedEntries.forEach(e => {
    const key = 'Week ' + e.weekNum + ' \u2014 ' + e.date;
    if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
    groups[key].push(e);
  });

  const remaining = sharedEntries.filter(e => !mySchedule[e.id]).length;

  return (
    <Modal
      title="Shared Schedule"
      onClose={closeShareModal}
      footer={
        <button className="modal-add-all-btn" onClick={addAllShared} disabled={remaining === 0}>
          {remaining === 0 ? '\u2713 All Added' : '+ Add All (' + remaining + ')'}
        </button>
      }
    >
      {groupOrder.map(key => (
        <div key={key} className="my-week-group">
          <div className="my-week-label">{key}</div>
          {groups[key].map(e => (
            <SharedRaceRow key={e.id} entry={e} />
          ))}
        </div>
      ))}
    </Modal>
  );
}
