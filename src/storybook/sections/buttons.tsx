import React, { useState } from 'react';
import ExportButtons from '../../components/ExportButtons';
import ViewToggle from '../../components/ViewToggle';
import { IconCar, IconGarageOutline, IconGrid, IconList, IconTrack } from '../../components/icons';
import { Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

const noop = (e: React.MouseEvent) => e.preventDefault();

/** Live so the story shows the switch actually switching, not a frozen state. */
function ViewToggleDemo() {
  const [view, setView] = useState<'card' | 'list'>('card');
  return (
    <ViewToggle
      value={view}
      onChange={setView}
      options={[
        { value: 'card', label: 'Card view', icon: <IconGrid /> },
        { value: 'list', label: 'List view', icon: <IconList /> },
      ]}
    />
  );
}

export const buttons: StorySection = {
  id: 'buttons',
  title: 'Buttons',
  blurb: 'Every button in the app, with its active and disabled states. Anything that adds to My Schedule is green once added - that colour means "saved" throughout.',
  stories: [
    {
      name: 'Add to schedule',
      description: 'The three sizes of "save this race": a whole series at once, a single week in the grid, and the round button on a By Week card. All flip to green with a tick when saved.',
      keywords: 'series-add-btn week-add-btn added save schedule',
      render: () => (
        <Variants layout="stack">
          <Variant label="Whole series" wide>
            <div className="sb-inline">
              <button className="series-add-btn" onClick={noop}>+ All</button>
              <button className="series-add-btn added" onClick={noop}>✓ All</button>
            </div>
          </Variant>
          <Variant label="Single week" wide>
            <div className="sb-inline">
              <button className="week-add-btn" onClick={noop}>+</button>
              <button className="week-add-btn added" onClick={noop}>✓</button>
            </div>
          </Variant>
          <Variant label="Favourite (By Week)" wide>
            <div className="sb-inline">
              <button className="tw-fav-btn" onClick={noop}>☆</button>
              <button className="tw-fav-btn active" onClick={noop}>★</button>
            </div>
          </Variant>
          <Variant label="Remove (My Schedule)" wide>
            <button className="my-race-remove" onClick={noop} title="Remove">&#x2715;</button>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Filter buttons',
      description: 'Category and class filters are styled as their badges so the sidebar reads as the same vocabulary as the cards. Inactive means "excluded", not "unstyled" - hence the dimming rather than an outline.',
      keywords: 'filter-btn cat-filters class-filters active',
      render: () => (
        <Variants layout="stack">
          <Variant label="Category - active / inactive" wide>
            <div className="filter-group" id="cat-filters">
              <button className="filter-btn cat-sports active">Sports Car</button>
              <button className="filter-btn cat-formula active">Formula</button>
              <button className="filter-btn cat-oval">Oval</button>
              <button className="filter-btn cat-dirt-road">Dirt Road</button>
            </div>
          </Variant>
          <Variant label="Class - active / inactive" wide>
            <div className="filter-group" id="class-filters">
              <button className="filter-btn active" data-cls="R">R</button>
              <button className="filter-btn active" data-cls="D">D</button>
              <button className="filter-btn" data-cls="C">C</button>
              <button className="filter-btn active" data-cls="B">B</button>
              <button className="filter-btn" data-cls="A">A</button>
            </div>
          </Variant>
          <Variant label="Clear (appears only when a filter is set)" wide>
            <div className="sb-inline">
              <button className="filter-clear-btn visible">Clear all</button>
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Week selector',
      description: 'The twelve weeks of a season. The selected week is filled; the week racing right now keeps a ring even when another is selected, so you never lose your place.',
      keywords: 'week-btn week-selector current active',
      render: () => (
        <div className="week-selector">
          <span className="week-selector-label">Week</span>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
            <button key={w} className={'week-btn' + (w === 4 ? ' active' : '') + (w === 6 ? ' current' : '')}>{w}</button>
          ))}
        </div>
      ),
    },
    {
      name: 'Toolbar buttons',
      description: 'The row above a content list. One accented button per toolbar marks the suggested action; the rest stay quiet. Disabled when the action has nothing to work on - no saved races, no smart select.',
      keywords: 'toolbar-btn accent disabled toolbar-check show owned',
      render: () => (
        <div className="list-toolbar">
          <input className="list-search" placeholder="Search tracks…" readOnly />
          <button className="toolbar-btn toolbar-btn--accent">⚡ My Schedule</button>
          <button className="toolbar-btn">Select all</button>
          <button className="toolbar-btn">Clear</button>
          <button className="toolbar-btn" disabled>Disabled</button>
          <label className="toolbar-check">
            <input type="checkbox" defaultChecked /> Show owned
          </label>
        </div>
      ),
    },
    {
      name: 'Sub-tabs',
      description: 'Two-way switch inside a panel or modal, with a count of what is selected on each side. The count chip hides itself while empty.',
      keywords: 'sub-tab-btn sub-tab-count garage buy guide tracks cars',
      render: () => (
        <div className="sub-tabs">
          <button className="sub-tab-btn active"><IconTrack />Tracks <span className="sub-tab-count">3</span></button>
          <button className="sub-tab-btn"><IconCar />Cars <span className="sub-tab-count" /></button>
        </div>
      ),
    },
    {
      name: 'Modal actions',
      description: 'Footer buttons. One filled confirm per modal, a quiet cancel beside it, and the full-width "add everything" used by the two shared-link modals.',
      keywords: 'modal-confirm-btn modal-cancel-btn modal-add-all-btn modal-add-btn garage-share-btn',
      render: () => (
        <Variants layout="stack">
          <Variant label="Confirm / cancel / share" wide>
            <div className="sb-inline">
              <button className="modal-confirm-btn">Save</button>
              <button className="modal-cancel-btn">Cancel</button>
              <button className="garage-share-btn">Share Garage</button>
              <button className="garage-share-btn copied">✓ Copied!</button>
            </div>
          </Variant>
          <Variant label="Add all - available / everything already added" wide>
            <button className="modal-add-all-btn">+ Add All (4)</button>
            <div style={{ height: 8 }} />
            <button className="modal-add-all-btn" disabled>✓ All Added</button>
          </Variant>
          <Variant label="Add one row" wide>
            <div className="sb-inline">
              <button className="modal-add-btn">+</button>
              <button className="modal-add-btn added" disabled>✓</button>
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'ExportButtons',
      description: 'The My Schedule toolbar: copy a share link, or download the schedule as CSV, an .ics calendar, or a PDF. The PDF button loads the renderer on demand and shows its own progress, since that import is heavy.',
      keywords: 'export-btn share csv ics pdf download',
      render: () => (
        <>
          <ExportButtons />
          <Note>Share copies a URL onto the clipboard; the downloads act on whatever is in My Schedule.</Note>
        </>
      ),
    },
    {
      name: 'Icon & link buttons',
      description: 'Header controls, the garage opener, the view switcher and the outbound links.',
      keywords: 'header-icon-btn garage-open-btn garage-filter-btn view-toggle view-btn discord kofi',
      render: () => (
        <Variants layout="stack">
          <Variant label="Garage (sidebar)" wide>
            <div className="garage-layout">
              <button className="garage-open-btn"><IconGarageOutline />Manage</button>
              <div className="garage-filter-row">
                <button className="garage-filter-btn garage-filter-btn--cars active">✓ Cars</button>
                <button className="garage-filter-btn garage-filter-btn--tracks">Tracks</button>
              </div>
            </div>
          </Variant>
          <Variant label="ViewToggle - All Series and Special Events" wide>
            <ViewToggleDemo />
          </Variant>
          <Variant label="Advanced filters toggle" wide>
            <div className="adv-toggle-row">
              <button className="adv-toggle-btn">
                <span className="adv-toggle-label">Advanced Filters</span>
                <span className="adv-toggle-chevron">▼</span>
              </button>
            </div>
          </Variant>
          <Variant label="Buy on iRacing" wide>
            <button className="buy-iracing-btn">Buy on iRacing →</button>
          </Variant>
        </Variants>
      ),
    },
  ],
};
