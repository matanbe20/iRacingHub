import React from 'react';
import AdvancedClassMatrix from '../../components/AdvancedClassMatrix';
import CategoryFilters from '../../components/CategoryFilters';
import ClassFilters from '../../components/ClassFilters';
import FilterSidebar from '../../components/FilterSidebar';
import { Frame, Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

export const filters: StorySection = {
  id: 'filters',
  title: 'Filters',
  blurb: 'Everything that narrows the schedule. Filter state is shared by All Series and By Week, mirrored into the URL so a filtered view can be linked, and remembered between visits.',
  stories: [
    {
      name: 'FilterSidebar',
      description: 'The whole sidebar: discipline, licence, car, track and garage filters, with a Clear all that only appears once something is set. On mobile this becomes a drawer behind the header\'s Filters button.',
      keywords: 'filter-sidebar drawer filter-section clear all garage',
      render: () => (
        <>
          <Frame height={620} fit>
            <div className="sb-sidebar-host">
              <FilterSidebar />
            </div>
          </Frame>
          <Note>These controls are live: changing them here filters the demo cards in the Cards section too.</Note>
        </>
      ),
    },
    {
      name: 'CategoryFilters & ClassFilters',
      description: 'Toggle sets rather than radio choices - every discipline and licence is on by default, and you switch off what you do not race. Clicking a badge on a card instead narrows to just that one.',
      keywords: 'cat-filters class-filters filter-group toggle',
      render: () => (
        <Variants layout="stack">
          <Variant label="Type" wide><CategoryFilters /></Variant>
          <Variant label="Class" wide><ClassFilters /></Variant>
        </Variants>
      ),
    },
    {
      name: 'AdvancedClassMatrix',
      description: 'Licence per discipline, for drivers whose licences differ across disciplines - A in sports cars, Rookie on dirt. Rows for disciplines you have switched off are dimmed rather than hidden, so the grid stays stable.',
      keywords: 'adv-class-matrix adv-matrix-dot advanced filters per category',
      render: () => (
        <div style={{ maxWidth: 195 }}>
          <AdvancedClassMatrix />
        </div>
      ),
    },
    {
      name: 'Selected tags',
      description: 'A chosen car or track, with a remove button. Long names truncate rather than wrap, so the sidebar column never widens.',
      keywords: 'selected-tag tag-remove selected-tags',
      render: () => (
        <div style={{ maxWidth: 195 }}>
          <div className="selected-tags">
            <span className="selected-tag">
              <span className="selected-tag-label">Porsche 911 GT3 R</span>
              <button className="tag-remove" title="Remove">&times;</button>
            </span>
            <span className="selected-tag">
              <span className="selected-tag-label">Circuit de Spa-Francorchamps</span>
              <button className="tag-remove" title="Remove">&times;</button>
            </span>
          </div>
        </div>
      ),
    },
  ],
};
