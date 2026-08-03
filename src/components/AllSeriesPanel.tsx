import React, { useMemo, useEffect } from 'react';
import useStore from '../store/useStore';
import { SCHEDULE_DATA } from '../data';
import { ALL_CLASSES } from '../store/useStore';
import { cleanName, baseTrackName } from '../utils/helpers';
import SeriesCard from './SeriesCard';
import SeriesTile from './SeriesTile';
import ViewToggle from './ViewToggle';
import { IconGrid, IconList } from './icons';
import type { AllSeriesView } from '../types';

const VIEW_OPTIONS: { value: AllSeriesView; label: string; icon: React.ReactNode }[] = [
  { value: 'card', label: 'Card view', icon: <IconGrid /> },
  { value: 'list', label: 'List view', icon: <IconList /> },
];

const CAT_ORDER = ['SPORTS CAR', 'FORMULA CAR', 'OVAL', 'DIRT OVAL', 'DIRT ROAD', 'UNRANKED'];

export default function AllSeriesPanel() {
  const activeCategories = useStore(s => s.activeCategories);
  const activeClasses = useStore(s => s.activeClasses);
  const searchQuery = useStore(s => s.searchQuery);
  const activeCars = useStore(s => s.activeCars);
  const activeTracks = useStore(s => s.activeTracks);
  const filterOwnedCars = useStore(s => s.filterOwnedCars);
  const filterOwnedTracks = useStore(s => s.filterOwnedTracks);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const setFilteredCount = useStore(s => s.setFilteredCount);
  const classFilterAdvanced = useStore(s => s.classFilterAdvanced);
  const advancedClassMap = useStore(s => s.advancedClassMap);
  const allSeriesView = useStore(s => s.allSeriesView);
  const setAllSeriesView = useStore(s => s.setAllSeriesView);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return SCHEDULE_DATA.filter(s => {
      if (!activeCategories.has(s.category)) return false;
      if (classFilterAdvanced) {
        const catClasses = advancedClassMap[s.category];
        if (!catClasses || !catClasses.has(s.class)) return false;
      } else {
        if (!activeClasses.has(s.class)) return false;
      }
      if (activeCars.size > 0) {
        const seriesCars = s.cars.split(',').map(c => c.trim());
        if (!seriesCars.some(c => activeCars.has(c))) return false;
      }
      if (activeTracks.size > 0) {
        if (!s.weeks.some(w => activeTracks.has(baseTrackName(w.track)))) return false;
      }
      if (filterOwnedCars && ownedCars.size > 0) {
        const seriesCars = s.cars.split(',').map(c => c.trim());
        if (!seriesCars.some(c => ownedCars.has(c))) return false;
      }
      if (filterOwnedTracks && ownedTracks.size > 0) {
        if (!s.weeks.some(w => ownedTracks.has(baseTrackName(w.track)))) return false;
      }
      if (q) {
        const haystack = (s.name + ' ' + s.cars + ' ' + s.weeks.map(w => w.track + ' ' + (w.car || '')).join(' ')).toLowerCase();
        return haystack.includes(q);
      }
      return true;
    }).sort((a, b) => {
      const classDiff = ALL_CLASSES.indexOf(a.class) - ALL_CLASSES.indexOf(b.class);
      if (classDiff !== 0) return classDiff;
      const catDiff = CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category);
      if (catDiff !== 0) return catDiff;
      return cleanName(a.name).localeCompare(cleanName(b.name));
    });
  }, [activeCategories, activeClasses, searchQuery, activeCars, activeTracks, filterOwnedCars, filterOwnedTracks, ownedCars, ownedTracks, classFilterAdvanced, advancedClassMap]);

  useEffect(() => {
    setFilteredCount(filtered.length);
  }, [filtered.length]);

  if (filtered.length === 0) {
    return (
      <>
        <Toolbar count={0} view={allSeriesView} onChange={setAllSeriesView} />
        <div className="no-results">
          No series match your filters<br />
          <span className="no-results-hint">Check the filters applied</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Toolbar count={filtered.length} view={allSeriesView} onChange={setAllSeriesView} />
      {allSeriesView === 'card' ? (
        <div className="series-tile-grid">
          {filtered.map(s => <SeriesTile key={s.name} series={s} />)}
        </div>
      ) : (
        <div className="series-grid">
          {filtered.map(s => <SeriesCard key={s.name} series={s} />)}
        </div>
      )}
    </>
  );
}

interface ToolbarProps {
  count: number;
  view: AllSeriesView;
  onChange: (view: AllSeriesView) => void;
}

function Toolbar({ count, view, onChange }: ToolbarProps) {
  return (
    <div className="as-panel-toolbar">
      <span className="stats">{count} series</span>
      <ViewToggle value={view} onChange={onChange} options={VIEW_OPTIONS} />
    </div>
  );
}
