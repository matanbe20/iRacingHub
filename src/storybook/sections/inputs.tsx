import React, { useState } from 'react';
import AutocompleteFilter from '../../components/AutocompleteFilter';
import CheckRow from '../../components/CheckRow';
import SearchBox from '../../components/SearchBox';
import ThemeMockup from '../../components/ThemeMockup';
import useStore from '../../store/useStore';
import { ALL_CARS } from '../../utils/catalog';
import { Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

/** A working autocomplete with its own selection, so the story is safe to click. */
function AutocompleteDemo({ type }: { type: 'car' | 'track' }) {
  const [items, setItems] = useState<Set<string>>(new Set());
  return (
    <AutocompleteFilter
      type={type}
      activeItems={items}
      onAdd={v => setItems(prev => new Set([...prev, v]))}
      onRemove={v => setItems(prev => { const next = new Set(prev); next.delete(v); return next; })}
    />
  );
}

function CheckRowDemo() {
  const [checked, setChecked] = useState<Set<string>>(new Set([ALL_CARS[1]]));
  const rows = ALL_CARS.slice(0, 4);
  return (
    <div>
      {rows.map((name, i) => (
        <CheckRow
          key={name}
          name={name}
          checked={i === 3 ? true : checked.has(name)}
          locked={i === 3}
          onToggle={() => setChecked(prev => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name); else next.add(name);
            return next;
          })}
        >
          {i === 0 && <span className="list-badge list-badge--sched">My Schedule</span>}
          {i !== 3 && <span className="check-row-price">$11.95</span>}
          {i === 3 && <span className="list-badge list-badge--owned">Owned</span>}
        </CheckRow>
      ))}
    </div>
  );
}

function SegmentedDemo() {
  const timeFormat = useStore(s => s.timeFormat);
  const setTimeFormat = useStore(s => s.setTimeFormat);
  return (
    <div className="settings-seg">
      <button className={'settings-seg-btn' + (timeFormat === '24h' ? ' active' : '')} onClick={() => setTimeFormat('24h')}>24-hour</button>
      <button className={'settings-seg-btn' + (timeFormat === '12h' ? ' active' : '')} onClick={() => setTimeFormat('12h')}>12-hour</button>
    </div>
  );
}

export const inputs: StorySection = {
  id: 'inputs',
  title: 'Inputs & controls',
  blurb: 'Text entry, selection and settings controls. All of them are live here - the page keeps its own throwaway state.',
  stories: [
    {
      name: 'SearchBox',
      description: 'The header search. While it is empty and unfocused, a typewriter cycles real search examples through the placeholder; typing replaces that with a clear button. Press / anywhere in the app to land here.',
      keywords: 'search-box typewriter placeholder search-clear',
      render: () => (
        <>
          <SearchBox />
          <Note>Bound to the real filter state - clearing it after typing restores the animation.</Note>
        </>
      ),
    },
    {
      name: 'AutocompleteFilter',
      description: 'Type-ahead over the season\'s cars or tracks, with each pick kept as a removable tag. Both lists come from one shared catalog, so a name offered here is a name the Buy Guide can price.',
      keywords: 'autocomplete dropdown selected-tag list-search--block cars tracks',
      render: () => (
        <Variants layout="stack">
          <Variant label="Cars" wide><AutocompleteDemo type="car" /></Variant>
          <Variant label="Tracks" wide><AutocompleteDemo type="track" /></Variant>
        </Variants>
      ),
    },
    {
      name: 'CheckRow',
      description: 'One row of a long content list - the shared body of My Garage and the Buy Guide. A locked row is content you already own: shown ticked and greyed, with nothing to decide. The native checkbox stays in the DOM for keyboard and screen-reader users.',
      keywords: 'check-row check-box checked locked garage buy item',
      render: () => <CheckRowDemo />,
    },
    {
      name: 'Search fields',
      description: 'One search style, two widths: the toolbar version flexes beside its buttons, the block version fills a sidebar column and joins the dropdown beneath it.',
      keywords: 'list-search list-search--block focus',
      render: () => (
        <Variants layout="stack">
          <Variant label="In a toolbar" wide>
            <div className="list-toolbar" style={{ padding: 0 }}>
              <input className="list-search" placeholder="Search cars…" />
            </div>
          </Variant>
          <Variant label="In the sidebar" wide>
            <div style={{ maxWidth: 195 }}>
              <input className="list-search list-search--block" placeholder="Search tracks…" />
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Settings controls',
      description: 'The three kinds of control in the Settings modal: a segmented switch, a native select for the ~430 timezones, and a plain checkbox. All of them write through immediately - the modal has no Apply step.',
      keywords: 'settings-seg settings-select settings-check timezone clock',
      render: () => (
        <Variants layout="stack">
          <Variant label="Segmented" wide><SegmentedDemo /></Variant>
          <Variant label="Select" wide>
            <select className="settings-select" defaultValue="Europe/Berlin">
              <option>Auto - Europe/Berlin</option>
              <option>Europe/Berlin (GMT+2)</option>
              <option>America/New York (GMT-4)</option>
            </select>
          </Variant>
          <Variant label="Checkbox" wide>
            <label className="settings-check">
              <input type="checkbox" defaultChecked /> Show race times &amp; countdowns
            </label>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'ThemeMockup',
      description: 'The theme chooser\'s preview: a miniature of the page drawn in SVG, with palettes mirroring the real CSS variables. Cheaper and sharper than a screenshot, and it can never fall out of date with a rebuild.',
      keywords: 'theme-mockup dark light preview settings-theme svg',
      render: () => (
        <div className="settings-themes">
          {(['dark', 'light'] as const).map(variant => (
            <button key={variant} type="button" className={'settings-theme' + (variant === 'dark' ? ' active' : '')}>
              <ThemeMockup variant={variant} />
              <span className="settings-theme-name">
                {variant === 'dark' ? 'Dark' : 'Light'}
                {variant === 'dark' && <span className="settings-theme-check">&#10003;</span>}
              </span>
            </button>
          ))}
        </div>
      ),
    },
  ],
};
