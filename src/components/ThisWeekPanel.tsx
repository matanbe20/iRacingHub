import React, { useEffect, useMemo, useRef, useState } from 'react';
import useStore from '../store/useStore';
import { SCHEDULE_DATA } from '../data';
import { ALL_CATEGORIES } from '../store/useStore';
import { catClass, catLabel, baseTrackName, getWeekDateRange } from '../utils/helpers';
import { getCurrentWeek } from '../utils/schedule';
import TwCard from './TwCard';
import type { Series, Week } from '../types';

const currentWeek = getCurrentWeek();

interface WeekContentProps {
  weekNum: number;
  activeCategories: Set<string>;
  activeClasses: Set<string>;
  searchQuery: string;
  activeCars: Set<string>;
  activeTracks: Set<string>;
  filterOwnedCars: boolean;
  filterOwnedTracks: boolean;
  ownedCars: Set<string>;
  ownedTracks: Set<string>;
  favorites: Set<string>;
}

const WeekContent = React.memo(function WeekContent(props: WeekContentProps) {
  const {
    weekNum, activeCategories, activeClasses, searchQuery,
    activeCars, activeTracks, filterOwnedCars, filterOwnedTracks,
    ownedCars, ownedTracks, favorites,
  } = props;

  const results = useMemo(() => {
    if (weekNum < 1 || weekNum > 12) return [];
    const q = searchQuery.toLowerCase();
    return SCHEDULE_DATA.filter(s => {
      if (!activeCategories.has(s.category)) return false;
      if (!activeClasses.has(s.class)) return false;
      if (activeCars.size > 0) {
        const seriesCars = s.cars.split(',').map(c => c.trim());
        if (!seriesCars.some(c => activeCars.has(c))) return false;
      }
      const week = s.weeks.find(w => w.week === weekNum);
      if (!week) return false;
      if (activeTracks.size > 0 && !activeTracks.has(baseTrackName(week.track))) return false;
      if (filterOwnedCars && ownedCars.size > 0) {
        const seriesCars = s.cars.split(',').map(c => c.trim());
        if (!seriesCars.some(c => ownedCars.has(c))) return false;
      }
      if (filterOwnedTracks && ownedTracks.size > 0 && !ownedTracks.has(baseTrackName(week.track))) return false;
      if (q) {
        const haystack = (s.name + ' ' + s.cars + ' ' + week.track + ' ' + (week.car || '')).toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).map(s => ({ s, week: s.weeks.find(w => w.week === weekNum) as Week }));
  }, [weekNum, activeCategories, activeClasses, searchQuery, activeCars, activeTracks, filterOwnedCars, filterOwnedTracks, ownedCars, ownedTracks]);

  if (weekNum < 1 || weekNum > 12) return null;

  const favResults = results.filter(r => favorites.has(r.s.name));
  const otherResults = results.filter(r => !favorites.has(r.s.name));
  const groups: Record<string, Array<{ s: Series; week: Week }>> = {};
  ALL_CATEGORIES.forEach(cat => { groups[cat] = []; });
  otherResults.forEach(r => groups[r.s.category].push(r));

  return (
    <>
      <div className="week-view-header">
        <span className="week-view-title">{getWeekDateRange(weekNum)}</span>
        <span className="week-view-count">{results.length} series</span>
      </div>
      {results.length === 0 ? (
        <div className="no-results">
          0 races this week match your filters<br />
          <span className="no-results-hint">Check the filters applied</span>
        </div>
      ) : (
        <>
          {favResults.length > 0 && (
            <div className="tw-category-group">
              <div className="tw-category-header tw-favorites-header">★ Favorites</div>
              {favResults.map(({ s, week }) => (
                <TwCard key={s.name} series={s} week={week} />
              ))}
            </div>
          )}
          {ALL_CATEGORIES.filter(cat => groups[cat].length > 0).map(cat => (
            <div key={cat} className="tw-category-group">
              <div className={'tw-category-header ' + catClass(cat)}>{catLabel(cat)}</div>
              {groups[cat].map(({ s, week }) => (
                <TwCard key={s.name} series={s} week={week} />
              ))}
            </div>
          ))}
        </>
      )}
    </>
  );
});

export default function ThisWeekPanel() {
  const activeCategories = useStore(s => s.activeCategories);
  const activeClasses = useStore(s => s.activeClasses);
  const searchQuery = useStore(s => s.searchQuery);
  const activeCars = useStore(s => s.activeCars);
  const activeTracks = useStore(s => s.activeTracks);
  const filterOwnedCars = useStore(s => s.filterOwnedCars);
  const filterOwnedTracks = useStore(s => s.filterOwnedTracks);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const favorites = useStore(s => s.favorites);
  const selectedWeek = useStore(s => s.selectedWeek);
  const setSelectedWeek = useStore(s => s.setSelectedWeek);

  const [dragOffset, setDragOffset] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);

  const selectedWeekRef = useRef(selectedWeek);
  selectedWeekRef.current = selectedWeek;
  const isSnappingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeDirRef = useRef<'h' | 'v' | null>(null);

  const snapToWeek = (targetWeek: number) => {
    if (targetWeek < 1 || targetWeek > 12 || isSnappingRef.current) return;
    const week = selectedWeekRef.current;
    if (targetWeek === week) return;
    const sign = targetWeek > week ? -1 : 1;
    isSnappingRef.current = true;
    setIsSnapping(true);
    setDragOffset(sign * window.innerWidth);
    setTimeout(() => {
      setSelectedWeek(targetWeek);
      setDragOffset(0);
      setIsSnapping(false);
      isSnappingRef.current = false;
    }, 280);
  };
  const snapToWeekRef = useRef(snapToWeek);
  snapToWeekRef.current = snapToWeek;

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (isSnappingRef.current) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      swipeDirRef.current = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isSnappingRef.current || touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (swipeDirRef.current === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        swipeDirRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      if (swipeDirRef.current === 'h') {
        e.preventDefault();
        const week = selectedWeekRef.current;
        // Rubber-band resistance at edges
        const atEdge = (week === 1 && dx > 0) || (week === 12 && dx < 0);
        setDragOffset(atEdge ? dx * 0.15 : dx);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isSnappingRef.current || touchStartX.current === null || swipeDirRef.current !== 'h') {
        touchStartX.current = null;
        touchStartY.current = null;
        swipeDirRef.current = null;
        return;
      }
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      touchStartY.current = null;
      swipeDirRef.current = null;
      const week = selectedWeekRef.current;
      if (dx < -50 && week < 12) {
        snapToWeekRef.current(week + 1);
      } else if (dx > 50 && week > 1) {
        snapToWeekRef.current(week - 1);
      } else {
        isSnappingRef.current = true;
        setIsSnapping(true);
        setDragOffset(0);
        setTimeout(() => { setIsSnapping(false); isSnappingRef.current = false; }, 280);
      }
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const contentProps: WeekContentProps = {
    activeCategories, activeClasses, searchQuery, activeCars,
    activeTracks, filterOwnedCars, filterOwnedTracks, ownedCars,
    ownedTracks, favorites, weekNum: selectedWeek,
  };

  const trackStyle: React.CSSProperties = {
    transform: `translateX(calc(-33.333% + ${dragOffset}px))`,
    transition: isSnapping ? 'transform 0.28s ease-out' : 'none',
  };

  return (
    <div>
      {/* Desktop: 12-button week selector */}
      <div className="week-selector">
        <span className="week-selector-label">Week</span>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
          <button
            key={w}
            className={
              'week-btn' +
              (w === selectedWeek ? ' active' : '') +
              (w === currentWeek && w !== selectedWeek ? ' current' : '')
            }
            onClick={() => setSelectedWeek(w)}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Mobile: compact nav with arrows + dots */}
      <div className="week-nav-mobile">
        <button
          className="week-nav-arrow"
          onClick={() => snapToWeek(selectedWeek - 1)}
          disabled={selectedWeek === 1}
        >‹</button>
        <div className="week-nav-center">
          <span className="week-nav-label">Week {selectedWeek}</span>
          <div className="week-dots">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={
                  'week-dot' +
                  (i + 1 === selectedWeek ? ' active' : '') +
                  (i + 1 === currentWeek && i + 1 !== selectedWeek ? ' current' : '')
                }
                onClick={() => snapToWeek(i + 1)}
              />
            ))}
          </div>
        </div>
        <button
          className="week-nav-arrow"
          onClick={() => snapToWeek(selectedWeek + 1)}
          disabled={selectedWeek === 12}
        >›</button>
      </div>

      {/* Desktop: static single-panel content */}
      <div className="week-content-static">
        <WeekContent {...contentProps} weekNum={selectedWeek} />
      </div>

      {/* Mobile: 3-panel sliding carousel */}
      <div className="week-carousel-outer">
        <div className="week-carousel-track" style={trackStyle}>
          <div className="week-carousel-panel">
            <WeekContent {...contentProps} weekNum={selectedWeek - 1} />
          </div>
          <div className="week-carousel-panel">
            <WeekContent {...contentProps} weekNum={selectedWeek} />
          </div>
          <div className="week-carousel-panel">
            <WeekContent {...contentProps} weekNum={selectedWeek + 1} />
          </div>
        </div>
      </div>
    </div>
  );
}
