import React from 'react';
import Header from '../../components/Header';
import TabNav from '../../components/TabNav';
import { SEASON_DATES, SEASON_LABEL } from '../../data';
import { Frame, Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

export const navigation: StorySection = {
  id: 'navigation',
  title: 'Navigation',
  blurb: 'The page frame: identity and search up top, tabs beneath, both sticky. Their combined height is published as --sticky-height so sidebars and lists can size around it.',
  stories: [
    {
      name: 'Header',
      description: 'Site identity, the season it is showing, and search. On mobile the Discord and Ko-fi links move into the top corners and a Filters button appears with a count of what is applied.',
      keywords: 'header site-title season-label subtitle mobile-filter-btn settings-toggle',
      render: () => (
        <Frame>
          <Header />
        </Frame>
      ),
    },
    {
      name: 'TabNav',
      description: 'The five views. My Schedule carries a count of saved races; Special Events grows a green dot while an event is running. Keys 1–5 switch tabs from anywhere.',
      keywords: 'tab-nav tab-btn active tab-badge tab-live-dot',
      render: () => (
        <Frame>
          <TabNav />
        </Frame>
      ),
    },
    {
      name: 'Week navigation',
      description: 'Two shapes of the same control. Desktop lists all twelve weeks; mobile shows one week with arrows and dots, and the panel can be swiped left and right.',
      keywords: 'week-selector week-nav-mobile week-dots week-nav-arrow swipe',
      render: () => (
        <Variants layout="stack">
          <Variant label="Desktop" wide>
            <div className="week-selector">
              <span className="week-selector-label">Week</span>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
                <button key={w} className={'week-btn' + (w === 6 ? ' active' : '')}>{w}</button>
              ))}
            </div>
          </Variant>
          <Variant label="Mobile" wide>
            <Note>
              The arrows-and-dots version, and the swipeable panels behind it, are styled
              inside a max-width media query — narrow this window below 768px and the
              control above is replaced by it.
            </Note>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Season label',
      description: 'Which season the data belongs to. Sourced from the schedule file, so it changes with the data and never has to be edited by hand.',
      keywords: 'season-label subtitle season-dates',
      render: () => (
        <div className="header-left">
          <h1 className="site-title"><span>iRacing</span> Hub</h1>
          <p className="season-label">{SEASON_LABEL}</p>
          <p className="subtitle">{SEASON_DATES}</p>
        </div>
      ),
    },
  ],
};
