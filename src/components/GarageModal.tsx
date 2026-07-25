import React, { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { ALL_CARS, ALL_TRACKS } from '../utils/catalog';
import { FREE_CARS, FREE_TRACKS } from '../data/garage-defaults';
import CheckRow from './CheckRow';
import Modal from './Modal';
import { IconCar, IconTrack } from './icons';

const FREE_CARS_SET = new Set(FREE_CARS);
const FREE_TRACKS_SET = new Set(FREE_TRACKS);

type GarageTab = 'cars' | 'tracks';

export default function GarageModal() {
  const isOpen = useStore(s => s.isGarageModalOpen);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const setOwnedCars = useStore(s => s.setOwnedCars);
  const setOwnedTracks = useStore(s => s.setOwnedTracks);
  const closeGarageModal = useStore(s => s.closeGarageModal);

  const [tab, setTab] = useState<GarageTab>('cars');
  const [search, setSearch] = useState('');
  const [localCars, setLocalCars] = useState<Set<string>>(new Set());
  const [localTracks, setLocalTracks] = useState<Set<string>>(new Set());
  const [garageCopied, setGarageCopied] = useState(false);

  // Sync local state from store when opening
  const [prevOpen, setPrevOpen] = useState(false);
  if (isOpen && !prevOpen) {
    setPrevOpen(true);
    setLocalCars(new Set(ownedCars));
    setLocalTracks(new Set(ownedTracks));
    setSearch('');
    setTab('cars');
  }
  if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  const filteredCars = useMemo(() => {
    const q = search.toLowerCase();
    return q ? ALL_CARS.filter(c => c.toLowerCase().includes(q)) : ALL_CARS;
  }, [search]);

  const filteredTracks = useMemo(() => {
    const q = search.toLowerCase();
    return q ? ALL_TRACKS.filter(t => t.toLowerCase().includes(q)) : ALL_TRACKS;
  }, [search]);

  function toggleItem(item: string) {
    const setLocal = tab === 'cars' ? setLocalCars : setLocalTracks;
    setLocal(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item); else next.add(item);
      return next;
    });
  }

  function handleResetDefaults() {
    if (tab === 'cars') setLocalCars(new Set(FREE_CARS));
    else setLocalTracks(new Set(FREE_TRACKS));
  }

  function handleSelectAll() {
    if (tab === 'cars') setLocalCars(new Set(ALL_CARS));
    else setLocalTracks(new Set(ALL_TRACKS));
  }

  function handleClearAll() {
    if (tab === 'cars') setLocalCars(new Set());
    else setLocalTracks(new Set());
  }

  function handleSave() {
    setOwnedCars(new Set(localCars));
    setOwnedTracks(new Set(localTracks));
    closeGarageModal();
  }

  function handleShareGarage() {
    const encoded = btoa(JSON.stringify({ cars: [...ownedCars], tracks: [...ownedTracks] }));
    const url = location.origin + location.pathname + '?garage=' + encoded;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setGarageCopied(true);
        setTimeout(() => setGarageCopied(false), 2000);
      }).catch(() => { prompt('Copy this URL:', url); });
    } else {
      prompt('Copy this URL:', url);
      setGarageCopied(true);
      setTimeout(() => setGarageCopied(false), 2000);
    }
  }

  if (!isOpen) return null;

  const items = tab === 'cars' ? filteredCars : filteredTracks;
  const localSet = tab === 'cars' ? localCars : localTracks;
  const freeSet = tab === 'cars' ? FREE_CARS_SET : FREE_TRACKS_SET;
  const checkedCount = tab === 'cars' ? localCars.size : localTracks.size;
  const totalCount = tab === 'cars' ? ALL_CARS.length : ALL_TRACKS.length;

  const chrome = (
    <>
      <div className="sub-tabs">
        <button
          className={'sub-tab-btn' + (tab === 'cars' ? ' active' : '')}
          onClick={() => { setTab('cars'); setSearch(''); }}
        >
          <IconCar />Cars <span className="sub-tab-count">{localCars.size}</span>
        </button>
        <button
          className={'sub-tab-btn' + (tab === 'tracks' ? ' active' : '')}
          onClick={() => { setTab('tracks'); setSearch(''); }}
        >
          <IconTrack />Tracks <span className="sub-tab-count">{localTracks.size}</span>
        </button>
      </div>

      <div className="list-toolbar">
        <input
          className="list-search"
          type="text"
          placeholder={tab === 'cars' ? 'Search cars…' : 'Search tracks…'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoComplete="off"
        />
        <button className="toolbar-btn toolbar-btn--accent" onClick={handleResetDefaults} title="Select all items included with iRacing membership">
          Free defaults
        </button>
        <button className="toolbar-btn" onClick={handleSelectAll}>All</button>
        <button className="toolbar-btn" onClick={handleClearAll}>None</button>
      </div>

      <div className="garage-modal-summary">
        {checkedCount} / {totalCount} {tab === 'cars' ? 'cars' : 'tracks'} selected
      </div>
    </>
  );

  const footer = (
    <>
      <button className={'garage-share-btn' + (garageCopied ? ' copied' : '')} onClick={handleShareGarage}>
        {garageCopied ? '✓ Copied!' : 'Share Garage'}
      </button>
      <div className="modal-footer-right">
        <button className="modal-cancel-btn" onClick={closeGarageModal}>Cancel</button>
        <button className="modal-confirm-btn" onClick={handleSave}>Save</button>
      </div>
    </>
  );

  return (
    <Modal title="My Garage" onClose={closeGarageModal} size="lg" chrome={chrome} footer={footer} flushBody>
      {items.map(item => (
        <CheckRow
          key={item}
          name={item}
          checked={localSet.has(item)}
          onToggle={() => toggleItem(item)}
        >
          {freeSet.has(item) && <span className="list-badge list-badge--free">Free</span>}
        </CheckRow>
      ))}
      {items.length === 0 && (
        <div className="list-empty">No results for "{search}"</div>
      )}
    </Modal>
  );
}
