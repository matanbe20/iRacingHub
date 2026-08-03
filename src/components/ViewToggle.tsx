import React from 'react';

/**
 * The compact segmented control that switches a panel between two layouts of the
 * same content - All Series' cards/list and the Special Events grid/list.
 */

interface ViewToggleOption<T extends string> {
  value: T;
  /** Tooltip and accessible name - the button itself only shows the icon. */
  label: string;
  icon: React.ReactNode;
}

interface ViewToggleProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ViewToggleOption<T>[];
}

export default function ViewToggle<T extends string>({ value, onChange, options }: ViewToggleProps<T>) {
  return (
    <div className="view-toggle" role="group">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={'view-btn' + (opt.value === value ? ' active' : '')}
          onClick={() => onChange(opt.value)}
          title={opt.label}
          aria-label={opt.label}
          aria-pressed={opt.value === value}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
