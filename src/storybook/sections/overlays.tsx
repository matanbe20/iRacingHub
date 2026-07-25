import React, { useState } from 'react';
import Modal from '../../components/Modal';
import CheckRow from '../../components/CheckRow';
import useStore from '../../store/useStore';
import { ALL_CARS, ALL_TRACKS } from '../../utils/catalog';
import { shortDate } from '../../utils/helpers';
import { entryOf, sportsCarSeries, weekOf } from '../fixtures';
import { Note, Variant, Variants } from '../Story';
import type { ModalSize } from '../../components/Modal';
import type { StorySection } from '../Story';

const SIZES: Array<{ size: ModalSize; label: string; used: string }> = [
  { size: 'sm', label: 'Small · 420px', used: 'Keyboard shortcuts' },
  { size: 'md', label: 'Medium · 540px', used: 'Shared schedule, shared garage' },
  { size: 'lg', label: 'Large · 640px', used: 'My Garage, Settings' },
];

function ModalSizeDemo() {
  const [open, setOpen] = useState<ModalSize | null>(null);
  return (
    <>
      <div className="sb-inline">
        {SIZES.map(s => (
          <button key={s.size} className="toolbar-btn" onClick={() => setOpen(s.size)}>{s.label}</button>
        ))}
      </div>
      {open && (
        <Modal
          title={SIZES.find(s => s.size === open)!.label}
          size={open}
          onClose={() => setOpen(null)}
          footer={
            <>
              <span className="sb-muted">Escape, the backdrop and ✕ all close it</span>
              <div className="modal-footer-right">
                <button className="modal-cancel-btn" onClick={() => setOpen(null)}>Cancel</button>
                <button className="modal-confirm-btn" onClick={() => setOpen(null)}>Save</button>
              </div>
            </>
          }
        >
          <p>Used by: {SIZES.find(s => s.size === open)!.used}.</p>
          <p className="sb-muted" style={{ marginTop: '0.75rem' }}>
            The shell owns the backdrop, the header, scroll locking and Escape. Each modal supplies
            only its own body, optional chrome under the header, and footer actions.
          </p>
        </Modal>
      )}
    </>
  );
}

/** A stand-in for My Garage: the real one edits the visitor's saved garage. */
function GarageLikeModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'cars' | 'tracks'>('cars');
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const items = (tab === 'cars' ? ALL_CARS : ALL_TRACKS).slice(0, 18);
  return (
    <Modal
      title="Content list modal"
      size="lg"
      onClose={onClose}
      flushBody
      chrome={
        <>
          <div className="sub-tabs">
            <button className={'sub-tab-btn' + (tab === 'cars' ? ' active' : '')} onClick={() => setTab('cars')}>
              Cars <span className="sub-tab-count">{picked.size || ''}</span>
            </button>
            <button className={'sub-tab-btn' + (tab === 'tracks' ? ' active' : '')} onClick={() => setTab('tracks')}>
              Tracks <span className="sub-tab-count" />
            </button>
          </div>
          <div className="list-toolbar">
            <input className="list-search" placeholder={'Search ' + tab + '…'} />
            <button className="toolbar-btn toolbar-btn--accent">Free defaults</button>
            <button className="toolbar-btn">All</button>
            <button className="toolbar-btn">None</button>
          </div>
          <div className="garage-modal-summary">{picked.size} / {items.length} {tab} selected</div>
        </>
      }
      footer={
        <>
          <button className="garage-share-btn">Share Garage</button>
          <div className="modal-footer-right">
            <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button className="modal-confirm-btn" onClick={onClose}>Save</button>
          </div>
        </>
      }
    >
      {items.map(name => (
        <CheckRow
          key={name}
          name={name}
          checked={picked.has(name)}
          onToggle={() => setPicked(prev => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name); else next.add(name);
            return next;
          })}
        />
      ))}
    </Modal>
  );
}

function GarageLikeDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="toolbar-btn" onClick={() => setOpen(true)}>Open content-list modal</button>
      {open && <GarageLikeModal onClose={() => setOpen(false)} />}
    </>
  );
}

function ToastDemo() {
  const showToast = useStore(s => s.showToast);
  return (
    <div className="sb-inline">
      <button className="toolbar-btn" onClick={() => showToast('3 races added to your schedule')}>Show a toast</button>
      <Note>Appears bottom-centre and clears itself after 3.5s.</Note>
    </div>
  );
}

function SharedRowDemo() {
  const entry = entryOf(sportsCarSeries, weekOf(sportsCarSeries));
  return (
    <div className="my-week-group">
      <div className="my-week-label">Week {entry.weekNum} — {shortDate(entry.date)}</div>
      <div className="my-race-card">
        <span className="cat-badge sports">Sports Car</span>
        <span className="class-badge A">A</span>
        <div className="my-race-info">
          <div className="my-race-title">{entry.displayName}</div>
          <div className="my-race-meta">{[entry.track, entry.laps, entry.cars].filter(Boolean).join(' · ')}</div>
        </div>
        <button className="modal-add-btn">+</button>
      </div>
    </div>
  );
}

export const overlays: StorySection = {
  id: 'overlays',
  title: 'Overlays & feedback',
  blurb: 'One modal shell behind every dialog in the app, plus the transient feedback that needs no dialog at all.',
  stories: [
    {
      name: 'Modal',
      description: 'The shared shell. Three widths, a header with a close button, an optional chrome strip under it for tabs and toolbars, a scrolling body and an optional footer. Closing behaves identically everywhere: ✕, the backdrop, or Escape.',
      keywords: 'modal modal-overlay modal-header modal-body modal-footer escape backdrop',
      render: () => <ModalSizeDemo />,
    },
    {
      name: 'Content-list modal',
      description: 'How My Garage and the Settings modal are assembled: sub-tabs and a toolbar in the chrome slot, an edge-to-edge list in a flush body, and confirm actions in the footer. This is a copy — the real My Garage writes to your saved garage.',
      keywords: 'garage modal chrome flush sub-tabs check-row summary',
      render: () => <GarageLikeDemo />,
    },
    {
      name: 'Shared schedule row',
      description: 'What arrives when someone opens a shared link: each race from the link with an add button, plus an "Add All" in the footer that reports how many are new.',
      keywords: 'share modal shared schedule modal-add-btn my-race-card',
      render: () => <SharedRowDemo />,
    },
    {
      name: 'Toast',
      description: 'Confirmation for actions with no visible result of their own — merging a shared garage, queueing content for the Buy Guide. Never used for errors, which the affected control shows in place.',
      keywords: 'toast toast-visible showToast feedback',
      render: () => <ToastDemo />,
    },
    {
      name: 'Keyboard shortcuts',
      description: 'The help sheet behind "?", and the key caps it is built from.',
      keywords: 'kbd shortcut-row shortcut-keys help',
      render: () => (
        <Variants layout="stack">
          <Variant label="Rows" wide>
            {[
              [['/'], 'Focus search'],
              [['1', '2', '3', '4', '5'], 'Switch tab'],
              [['←', '→'], 'Change week (By Week tab)'],
              [['Esc'], 'Close overlay / drawer'],
            ].map(([keys, label]) => (
              <div className="shortcut-row" key={label as string}>
                <span className="shortcut-keys">
                  {(keys as string[]).map((k, i) => (
                    <React.Fragment key={k}>
                      {i > 0 && <span className="shortcut-or">/</span>}
                      <kbd className="kbd">{k}</kbd>
                    </React.Fragment>
                  ))}
                </span>
                <span className="shortcut-label">{label as string}</span>
              </div>
            ))}
          </Variant>
          <Note>Press <kbd className="kbd">?</kbd> in the app to open the real sheet.</Note>
        </Variants>
      ),
    },
  ],
};
