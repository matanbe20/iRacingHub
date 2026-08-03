import React, { useEffect, useMemo, useState } from 'react';
import useStore from '../store/useStore';
import Toast from '../components/Toast';
import { IconGear, IconSearch, IconX } from '../components/icons';
import { StoryCard, slug } from './Story';
import { badges } from './sections/badges';
import { buttons } from './sections/buttons';
import { cards } from './sections/cards';
import { filters } from './sections/filters';
import { foundations } from './sections/foundations';
import { icons } from './sections/icons';
import { inputs } from './sections/inputs';
import { navigation } from './sections/navigation';
import { overlays } from './sections/overlays';
import { states } from './sections/states';
import type { StorySection } from './Story';

const SECTIONS: StorySection[] = [
  foundations, icons, badges, buttons, inputs, cards, filters, navigation, overlays, states,
];

function matches(query: string, section: StorySection, storyIndex: number): boolean {
  if (!query) return true;
  const story = section.stories[storyIndex];
  const haystack = [
    section.title, story.name, story.description ?? '', story.keywords ?? '',
  ].join(' ').toLowerCase();
  return query.toLowerCase().split(/\s+/).every(term => haystack.includes(term));
}

export default function Storybook() {
  const theme = useStore(s => s.theme);
  const toggleTheme = useStore(s => s.toggleTheme);
  const [query, setQuery] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // The target of a #story-… link does not exist until the first render, so the
  // browser's own jump misses it.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  const visible = useMemo(
    () => SECTIONS
      .map(section => ({
        section,
        stories: section.stories.filter((_, i) => matches(query, section, i)),
      }))
      .filter(entry => entry.stories.length > 0),
    [query],
  );

  const storyCount = SECTIONS.reduce((n, s) => n + s.stories.length, 0);
  const shownCount = visible.reduce((n, e) => n + e.stories.length, 0);

  return (
    <div className="sb-root">
      <header className="sb-topbar">
        <button
          className="sb-nav-toggle"
          onClick={() => setNavOpen(o => !o)}
          aria-label="Toggle section list"
        >
          ☰
        </button>
        <div className="sb-brand">
          <span className="sb-brand-name"><span>iRacing</span> Hub</span>
          <span className="sb-brand-sub">Storybook</span>
        </div>

        <div className="sb-search">
          <IconSearch className="sb-search-icon" />
          <input
            className="sb-search-input"
            placeholder="Filter components…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Filter components"
          />
          {query && (
            <button className="sb-search-clear" onClick={() => setQuery('')} aria-label="Clear filter">
              <IconX />
            </button>
          )}
        </div>

        <span className="sb-count">{shownCount} / {storyCount}</span>
        <button className="sb-topbar-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☾ Dark' : '☀ Light'}
        </button>
        <a className="sb-topbar-btn" href="/" title="Back to the app">
          <IconGear size={13} /> Open app
        </a>
      </header>

      <div className="sb-layout">
        <nav className={'sb-nav' + (navOpen ? ' sb-nav--open' : '')} onClick={() => setNavOpen(false)}>
          {visible.map(({ section, stories }) => (
            <div className="sb-nav-group" key={section.id}>
              <a className="sb-nav-section" href={'#' + section.id}>{section.title}</a>
              {stories.map(story => (
                <a className="sb-nav-story" key={story.name} href={'#story-' + slug(story.name)}>
                  {story.name}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <main className="sb-main">
          <div className="sb-intro">
            <h1>Component gallery</h1>
            <p>
              Every piece iRacingHub is built from, rendered from the same components and stylesheet
              as the app itself - so if it looks right here, it looks right there. Demo content is
              taken from the live season schedule.
            </p>
            <p className="sb-intro-warn">
              Nothing on this page is saved. Your schedule, garage, theme and settings are untouched
              no matter what you click.
            </p>
          </div>

          {visible.length === 0 && (
            <div className="no-results">
              Nothing matches “{query}”<br />
              <span className="no-results-hint">Try a component name, a CSS class, or a word from its description</span>
            </div>
          )}

          {visible.map(({ section, stories }) => (
            <section className="sb-section" id={section.id} key={section.id}>
              <div className="sb-section-head">
                <h2>{section.title}</h2>
                {section.blurb && <p>{section.blurb}</p>}
              </div>
              {stories.map(story => <StoryCard story={story} key={story.name} />)}
            </section>
          ))}
        </main>
      </div>

      <Toast />
    </div>
  );
}
