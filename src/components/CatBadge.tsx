import React from 'react';
import { catClass, catLabel, catLabelShort } from '../utils/helpers';

/**
 * The category and licence-class chips that open every race row. They are pure
 * labels by default; pass `onFilter` where clicking one narrows the view (the
 * series cards) so the affordance shows up only where it does something.
 */

interface CatBadgeProps {
  category: string;
  onFilter?: (e: React.MouseEvent) => void;
}

export function CatBadge({ category, onFilter }: CatBadgeProps) {
  return (
    <span
      className={'cat-badge ' + catClass(category) + (onFilter ? ' filterable' : '')}
      data-short={catLabelShort(category)}
      onClick={onFilter}
      title={onFilter ? 'Filter by ' + catLabel(category) : undefined}
    >
      {catLabel(category)}
    </span>
  );
}

interface ClassBadgeProps {
  cls: string;
  onFilter?: (e: React.MouseEvent) => void;
}

export function ClassBadge({ cls, onFilter }: ClassBadgeProps) {
  return (
    <span
      className={'class-badge ' + cls + (onFilter ? ' filterable' : '')}
      onClick={onFilter}
      title={onFilter ? 'Filter by class ' + cls : undefined}
    >
      {cls}
    </span>
  );
}
