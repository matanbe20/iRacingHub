import React from 'react';

/**
 * One selectable row in a long content list - the shared body of both My Garage and
 * the Buy Guide. The native checkbox stays in the DOM for keyboard and screen-reader
 * users; `.check-box` is the visible square.
 */

interface CheckRowProps {
  name: string;
  checked: boolean;
  onToggle: () => void;
  /** Locked rows (already owned) render checked and greyed, and ignore clicks. */
  locked?: boolean;
  /** Trailing price or badges. */
  children?: React.ReactNode;
}

export default function CheckRow({ name, checked, onToggle, locked, children }: CheckRowProps) {
  return (
    <label className={'check-row' + (locked ? ' check-row-locked' : '')}>
      <input
        type="checkbox"
        checked={checked}
        disabled={locked}
        onChange={() => { if (!locked) onToggle(); }}
      />
      <span className={'check-box' + (checked ? ' checked' : '')} />
      <span className="check-row-name">{name}</span>
      {children}
    </label>
  );
}
