import React, { useState, useMemo, useEffect } from 'react';
import useStore from '../store/useStore';
import { baseTrackName } from '../utils/helpers';
import { ALL_CARS, ALL_TRACKS } from '../utils/catalog';
import { calcTotal, DISCOUNT_TIERS } from '../data/iracing-prices';
import { getTrackPrice, getCarPrice, getTrackSku, getCarSku, parseCars, priceTag } from '../utils/pricing';
import CheckRow from './CheckRow';
import { IconCar, IconTrack } from './icons';

type BuyTab = 'tracks' | 'cars';

const IRACING_STORE_URL = 'https://members.iracing.com/membersite/member/store_r.jsp';

export default function BuyGuidePanel() {
  const ownedTracks = useStore(s => s.ownedTracks);
  const ownedCars = useStore(s => s.ownedCars);
  const mySchedule = useStore(s => s.mySchedule);
  const buyGuideQueuedTracks = useStore(s => s.buyGuideQueuedTracks);
  const buyGuideQueuedCars = useStore(s => s.buyGuideQueuedCars);
  const clearBuyGuideQueue = useStore(s => s.clearBuyGuideQueue);

  const [buyTab, setBuyTab] = useState<BuyTab>(
    buyGuideQueuedTracks.size === 0 && buyGuideQueuedCars.size > 0 ? 'cars' : 'tracks'
  );
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [selectedCars, setSelectedCars] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [showOwned, setShowOwned] = useState(false);

  useEffect(() => {
    if (buyGuideQueuedTracks.size === 0 && buyGuideQueuedCars.size === 0) return;
    setSelectedTracks(prev => new Set([...prev, ...buyGuideQueuedTracks]));
    setSelectedCars(prev => new Set([...prev, ...buyGuideQueuedCars]));
    clearBuyGuideQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myScheduleTracks = useMemo(() => {
    const s = new Set<string>();
    Object.values(mySchedule).forEach(e => s.add(baseTrackName(e.track)));
    return s;
  }, [mySchedule]);

  const myScheduleCars = useMemo(() => {
    const s = new Set<string>();
    Object.values(mySchedule).forEach(e => parseCars(e.cars).forEach(c => s.add(c)));
    return s;
  }, [mySchedule]);

  const hasMySchedule = Object.keys(mySchedule).length > 0;

  const displayTracks = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_TRACKS.filter(t => {
      if (!showOwned && ownedTracks.has(t)) return false;
      if (q && !t.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, showOwned, ownedTracks]);

  const displayCars = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_CARS.filter(c => {
      if (!showOwned && ownedCars.has(c)) return false;
      if (q && !c.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, showOwned, ownedCars]);

  function toggleItem(name: string) {
    const setSelected = buyTab === 'tracks' ? setSelectedTracks : setSelectedCars;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function handleSmartSelectTracks() {
    const needed = new Set<string>();
    myScheduleTracks.forEach(t => { if (!ownedTracks.has(t)) needed.add(t); });
    setSelectedTracks(needed);
  }

  function handleSmartSelectCars() {
    const needed = new Set<string>();
    myScheduleCars.forEach(c => { if (!ownedCars.has(c)) needed.add(c); });
    setSelectedCars(needed);
  }

  function handleSelectAll() {
    if (buyTab === 'tracks') {
      setSelectedTracks(new Set(displayTracks.filter(t => !ownedTracks.has(t))));
    } else {
      setSelectedCars(new Set(displayCars.filter(c => !ownedCars.has(c))));
    }
  }

  function handleClear() {
    if (buyTab === 'tracks') setSelectedTracks(new Set());
    else setSelectedCars(new Set());
  }

  // Price calculation: combined tracks + cars
  const selectedTrackPrices = [...selectedTracks].map(getTrackPrice);
  const selectedCarPrices = [...selectedCars].map(getCarPrice);
  const priceCalc = calcTotal([...selectedTrackPrices, ...selectedCarPrices]);

  function handleBuyOnIRacing() {
    const skus: number[] = [];
    selectedTracks.forEach(name => {
      const sku = getTrackSku(name);
      if (sku && sku > 0) skus.push(sku);
    });
    selectedCars.forEach(name => {
      const sku = getCarSku(name);
      if (sku && sku > 0) skus.push(sku);
    });
    if (skus.length === 0) return;
    const uniqueSkus = [...new Set(skus)];
    window.open(`${IRACING_STORE_URL}?skus=${uniqueSkus.join(',')}`, '_blank', 'noopener,noreferrer');
  }

  const totalSelected = selectedTracks.size + selectedCars.size;

  // Tracks and cars behave identically in the list, so bind the active tab once.
  const onTracks = buyTab === 'tracks';
  const displayItems = onTracks ? displayTracks : displayCars;
  const ownedSet = onTracks ? ownedTracks : ownedCars;
  const selectedSet = onTracks ? selectedTracks : selectedCars;
  const scheduledSet = onTracks ? myScheduleTracks : myScheduleCars;
  const getPrice = onTracks ? getTrackPrice : getCarPrice;
  const getSku = onTracks ? getTrackSku : getCarSku;

  // Find next discount tier
  const nextTier = DISCOUNT_TIERS.find(t => t.minItems > priceCalc.count && t.minItems !== Infinity);

  return (
    <div className="buy-guide-panel">
      <div className="buy-guide-header">
        <div className="sub-tabs">
          <button
            className={'sub-tab-btn' + (buyTab === 'tracks' ? ' active' : '')}
            onClick={() => setBuyTab('tracks')}
          >
            <IconTrack />Tracks
            <span className="sub-tab-count">{selectedTracks.size > 0 ? selectedTracks.size : ''}</span>
          </button>
          <button
            className={'sub-tab-btn' + (buyTab === 'cars' ? ' active' : '')}
            onClick={() => setBuyTab('cars')}
          >
            <IconCar />Cars
            <span className="sub-tab-count">{selectedCars.size > 0 ? selectedCars.size : ''}</span>
          </button>
        </div>
        <div className="list-toolbar">
          <input
            className="list-search"
            type="text"
            placeholder={buyTab === 'tracks' ? 'Search tracks…' : 'Search cars…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="toolbar-btn toolbar-btn--accent"
            onClick={buyTab === 'tracks' ? handleSmartSelectTracks : handleSmartSelectCars}
            disabled={!hasMySchedule}
            title={hasMySchedule ? 'Select items needed for My Schedule' : 'Add races to My Schedule first'}
          >
            ⚡ My Schedule
          </button>
          <button className="toolbar-btn" onClick={handleSelectAll}>Select all</button>
          <button className="toolbar-btn" onClick={handleClear}>Clear</button>
          <label className="toolbar-check">
            <input
              type="checkbox"
              checked={showOwned}
              onChange={e => setShowOwned(e.target.checked)}
            />
            Show owned
          </label>
        </div>
      </div>

      <div className="buy-guide-list">
        {displayItems.length === 0
          ? <div className="list-empty">No {buyTab} found</div>
          : displayItems.map(name => {
            const owned = ownedSet.has(name);
            const selected = selectedSet.has(name);
            const inMySchedule = scheduledSet.has(name) && !owned;
            const price = getPrice(name);
            const hasSku = getSku(name) !== null;
            return (
              <CheckRow
                key={name}
                name={name}
                checked={selected || owned}
                locked={owned}
                onToggle={() => toggleItem(name)}
              >
                {inMySchedule && <span className="list-badge list-badge--sched">My Schedule</span>}
                {!owned && hasSku && <span className="check-row-price">{priceTag(price)}</span>}
                {owned && <span className="list-badge list-badge--owned">Owned</span>}
                {!owned && !hasSku && <span className="list-badge list-badge--unknown">No SKU</span>}
              </CheckRow>
            );
          })}
      </div>

      <div className={'buy-price-bar' + (totalSelected === 0 ? ' buy-price-bar-empty' : '')}>
        {totalSelected === 0 ? (
          <span className="buy-price-empty-msg">Select tracks or cars to see pricing</span>
        ) : (
          <>
            <div className="buy-price-summary">
              <span className="buy-price-count">
                {selectedTracks.size > 0 && `${selectedTracks.size} track${selectedTracks.size !== 1 ? 's' : ''}`}
                {selectedTracks.size > 0 && selectedCars.size > 0 && ' + '}
                {selectedCars.size > 0 && `${selectedCars.size} car${selectedCars.size !== 1 ? 's' : ''}`}
              </span>
              <span className="buy-price-subtotal">Subtotal: ${priceCalc.subtotal.toFixed(2)}</span>
              {priceCalc.discountPct > 0 && (
                <span className="buy-price-discount">
                  {priceCalc.discountPct}% off —{' '}
                  <span className="buy-price-discount-amount">−${priceCalc.discountAmount.toFixed(2)}</span>
                </span>
              )}
              {nextTier && (
                <span className="buy-price-next-tier">
                  Add {nextTier.minItems - priceCalc.count} more for {nextTier.discountPct}% off
                </span>
              )}
              <span className="buy-price-total">Total: ${priceCalc.total.toFixed(2)}</span>
            </div>
            <button
              className="buy-iracing-btn"
              onClick={handleBuyOnIRacing}
              title="Open iRacing store with selected items"
            >
              Buy on iRacing →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
