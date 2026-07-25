import React from 'react';
import useStore from '../store/useStore';
import Modal from './Modal';

/** One list of shared content, marking anything the viewer already owns. */
function SharedGarageSection({ label, items, owned }: { label: string; items: string[]; owned: Set<string> }) {
  if (items.length === 0) return null;
  return (
    <div className="shared-garage-section">
      <div className="shared-garage-section-label">
        {label} <span className="shared-garage-count">{items.length}</span>
      </div>
      {items.map(item => (
        <div key={item} className={'shared-garage-item' + (owned.has(item) ? ' owned' : '')}>
          <span className="shared-garage-name">{item}</span>
          {owned.has(item) && <span className="shared-garage-owned-badge">Owned</span>}
        </div>
      ))}
    </div>
  );
}

export default function SharedGarageModal() {
  const isOpen = useStore(s => s.isGarageShareModalOpen);
  const sharedGarageCars = useStore(s => s.sharedGarageCars);
  const sharedGarageTracks = useStore(s => s.sharedGarageTracks);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const closeGarageShareModal = useStore(s => s.closeGarageShareModal);
  const mergeSharedGarage = useStore(s => s.mergeSharedGarage);

  if (!isOpen) return null;

  const newCars = sharedGarageCars.filter(c => !ownedCars.has(c)).length;
  const newTracks = sharedGarageTracks.filter(t => !ownedTracks.has(t)).length;
  const hasNew = newCars > 0 || newTracks > 0;

  return (
    <Modal
      title="Shared Garage"
      onClose={closeGarageShareModal}
      footer={
        <button className="modal-add-all-btn" onClick={mergeSharedGarage} disabled={!hasNew}>
          {hasNew
            ? '+ Add to my garage (' + [newCars > 0 && newCars + ' car' + (newCars !== 1 ? 's' : ''), newTracks > 0 && newTracks + ' track' + (newTracks !== 1 ? 's' : '')].filter(Boolean).join(', ') + ')'
            : '\u2713 Already in your garage'}
        </button>
      }
    >
      <SharedGarageSection label="Cars" items={sharedGarageCars} owned={ownedCars} />
      <SharedGarageSection label="Tracks" items={sharedGarageTracks} owned={ownedTracks} />
    </Modal>
  );
}
