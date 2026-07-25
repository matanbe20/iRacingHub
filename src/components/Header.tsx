import React from 'react';
import useStore from '../store/useStore';
import { SEASON_LABEL, SEASON_DATES } from '../data';
import { ALL_CATEGORIES, ALL_CLASSES } from '../store/useStore';
import SearchBox from './SearchBox';

const GEAR_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

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
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 127.14 96.36" fill="#5865F2">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
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
            {GEAR_SVG}
          </button>
        </div>
      </div>
    </div>
  );
}
