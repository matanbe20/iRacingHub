import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import Modal from './Modal';
import type { Tab } from '../types';

const TABS: Tab[] = ['all', 'week', 'my', 'buy', 'events'];

const SHORTCUTS: Array<{ keys: string[]; label: string }> = [
  { keys: ['/'], label: 'Focus search' },
  { keys: ['1', '2', '3', '4', '5'], label: 'Switch tab' },
  { keys: ['←', '→'], label: 'Change week (By Week tab)' },
  { keys: ['t'], label: 'Toggle theme' },
  { keys: ['s'], label: 'Open settings' },
  { keys: ['?'], label: 'Toggle this help' },
  { keys: ['Esc'], label: 'Close overlay / drawer' },
];

export default function KeyboardShortcuts() {
  const setActiveTab = useStore(s => s.setActiveTab);
  const activeTab = useStore(s => s.activeTab);
  const selectedWeek = useStore(s => s.selectedWeek);
  const setSelectedWeek = useStore(s => s.setSelectedWeek);
  const toggleTheme = useStore(s => s.toggleTheme);
  const closeDrawer = useStore(s => s.closeDrawer);
  const openSettingsModal = useStore(s => s.openSettingsModal);
  const closeSettingsModal = useStore(s => s.closeSettingsModal);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
        || el.tagName === 'SELECT' || el.isContentEditable);

      if (e.key === 'Escape') { setHelpOpen(false); closeDrawer(); closeSettingsModal(); return; }
      if (typing) return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          document.getElementById('search')?.focus();
          break;
        case '1': case '2': case '3': case '4': case '5':
          setActiveTab(TABS[Number(e.key) - 1]);
          break;
        case 't':
          toggleTheme();
          break;
        case 's':
          openSettingsModal();
          break;
        case '?':
          setHelpOpen(o => !o);
          break;
        case 'ArrowLeft':
          if (activeTab === 'week') setSelectedWeek(Math.max(1, selectedWeek - 1));
          break;
        case 'ArrowRight':
          if (activeTab === 'week') setSelectedWeek(Math.min(12, selectedWeek + 1));
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTab, selectedWeek, setActiveTab, setSelectedWeek, toggleTheme, closeDrawer, openSettingsModal, closeSettingsModal]);

  if (!helpOpen) return null;

  return (
    <Modal title="Keyboard Shortcuts" onClose={() => setHelpOpen(false)} size="sm">
      {SHORTCUTS.map(s => (
        <div className="shortcut-row" key={s.label}>
          <span className="shortcut-keys">
            {s.keys.map((k, i) => (
              <React.Fragment key={k}>
                {i > 0 && <span className="shortcut-or">/</span>}
                <kbd className="kbd">{k}</kbd>
              </React.Fragment>
            ))}
          </span>
          <span className="shortcut-label">{s.label}</span>
        </div>
      ))}
    </Modal>
  );
}
