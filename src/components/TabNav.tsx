import React from 'react';
import useStore from '../store/useStore';
import { IconBookmark, IconCalendar, IconCart, IconGrid, IconTrophy } from './icons';
import type { Tab } from '../types';
import { SPECIAL_EVENTS } from '../data/special-events';

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: 'all',    label: 'All Series',     icon: <IconGrid /> },
  { id: 'week',   label: 'By Week',        icon: <IconCalendar /> },
  { id: 'my',     label: 'My Schedule',    icon: <IconBookmark /> },
  { id: 'buy',    label: 'Buy Guide',      icon: <IconCart /> },
  { id: 'events', label: 'Special Events', icon: <IconTrophy /> },
];

export default function TabNav() {
  const activeTab = useStore(s => s.activeTab);
  const setActiveTab = useStore(s => s.setActiveTab);
  const mySchedule = useStore(s => s.mySchedule);
  const count = Object.keys(mySchedule).length;

  const now = new Date();
  const hasLiveEvent = SPECIAL_EVENTS.some(e => {
    if (!e.startDate) return false;
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    end.setHours(4, 0, 0, 0);
    return now >= start && now <= end;
  });

  return (
    <div className="tab-nav">
      <div className="tab-nav-inner">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={'tab-btn' + (activeTab === tab.id ? ' active' : '')}
            id={'tab-' + tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}{tab.label}
            {tab.id === 'my' && (
              <>
                {' '}
                <span className="tab-badge" id="my-schedule-count">
                  {count > 0 ? String(count) : ''}
                </span>
              </>
            )}
            {tab.id === 'events' && hasLiveEvent && <span className="tab-live-dot" />}
          </button>
        ))}
      </div>
    </div>
  );
}
