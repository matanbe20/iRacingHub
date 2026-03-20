import React from 'react';
import useStore from '../store/useStore.js';
import { ALL_CATEGORIES } from '../store/useStore.js';

const CAT_CLASS = {
  'OVAL': 'cat-oval',
  'SPORTS CAR': 'cat-sports',
  'FORMULA CAR': 'cat-formula',
  'DIRT OVAL': 'cat-dirt-oval',
  'DIRT ROAD': 'cat-dirt-road',
  'UNRANKED': 'cat-unranked',
};

const CAT_LABEL = {
  'OVAL': 'Oval',
  'SPORTS CAR': 'Sports Car',
  'FORMULA CAR': 'Formula',
  'DIRT OVAL': 'Dirt Oval',
  'DIRT ROAD': 'Dirt Road',
  'UNRANKED': 'Unranked',
};

export default function CategoryFilters() {
  const activeCategories = useStore(s => s.activeCategories);
  const toggleCategory = useStore(s => s.toggleCategory);

  return (
    <div className="filter-group" id="cat-filters">
      {ALL_CATEGORIES.map(cat => (
        <button
          key={cat}
          className={'filter-btn ' + CAT_CLASS[cat] + (activeCategories.has(cat) ? ' active' : '')}
          data-cat={cat}
          onClick={() => toggleCategory(cat)}
        >
          {CAT_LABEL[cat]}
        </button>
      ))}
    </div>
  );
}
