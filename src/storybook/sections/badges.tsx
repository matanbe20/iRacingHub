import React from 'react';
import { ALL_CATEGORIES, ALL_CLASSES } from '../../store/useStore';
import CarBadges from '../../components/CarBadges';
import { CatBadge, ClassBadge } from '../../components/CatBadge';
import RaceCostBadge from '../../components/RaceCostBadge';
import RaceTime from '../../components/RaceTime';
import SeriesLogo from '../../components/SeriesLogo';
import { LapsBadge, RainBadge, TrackName } from '../../components/RaceMeta';
import { IconRainDrop } from '../../components/icons';
import { getRaceReadiness } from '../../utils/pricing';
import { localizedFrequencyLabel } from '../../utils/raceTimes';
import useStore from '../../store/useStore';
import { multiClassSeries, rainyWeek, sportsCarSeries, weekOf } from '../fixtures';
import { Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

const readiness = {
  ready: { ready: true, neutral: false, needsTrack: false, needsCar: false, missingTrackName: null, missingCarName: null, unlockCost: 0 },
  needsBoth: { ready: false, neutral: false, needsTrack: true, needsCar: true, missingTrackName: 'Watkins Glen International', missingCarName: 'Porsche 911 GT3 R', unlockCost: 26.9 },
  needsTrack: { ready: false, neutral: false, needsTrack: true, needsCar: false, missingTrackName: 'Autodromo Nazionale Monza', missingCarName: null, unlockCost: 14.95 },
  neutral: { ready: false, neutral: true, needsTrack: true, needsCar: true, missingTrackName: null, missingCarName: null, unlockCost: 0 },
  unpriced: { ready: false, neutral: false, needsTrack: true, needsCar: false, missingTrackName: 'Nürburgring Combined', missingCarName: null, unlockCost: 0 },
};

/** Reads the live store so the chip matches what the visitor's garage implies. */
function LiveCostBadge() {
  const ownedCars = useStore(s => s.ownedCars);
  const ownedTracks = useStore(s => s.ownedTracks);
  const week = weekOf(multiClassSeries);
  return <RaceCostBadge readiness={getRaceReadiness(multiClassSeries.cars, week.track, ownedCars, ownedTracks)} />;
}

function FreqBadge({ series, week }: { series: typeof sportsCarSeries; week: ReturnType<typeof weekOf> }) {
  const timeZone = useStore(s => s.timeZone);
  const timeFormat = useStore(s => s.timeFormat);
  return (
    <span className="series-freq" data-freq={localizedFrequencyLabel(series.frequency, week.date, timeZone, timeFormat)}>!</span>
  );
}

export const badges: StorySection = {
  id: 'badges',
  title: 'Badges & chips',
  blurb: 'The vocabulary of a race row. Every card in the app is assembled from these.',
  stories: [
    {
      name: 'CatBadge',
      description: 'Fixed-width discipline chip. Given onFilter it becomes clickable and narrows the view - series cards pass it, read-only rows do not. Below 640px the shorter data-short label is swapped in.',
      keywords: 'cat-badge category discipline filterable',
      render: () => (
        <Variants layout="stack">
          <Variant label="All categories" wide>
            <div className="sb-inline">
              {ALL_CATEGORIES.map(cat => <CatBadge key={cat} category={cat} />)}
            </div>
          </Variant>
          <Variant label="Filterable (hover to dim)" wide>
            <div className="sb-inline">
              {ALL_CATEGORIES.slice(0, 3).map(cat => (
                <CatBadge key={cat} category={cat} onFilter={e => e.preventDefault()} />
              ))}
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'ClassBadge',
      description: 'Licence level, Rookie to A. Square, so a row of them lines up under the category chips.',
      keywords: 'class-badge licence rookie',
      render: () => (
        <Variants layout="stack">
          <Variant label="All classes" wide>
            <div className="sb-inline">
              {ALL_CLASSES.map(cls => <ClassBadge key={cls} cls={cls} />)}
            </div>
          </Variant>
          <Variant label="Filterable" wide>
            <div className="sb-inline">
              {ALL_CLASSES.map(cls => <ClassBadge key={cls} cls={cls} onFilter={e => e.preventDefault()} />)}
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'CarBadges',
      description: 'Up to two cars show as individual chips. Three or more collapse into their class ("GT3 Class", "Multi-Class") with the full list in a hover tooltip. Clicking any of them filters All Series by those cars.',
      keywords: 'car badge multi-class tooltip cars-group-wrapper',
      render: () => (
        <Variants layout="stack">
          <Variant label="Single car" wide>
            <CarBadges cars={sportsCarSeries.cars.split(',')[0]} />
          </Variant>
          <Variant label="Two cars" wide>
            <CarBadges cars={multiClassSeries.cars.split(',').slice(0, 2).join(',')} />
          </Variant>
          <Variant label="Grouped - hover for the list" wide>
            <CarBadges cars={multiClassSeries.cars} />
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'RaceCostBadge',
      description: 'What this race would cost to enter, from My Garage. Owned outright shows "Ready"; otherwise the chip is the unlock price and opens a popover to add the missing content to the garage or the Buy Guide. An empty garage shows nothing at all, so a first-time visitor is not met with price tags.',
      keywords: 'race-ready-badge race-cost-badge popover readiness price garage',
      render: () => (
        <Variants layout="stack">
          <Variant label="Owned - ready to race" wide><RaceCostBadge readiness={readiness.ready} /></Variant>
          <Variant label="Missing track + car (click me)" wide><RaceCostBadge readiness={readiness.needsBoth} /></Variant>
          <Variant label="Missing track only" wide><RaceCostBadge readiness={readiness.needsTrack} /></Variant>
          <Variant label="Not sold separately - no price to show" wide><RaceCostBadge readiness={readiness.unpriced} /></Variant>
          <Variant label="Empty garage - renders nothing" wide>
            <RaceCostBadge readiness={readiness.neutral} />
            <Note>Nothing above this line: that is the neutral state.</Note>
          </Variant>
          <Variant label="Live, from your garage" wide><LiveCostBadge /></Variant>
        </Variants>
      ),
    },
    {
      name: 'RaceTime',
      description: 'Next session in the viewer\'s timezone with a live countdown, ticking off one shared 1-second timer. Turns amber inside the last 10 minutes, and hides itself when the series publishes no usable start times or the season is over.',
      keywords: 'race-time countdown clock timezone soon',
      render: () => (
        <Variants layout="stack">
          <Variant label="Full - time and countdown" wide>
            <RaceTime frequency={sportsCarSeries.frequency} weekDates={sportsCarSeries.weeks.map(w => w.date)} />
          </Variant>
          <Variant label="Compact - countdown moves to the tooltip" wide>
            <RaceTime frequency={sportsCarSeries.frequency} weekDates={sportsCarSeries.weeks.map(w => w.date)} compact />
          </Variant>
          <Variant label="No published times - renders nothing" wide>
            <RaceTime frequency="4 timeslots per week" weekDates={[weekOf(sportsCarSeries).date]} />
          </Variant>
          <Note>Switch off “Show race times &amp; countdowns” in Settings and every chip above disappears.</Note>
        </Variants>
      ),
    },
    {
      name: 'Frequency dot',
      description: 'The "!" circle at the end of a row. Hovering restates the published race frequency in local time, which is why it is DST-anchored to a specific week.',
      keywords: 'series-freq frequency tooltip data-freq',
      render: () => <FreqBadge series={sportsCarSeries} week={weekOf(sportsCarSeries)} />,
    },
    {
      name: 'Track, laps & rain',
      description: 'The rest of a row\'s facts. The track config after the dash is dimmed; distance switches to its short form ("40M") on narrow screens; rain only appears when the forecast is above zero.',
      keywords: 'track-config laps-badge week-rain data-short raindrop',
      render: () => (
        <Variants layout="stack">
          <Variant label="Track with configuration" wide>
            <TrackName track={rainyWeek.track} className="tw-card-track" />
          </Variant>
          <Variant label="Distance" wide>
            <div className="sb-inline">
              <LapsBadge laps="40 mins" />
              <LapsBadge laps="18 laps" />
              <LapsBadge laps="2 hours" />
            </div>
          </Variant>
          <Variant label="Rain forecast" wide>
            <div className="sb-inline">
              <RainBadge rain={rainyWeek.rain ?? 35} />
              <RainBadge rain={80} />
              <span className="series-rain-icon" title="Rain forecast in some weeks"><IconRainDrop size={12} /></span>
              <span className="sb-muted">← series-level: some week this season is wet</span>
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Ownership & status chips',
      description: 'Small trailing labels: a car you own in this series, and the four content-list states.',
      keywords: 'car-owned-badge list-badge free owned sched no sku',
      render: () => (
        <Variants layout="stack">
          <Variant label="On a series card" wide>
            <span className="car-owned-badge" title="You own this car">✓ Car</span>
          </Variant>
          <Variant label="In a content list" wide>
            <div className="sb-inline">
              <span className="list-badge list-badge--free">Free</span>
              <span className="list-badge list-badge--sched">My Schedule</span>
              <span className="list-badge list-badge--owned">Owned</span>
              <span className="list-badge list-badge--unknown">No SKU</span>
            </div>
          </Variant>
          <Variant label="Counters" wide>
            <div className="sb-inline">
              <span className="tab-badge">7</span>
              <span className="sub-tab-count">12</span>
              <span className="shared-garage-count">31</span>
              <span className="week-view-count">144 series</span>
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'SeriesLogo',
      description: 'Official series artwork, looked up by cleaned series name per category folder. Lazy-loaded, and removed from the layout if the file is missing so a name never sits behind a broken image.',
      keywords: 'logo image lazy onError',
      render: () => (
        <div className="sb-inline">
          {[sportsCarSeries, multiClassSeries].map(s => (
            <span key={s.name} className="sb-inline">
              <SeriesLogo category={s.category} name={s.name} className="series-logo" />
            </span>
          ))}
          <span className="sb-muted">missing file →</span>
          <SeriesLogo category="SPORTS CAR" name="A Series That Does Not Exist" className="series-logo" />
        </div>
      ),
    },
    {
      name: 'Special event chips',
      description: 'Event type and timing, used on the Special Events tab. Status is derived from the event dates each render, so "Live Now" needs no scheduling.',
      keywords: 'se-type-badge se-status-badge live upcoming completed tbd',
      render: () => (
        <Variants layout="stack">
          <Variant label="Type" wide>
            <div className="sb-inline">
              <span className="se-type-badge se-type--team">Team Event</span>
              <span className="se-type-badge se-type--nascar">NASCAR iRacing Series</span>
              <span className="se-type-badge se-type--super">Super Session</span>
              <span className="se-type-badge se-type--solo">Solo Event</span>
            </div>
          </Variant>
          <Variant label="Status" wide>
            <div className="sb-inline">
              <span className="se-status-badge se-status-badge--inline se-badge--active">Live Now</span>
              <span className="se-status-badge se-status-badge--inline se-badge--upcoming">In 10d</span>
              <span className="se-status-badge se-status-badge--inline se-badge--completed">Completed</span>
              <span className="se-status-badge se-status-badge--inline se-badge--tbd">Date TBD</span>
            </div>
          </Variant>
        </Variants>
      ),
    },
  ],
};
