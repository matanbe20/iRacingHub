import React, { useState } from 'react';
import useStore from '../store/useStore';
import { catColorVar, cleanName, isFixed, shortDate } from '../utils/helpers';
import { getRaceReadiness } from '../utils/pricing';
import { localizedFrequencyLabel, upcomingWeek } from '../utils/raceTimes';
import { getCurrentWeek } from '../utils/schedule';
import CarBadges from './CarBadges';
import { CatBadge, ClassBadge } from './CatBadge';
import Modal from './Modal';
import RaceCostBadge from './RaceCostBadge';
import { LapsBadge, RainBadge, TrackName } from './RaceMeta';
import RaceTime from './RaceTime';
import SeriesLogo from './SeriesLogo';
import WeekCell from './WeekCell';
import type { Series } from '../types';

const currentWeek = getCurrentWeek();

interface SeriesTileProps {
  series: Series;
}

/**
 * The card layout of All Series. Where `SeriesCard` summarises a whole season on
 * one line, a tile leads with the one race that matters - the series' next one -
 * and puts the full schedule in a modal. Expanding in place would either squeeze
 * twelve weeks into a 320px column or reflow the whole grid around one card.
 *
 * The featured week is `upcomingWeek()`, not the season's current week: the
 * endurance and short-season championships race only a handful of weeks, so
 * "week 5" would leave most of their cards blank.
 */
export default function SeriesTile({ series }: SeriesTileProps) {
  const [open, setOpen] = useState(false);
  const mySchedule = useStore(s => s.mySchedule);
  const favorites = useStore(s => s.favorites);
  const toggleRace = useStore(s => s.toggleRace);
  const toggleSeries = useStore(s => s.toggleSeries);
  const toggleFavorite = useStore(s => s.toggleFavorite);
  const filterByCategory = useStore(s => s.filterByCategory);
  const filterByClass = useStore(s => s.filterByClass);
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const timeZone = useStore(s => s.timeZone);
  const timeFormat = useStore(s => s.timeFormat);

  const displayName = cleanName(series.name);
  const fixed = isFixed(series.name);
  const isFav = favorites.has(series.name);
  const allAdded = series.weeks.every(w => !!mySchedule[series.name + '_' + w.week]);

  // Read once per render rather than off the shared ticker: the featured week
  // turns over weekly, and 149 tiles re-rendering every second is not free.
  // The countdown inside RaceTime does its own ticking.
  // Null once every week of the series has been raced - the card then shows the
  // final week as a record rather than an invitation.
  const next = upcomingWeek(series.weeks, Date.now());
  const over = next === null;
  const week = next ?? series.weeks[series.weeks.length - 1];

  const readiness = getRaceReadiness(series.cars, week.track, ownedCars, ownedTracks);
  const weekAdded = !!mySchedule[series.name + '_' + week.week];

  return (
    <div
      className={'series-tile' + (over ? ' series-tile--over' : '')}
      style={{ '--tile-accent': catColorVar(series.category) } as React.CSSProperties}
    >
      <div className="series-tile-head">
        <SeriesLogo category={series.category} name={series.name} className="series-tile-logo" />
        <div className="series-tile-heading">
          <div className="series-tile-title" title={displayName}>
            {displayName}
            {fixed && <span className="series-fixed-tag"> [Fixed]</span>}
          </div>
          <div className="series-tile-badges">
            <CatBadge
              category={series.category}
              onFilter={e => { e.stopPropagation(); filterByCategory(series.category); }}
            />
            <ClassBadge
              cls={series.class}
              onFilter={e => { e.stopPropagation(); filterByClass(series.class); }}
            />
          </div>
        </div>
        <button
          className={'tw-fav-btn' + (isFav ? ' active' : '')}
          onClick={() => toggleFavorite(series.name)}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '★' : '☆'}
        </button>
      </div>

      <div className="series-tile-race">
        <div className="series-tile-week">
          <span className="series-tile-week-num">Wk {week.week}</span>
          <span className="series-tile-week-date">{shortDate(week.date)}</span>
          {over
            ? <span className="series-tile-pill series-tile-pill--over">Season complete</span>
            : week.week === currentWeek && <span className="series-tile-pill">This week</span>}
        </div>
        <TrackName track={week.track} className="series-tile-track" title={week.track} />
        <div className="series-tile-meta">
          <LapsBadge laps={week.laps} />
          <RainBadge rain={week.rain} />
          <RaceCostBadge readiness={readiness} />
        </div>
      </div>

      {!over && (
        <div className="series-tile-timing">
          <RaceTime frequency={series.frequency} weekDates={[week.date]} />
          <span
            className="series-freq"
            data-freq={localizedFrequencyLabel(series.frequency, week.date, timeZone, timeFormat)}
          >!</span>
        </div>
      )}

      <div className="series-tile-cars">
        {week.car
          ? <CarBadges cars={week.car} />
          : series.cars && <CarBadges cars={series.cars} />}
      </div>

      {/* One segment per scheduled week: raced, featured, still to come - filled
          when that race is already on My Schedule. Clicking opens the full grid. */}
      <div
        className="series-tile-strip"
        onClick={() => setOpen(true)}
        title="Season at a glance - click for every week"
      >
        {series.weeks.map(w => {
          const added = !!mySchedule[series.name + '_' + w.week];
          const state = w.week === week.week ? ' is-now' : w.week < week.week ? ' is-past' : '';
          return (
            <span
              key={w.week}
              className={'series-tile-seg' + state + (added ? ' is-added' : '')}
              title={'Wk ' + w.week + ' - ' + w.track + (added ? ' (on My Schedule)' : '')}
            />
          );
        })}
      </div>

      <div className="series-tile-foot">
        {!over && (
          <button
            className={'series-add-btn' + (weekAdded ? ' added' : '')}
            data-raw-name={series.name}
            data-week={week.week}
            onClick={() => toggleRace(series.name, week.week)}
            title={weekAdded ? 'Remove week ' + week.week + ' from My Schedule' : 'Add week ' + week.week + ' to My Schedule'}
          >
            {weekAdded ? '✓ Wk ' + week.week : '+ Wk ' + week.week}
          </button>
        )}
        <button
          className={'series-add-btn' + (allAdded ? ' added' : '')}
          data-raw-name={series.name}
          onClick={() => toggleSeries(series.name)}
          title={allAdded ? 'Remove all weeks from My Schedule' : 'Add all weeks to My Schedule'}
        >
          {allAdded ? '✓ All' : '+ All'}
        </button>
        <button
          className="series-tile-expand"
          onClick={() => setOpen(true)}
          title={'Show all ' + series.weeks.length + ' weeks'}
        >
          {series.weeks.length} weeks
          <span className="series-tile-expand-icon">&rsaquo;</span>
        </button>
      </div>

      {open && (
        <Modal
          title={displayName}
          onClose={() => setOpen(false)}
          size="lg"
          className="series-modal"
          flushBody
          chrome={
            <div className="series-modal-chrome">
              <CatBadge category={series.category} />
              <ClassBadge cls={series.class} />
              {fixed && <span className="series-fixed-tag">[Fixed]</span>}
              {series.cars && <CarBadges cars={series.cars} />}
              <span className="series-modal-freq">{series.frequency}</span>
            </div>
          }
          footer={
            <button
              className={'series-add-btn' + (allAdded ? ' added' : '')}
              data-raw-name={series.name}
              onClick={() => toggleSeries(series.name)}
            >
              {allAdded ? '✓ All weeks saved' : '+ Add all ' + series.weeks.length + ' weeks'}
            </button>
          }
        >
          <div className="week-grid">
            {series.weeks.map((w, i) => (
              <WeekCell key={i} series={series} week={w} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
