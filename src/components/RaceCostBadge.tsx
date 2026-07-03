import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useStore from '../store/useStore';
import { getTrackPrice, getCarPrice } from '../utils/pricing';
import type { RaceReadiness } from '../utils/pricing';

const IconGarage = () => (
  <svg width="15" height="14" viewBox="0 0 16 15">
    <polygon points="0,7.5 8,1 16,7.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" strokeLinejoin="round" />
    <rect x="2" y="7" width="12" height="7" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
    <rect x="6.2" y="9.5" width="3.6" height="4.5" fill="#92400e" />
  </svg>
);

const IconMoney = () => (
  <svg width="14" height="14" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="6.5" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
    <text x="8" y="11.2" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#f0fdf4" fontFamily="Arial, sans-serif">$</text>
  </svg>
);

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

  return (
    <span className="race-cost-wrap">
      <button
        ref={btnRef}
        type="button"
        className="race-cost-badge"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        title={readiness.needsTrack && readiness.needsCar ? 'Need track + car — click for options' : readiness.needsTrack ? 'Need track — click for options' : 'Need car — click for options'}
      >
        ${readiness.unlockCost.toFixed(2)}
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
                <span className="race-cost-popover-price">${getTrackPrice(missingTrackName).toFixed(2)}</span>
              </span>
              <span className="race-cost-popover-actions">
                <button type="button" title="Add to garage" onClick={() => { addOwnedTrack(missingTrackName); setOpen(false); }}><IconGarage /></button>
                <button type="button" title="Add to Buy Guide" onClick={() => { queueTrackForBuyGuide(missingTrackName); setOpen(false); }}><IconMoney /></button>
              </span>
            </div>
          )}
          {missingCarName && (
            <div className="race-cost-popover-row">
              <span className="race-cost-popover-label">
                {missingCarName}
                <span className="race-cost-popover-price">${getCarPrice(missingCarName).toFixed(2)}</span>
              </span>
              <span className="race-cost-popover-actions">
                <button type="button" title="Add to garage" onClick={() => { addOwnedCar(missingCarName); setOpen(false); }}><IconGarage /></button>
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
