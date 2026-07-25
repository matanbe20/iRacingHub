import React from 'react';
import useStore from '../store/useStore';
import { ALL_CATEGORIES } from '../store/useStore';
import { catClass, catLabel } from '../utils/helpers';

export default function CategoryFilters() {
  const activeCategories = useStore(s => s.activeCategories);
  const toggleCategory = useStore(s => s.toggleCategory);

  return (
    <div className="filter-group" id="cat-filters">
      {ALL_CATEGORIES.map(cat => (
        <button
          key={cat}
          className={'filter-btn cat-' + catClass(cat) + (activeCategories.has(cat) ? ' active' : '')}
          data-cat={cat}
          onClick={() => toggleCategory(cat)}
        >
          {catLabel(cat)}
        </button>
      ))}
    </div>
  );
}
