import React from 'react';
import useStore from '../store/useStore';
import { SEASON_LABEL, SEASON_DATES } from '../data';
import { ALL_CATEGORIES, ALL_CLASSES } from '../store/useStore';
import SearchBox from './SearchBox';
import { IconDiscord, IconGear } from './icons';

export default function Header() {
  const openSettingsModal = useStore(s => s.openSettingsModal);
  const openDrawer = useStore(s => s.openDrawer);
  const setActiveTab = useStore(s => s.setActiveTab);
  const activeCategories = useStore(s => s.activeCategories);
  const activeClasses = useStore(s => s.activeClasses);
  const activeCars = useStore(s => s.activeCars);
  const activeTracks = useStore(s => s.activeTracks);
  const searchQuery = useStore(s => s.searchQuery);
  const classFilterAdvanced = useStore(s => s.classFilterAdvanced);
  const advancedClassMap = useStore(s => s.advancedClassMap);

  const classFilterCount = classFilterAdvanced
    ? (ALL_CATEGORIES.some(cat =>
        !ALL_CLASSES.every(cls => (advancedClassMap[cat] ?? new Set(ALL_CLASSES)).has(cls))
      ) ? 1 : 0)
    : (ALL_CLASSES.every(c => activeClasses.has(c)) ? 0 : 1);

  const filterCount =
    (ALL_CATEGORIES.every(c => activeCategories.has(c)) ? 0 : 1) +
    classFilterCount +
    (activeCars.size > 0 ? activeCars.size : 0) +
    (activeTracks.size > 0 ? activeTracks.size : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="header">
      <div className="header-inner">
        <a
          href="https://discord.gg/brRFWVQk"
          target="_blank"
          rel="noreferrer"
          className="discord-mobile-btn"
          aria-label="Join Discord"
        >
          <IconDiscord size={28} />
        </a>
        <a
          href="https://ko-fi.com/matanbm91"
          target="_blank"
          rel="noreferrer"
          className="kofi-mobile-btn"
          aria-label="Buy Me a Coffee"
        >
          <img src="https://storage.ko-fi.com/cdn/logomarkLogo.png" alt="Ko-fi" />
        </a>
        <div className="header-left">
          <h1 className="site-title" onClick={() => setActiveTab('all')}><span>iRacing</span> Hub</h1>
          <p className="season-label" id="season-label">{SEASON_LABEL}</p>
          <p className="subtitle" id="season-dates">{SEASON_DATES}</p>
        </div>
        <div className="header-right">
          <SearchBox />
          <button
            className="mobile-filter-btn"
            id="mobile-filter-btn"
            onClick={openDrawer}
          >
            Filters{' '}
            <span id="filter-active-count">
              {filterCount > 0 ? String(filterCount) : ''}
            </span>
          </button>
          <button
            className="header-icon-btn"
            id="settings-toggle"
            onClick={openSettingsModal}
            title="Settings"
            aria-label="Settings"
          >
            <IconGear />
          </button>
        </div>
      </div>
    </div>
  );
}
