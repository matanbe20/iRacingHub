import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useStore from '../store/useStore';
import { getTrackPrice, getCarPrice, isUnpriced, priceTag } from '../utils/pricing';
import type { RaceReadiness } from '../utils/pricing';
import { IconGarageSolid, IconMoney } from './icons';

const POPOVER_WIDTH = 210;

interface RaceCostBadgeProps {
  readiness: RaceReadiness;
}

export default function RaceCostBadge({ readiness }: RaceCostBadgeProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const addOwnedTrack = useStore(s => s.addOwnedTrack);
  const addOwnedCar = useStore(s => s.addOwnedCar);
  const queueTrackForBuyGuide = useStore(s => s.queueTrackForBuyGuide);
  const queueCarForBuyGuide = useStore(s => s.queueCarForBuyGuide);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const left = Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8);
      setCoords({ top: rect.bottom + 6, left: Math.max(8, left) });
    }
    updatePosition();

    function handleClose() { setOpen(false); }
    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener('mousedown', handleDocClick);
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
    };
  }, [open]);

  if (readiness.ready) {
    return <span className="race-ready-badge" title="You own the track and an eligible car">✓ Ready</span>;
  }
  if (readiness.neutral) return null;

  const missingTrackName = readiness.missingTrackName;
  const missingCarName = readiness.missingCarName;
  const unpriced = isUnpriced(readiness.unlockCost);

  return (
    <span className="race-cost-wrap">
      <button
        ref={btnRef}
        type="button"
        className="race-cost-badge"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        title={
          (readiness.needsTrack && readiness.needsCar ? 'Need track + car' : readiness.needsTrack ? 'Need track' : 'Need car')
          + (unpriced ? ' - iRacing publishes no separate price for it' : '')
          + ' - click for options'
        }
      >
        {unpriced ? '$?' : priceTag(readiness.unlockCost)}
      </button>
      {open && coords && createPortal(
        <div
          className="race-cost-popover"
          ref={popoverRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left, width: POPOVER_WIDTH }}
          onClick={e => e.stopPropagation()}
        >
          {missingTrackName && (
            <div className="race-cost-popover-row">
              <span className="race-cost-popover-label">
                {missingTrackName}
                <span className="race-cost-popover-price">{priceTag(getTrackPrice(missingTrackName))}</span>
              </span>
              <span className="race-cost-popover-actions">
                <button type="button" title="Add to garage" onClick={() => { addOwnedTrack(missingTrackName); setOpen(false); }}><IconGarageSolid /></button>
                <button type="button" title="Add to Buy Guide" onClick={() => { queueTrackForBuyGuide(missingTrackName); setOpen(false); }}><IconMoney /></button>
              </span>
            </div>
          )}
          {missingCarName && (
            <div className="race-cost-popover-row">
              <span className="race-cost-popover-label">
                {missingCarName}
                <span className="race-cost-popover-price">{priceTag(getCarPrice(missingCarName))}</span>
              </span>
              <span className="race-cost-popover-actions">
                <button type="button" title="Add to garage" onClick={() => { addOwnedCar(missingCarName); setOpen(false); }}><IconGarageSolid /></button>
                <button type="button" title="Add to Buy Guide" onClick={() => { queueCarForBuyGuide(missingCarName); setOpen(false); }}><IconMoney /></button>
              </span>
            </div>
          )}
        </div>,
        document.body
      )}
    </span>
  );
}
