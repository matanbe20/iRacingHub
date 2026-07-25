import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { ALL_CATEGORIES, ALL_CLASSES } from '../store/useStore';
import CategoryFilters from './CategoryFilters';
import ClassFilters from './ClassFilters';
import AdvancedClassMatrix from './AdvancedClassMatrix';
import AutocompleteFilter from './AutocompleteFilter';
import { IconDiscord, IconGarageOutline } from './icons';

export default function FilterSidebar() {
  const [rainbowGarage, setRainbowGarage] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setRainbowGarage(false), 10000);
    return () => clearTimeout(t1);
  }, []);

  const activeCategories = useStore(s => s.activeCategories);
  const activeClasses = useStore(s => s.activeClasses);
  const searchQuery = useStore(s => s.searchQuery);
  const activeCars = useStore(s => s.activeCars);
  const activeTracks = useStore(s => s.activeTracks);
  const isDrawerOpen = useStore(s => s.isDrawerOpen);
  const closeDrawer = useStore(s => s.closeDrawer);
  const clearAllFilters = useStore(s => s.clearAllFilters);
  const clearCarFilter = useStore(s => s.clearCarFilter);
  const clearTrackFilter = useStore(s => s.clearTrackFilter);
  const addCarFilter = useStore(s => s.addCarFilter);
  const removeCarFilter = useStore(s => s.removeCarFilter);
  const addTrackFilter = useStore(s => s.addTrackFilter);
  const removeTrackFilter = useStore(s => s.removeTrackFilter);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const filterOwnedCars = useStore(s => s.filterOwnedCars);
  const filterOwnedTracks = useStore(s => s.filterOwnedTracks);
  const toggleFilterOwnedCars = useStore(s => s.toggleFilterOwnedCars);
  const toggleFilterOwnedTracks = useStore(s => s.toggleFilterOwnedTracks);
  const openGarageModal = useStore(s => s.openGarageModal);
  const classFilterAdvanced = useStore(s => s.classFilterAdvanced);
  const advancedClassMap = useStore(s => s.advancedClassMap);
  const toggleClassFilterAdvanced = useStore(s => s.toggleClassFilterAdvanced);

  const classesDefault = classFilterAdvanced
    ? ALL_CATEGORIES.every(cat => ALL_CLASSES.every(cls => (advancedClassMap[cat] ?? new Set(ALL_CLASSES)).has(cls)))
    : ALL_CLASSES.every(c => activeClasses.has(c));

  const allDefault =
    ALL_CATEGORIES.every(c => activeCategories.has(c)) &&
    classesDefault &&
    activeCars.size === 0 &&
    activeTracks.size === 0 &&
    !searchQuery &&
    !filterOwnedCars &&
    !filterOwnedTracks;

  return (
    <>
      <aside className={'filter-sidebar' + (isDrawerOpen ? ' drawer-open' : '')} id="filter-sidebar">

        <div className="adv-toggle-row">
          <button
            className={'adv-toggle-btn' + (classFilterAdvanced ? ' active' : '')}
            onClick={toggleClassFilterAdvanced}
          >
            <span className="adv-toggle-label">Advanced Filters</span>
            <span className="adv-toggle-chevron">{classFilterAdvanced ? '▲' : '▼'}</span>
          </button>
          <button
            className={'filter-clear-btn' + (!allDefault ? ' visible' : '')}
            id="all-clear-btn"
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        </div>

        {classFilterAdvanced ? (
          <div className="filter-section">
            <AdvancedClassMatrix />
          </div>
        ) : (
          <>
            <div className="filter-section">
              <div className="filter-section-header">Type</div>
              <CategoryFilters />
            </div>

            <div className="filter-section">
              <div className="filter-section-header">Class</div>
              <ClassFilters />
            </div>
          </>
        )}

        <div className="filter-section">
          <div className="filter-section-header">
            Car
            <button
              className={'filter-clear-btn' + (activeCars.size > 0 ? ' visible' : '')}
              id="car-clear-btn"
              onClick={clearCarFilter}
            >
              Clear
            </button>
          </div>
          <AutocompleteFilter
            type="car"
            activeItems={activeCars}
            onAdd={addCarFilter}
            onRemove={removeCarFilter}
          />
        </div>

        <div className="filter-section">
          <div className="filter-section-header">
            Track
            <button
              className={'filter-clear-btn' + (activeTracks.size > 0 ? ' visible' : '')}
              id="track-clear-btn"
              onClick={clearTrackFilter}
            >
              Clear
            </button>
          </div>
          <AutocompleteFilter
            type="track"
            activeItems={activeTracks}
            onAdd={addTrackFilter}
            onRemove={removeTrackFilter}
          />
        </div>

        <div className="filter-section">
          <div className="filter-section-header">
            My Garage
            <span className="garage-open-counts">{ownedCars.size}c / {ownedTracks.size}t</span>
          </div>
          <div className="garage-layout">
            <button className={'garage-open-btn' + (rainbowGarage ? ' rainbow' : '')} onClick={openGarageModal} title="Manage My Garage">
              <IconGarageOutline />
              Manage
            </button>
            <div className="garage-filter-row">
              <button
                className={'garage-filter-btn garage-filter-btn--cars' + (filterOwnedCars ? ' active' : '')}
                onClick={toggleFilterOwnedCars}
                disabled={ownedCars.size === 0}
                title="Show only series where you own a car"
              >
                {filterOwnedCars ? '✓ ' : ''}Cars
              </button>
              <button
                className={'garage-filter-btn garage-filter-btn--tracks' + (filterOwnedTracks ? ' active' : '')}
                onClick={toggleFilterOwnedTracks}
                disabled={ownedTracks.size === 0}
                title="Show only series where you own the track"
              >
                {filterOwnedTracks ? '✓ ' : ''}Tracks
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-support-btns">
          <a
            href="https://discord.gg/J7QpTFt2zA"
            target="_blank"
            rel="noreferrer"
            className="discord-sidebar-btn"
            aria-label="Join Discord"
          >
            <IconDiscord />
            Join My Discord
          </a>
          <a
            href="https://ko-fi.com/matanbm91"
            target="_blank"
            rel="noreferrer"
            className="kofi-sidebar-btn"
            aria-label="Buy Me a Coffee"
          >
            <img src="https://storage.ko-fi.com/cdn/logomarkLogo.png" alt="Ko-fi" width="20" height="20" style={{objectFit:'contain'}} />
            Buy me a coffee
          </a>
        </div>
      </aside>

      <div
        className={'drawer-overlay' + (isDrawerOpen ? ' visible' : '')}
        id="drawer-overlay"
        onClick={closeDrawer}
      />
    </>
  );
}
