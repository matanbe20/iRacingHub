import React from 'react';
import MyRaceCard from '../../components/MyRaceCard';
import SeriesCard from '../../components/SeriesCard';
import { SpecialEventCard } from '../../components/SpecialEventsPanel';
import TwCard from '../../components/TwCard';
import WeekCell from '../../components/WeekCell';
import { SPECIAL_EVENTS } from '../../data/special-events';
import { catClass, catLabel, getWeekDateRange, shortDate } from '../../utils/helpers';
import {
  currentWeekNumber, dirtSeries, entryOf, fixedSetupSeries, multiClassSeries,
  ovalSeries, rainySeries, rainyWeek, sportsCarSeries, weekOf,
} from '../fixtures';
import { Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

const now = new Date();
const todayIso = now.toISOString().slice(0, 10);
// An event that has genuinely not run yet, so the story shows a countdown badge.
const upcomingEvent = SPECIAL_EVENTS.find(e => e.startDate > todayIso) ?? SPECIAL_EVENTS[0];
const pastEvent = [...SPECIAL_EVENTS].reverse().find(e => e.startDate && e.startDate < todayIso)
  ?? SPECIAL_EVENTS[SPECIAL_EVENTS.length - 1];

export const cards: StorySection = {
  id: 'cards',
  title: 'Cards',
  blurb: 'The four ways a race is presented: a season at a glance, a single week, a saved race, and a special event.',
  stories: [
    {
      name: 'SeriesCard',
      description: 'One row per series on All Series; clicking the header reveals all twelve weeks. The header carries the whole season\'s summary — discipline, licence, cars, the next start time, whether any week is wet, and whether you own a car for it.',
      keywords: 'series-card series-header expanded week-grid all series',
      render: () => (
        <Variants layout="stack">
          <Variant label="Collapsed — click a header to expand" wide>
            <div className="series-grid">
              <SeriesCard series={sportsCarSeries} />
              <SeriesCard series={multiClassSeries} />
              <SeriesCard series={dirtSeries} />
            </div>
          </Variant>
          <Variant label="Fixed setup series — tagged after the name" wide>
            <div className="series-grid">
              <SeriesCard series={fixedSetupSeries} />
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'WeekCell',
      description: 'One week inside an expanded series card: number, date, track, cost-to-race, distance and rain. The week being raced right now is tinted and starred.',
      keywords: 'week-cell current week-num week-track week-grid',
      render: () => (
        <div className="week-grid">
          {rainySeries.weeks.slice(0, 4).map(w => (
            <WeekCell key={w.week} series={rainySeries} week={w} />
          ))}
          <WeekCell series={rainySeries} week={weekOf(rainySeries, currentWeekNumber)} />
        </div>
      ),
    },
    {
      name: 'TwCard',
      description: 'A single race on the By Week tab, grouped under its discipline. Same facts as a week cell, plus the series identity and a favourite toggle — favourites float to the top of the week.',
      keywords: 'tw-card by week favourite tw-card-meta',
      render: () => (
        <>
          <div className="tw-category-group">
            <div className="tw-category-header tw-favorites-header">★ Favorites</div>
            <TwCard series={ovalSeries} week={weekOf(ovalSeries)} />
          </div>
          <div className="tw-category-group">
            <div className="tw-category-header sports">Sports Car</div>
            <TwCard series={sportsCarSeries} week={weekOf(sportsCarSeries)} />
            <TwCard series={multiClassSeries} week={weekOf(multiClassSeries)} />
          </div>
          <div className="tw-category-group">
            <div className={'tw-category-header ' + catClass(rainySeries.category)}>
              {catLabel(rainySeries.category)}
            </div>
            <TwCard series={rainySeries} week={rainyWeek} />
          </div>
        </>
      ),
    },
    {
      name: 'MyRaceCard',
      description: 'A saved race on My Schedule, grouped by week. The track is a button here: it jumps to All Series filtered to that track. Weeks already run are dimmed as a group.',
      keywords: 'my-race-card my-week-group past my-race-track-badge',
      render: () => (
        <>
          <div className="my-week-group">
            <div className="my-week-label">
              Week {currentWeekNumber} — {shortDate(weekOf(sportsCarSeries).date)}
              <span className="my-week-now">Current</span>
            </div>
            <MyRaceCard entry={entryOf(sportsCarSeries, weekOf(sportsCarSeries))} />
            <MyRaceCard entry={entryOf(multiClassSeries, weekOf(multiClassSeries))} />
          </div>
          <div className="my-week-group past">
            <div className="my-week-label">Week 1 — {shortDate(rainySeries.weeks[0].date)}</div>
            <MyRaceCard entry={entryOf(rainySeries, rainySeries.weeks[0])} />
          </div>
        </>
      ),
    },
    {
      name: 'SpecialEventCard',
      description: 'An iRacing special event, in the two layouts the tab offers. Completed events keep their place, dimmed. Banner artwork is remote, so a failed load removes the image rather than leaving a broken frame.',
      keywords: 'se-card se-row grid list past special events banner',
      render: () => (
        <Variants layout="stack">
          <Variant label="Grid" wide>
            <div className="se-grid">
              <SpecialEventCard event={upcomingEvent} now={now} view="grid" />
              <SpecialEventCard event={pastEvent} now={now} view="grid" />
            </div>
          </Variant>
          <Variant label="List" wide>
            <div className="se-list">
              <SpecialEventCard event={upcomingEvent} now={now} view="list" />
              <SpecialEventCard event={pastEvent} now={now} view="list" />
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Group headers',
      description: 'The dividers that organise a long list: discipline headers on By Week, the week range above them, and the week label on My Schedule.',
      keywords: 'tw-category-header week-view-header my-week-label stats',
      render: () => (
        <Variants layout="stack">
          <Variant label="Week range + count" wide>
            <div className="week-view-header">
              <span className="week-view-title">{getWeekDateRange(currentWeekNumber)}</span>
              <span className="week-view-count">144 series</span>
            </div>
          </Variant>
          <Variant label="Discipline headers" wide>
            {['sports', 'formula', 'oval', 'dirt-oval', 'dirt-road', 'unranked'].map((cls, i) => (
              <div key={cls} className={'tw-category-header ' + cls}>
                {['Sports Car', 'Formula', 'Oval', 'Dirt Oval', 'Dirt Road', 'Unranked'][i]}
              </div>
            ))}
          </Variant>
          <Variant label="Series count (All Series)" wide>
            <span className="stats">149 series</span>
          </Variant>
          <Note>Group order follows licence class, then discipline, then name.</Note>
        </Variants>
      ),
    },
  ],
};
