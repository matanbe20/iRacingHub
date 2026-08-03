import React from 'react';
import { calcTotal, DISCOUNT_TIERS } from '../../data/iracing-prices';
import { Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

const priced = calcTotal([14.95, 14.95, 11.95, 11.95, 11.95]);
const nextTier = DISCOUNT_TIERS.find(t => t.minItems > priced.count && t.minItems !== Infinity);

export const states: StorySection = {
  id: 'states',
  title: 'Empty & summary states',
  blurb: 'What each view shows when it has nothing to show, and the running totals that sit at the edge of a panel.',
  stories: [
    {
      name: 'No results',
      description: 'Filters that match nothing. The hint points at the cause - filters, not missing data - because an over-filtered view is the usual reason a list is empty here.',
      keywords: 'no-results no-results-hint empty filters',
      render: () => (
        <Variants layout="stack">
          <Variant label="All Series" wide>
            <div className="no-results">
              No series match your filters<br />
              <span className="no-results-hint">Check the filters applied</span>
            </div>
          </Variant>
          <Variant label="By Week" wide>
            <div className="no-results">
              0 races this week match your filters<br />
              <span className="no-results-hint">Check the filters applied</span>
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Empty My Schedule',
      description: 'First run of the tab, telling you the one gesture that fills it.',
      keywords: 'my-schedule-empty empty state onboarding',
      render: () => (
        <div className="my-schedule-empty">
          <p>No races saved yet.</p>
          <small>Click the <strong>+</strong> button on any week cell to add races to your schedule.</small>
        </div>
      ),
    },
    {
      name: 'Empty content list',
      description: 'A search inside My Garage or the Buy Guide that matches nothing. Quotes the query back so a typo is obvious.',
      keywords: 'list-empty garage buy no results search',
      render: () => (
        <Variants layout="stack">
          <Variant label="With a query" wide><div className="list-empty">No results for "porsh"</div></Variant>
          <Variant label="Filtered out" wide><div className="list-empty">No tracks found</div></Variant>
        </Variants>
      ),
    },
    {
      name: 'Buy Guide price bar',
      description: 'The Buy Guide\'s footer. Empty it just prompts; with a selection it shows the subtotal, iRacing\'s volume discount, how many more items would reach the next tier, and the total. The button hands the SKUs to the iRacing store.',
      keywords: 'buy-price-bar subtotal discount tier total buy-iracing-btn',
      render: () => (
        <Variants layout="stack">
          <Variant label="Nothing selected" wide>
            <div className="buy-price-bar buy-price-bar-empty">
              <span className="buy-price-empty-msg">Select tracks or cars to see pricing</span>
            </div>
          </Variant>
          <Variant label="Five items, one tier reached" wide>
            <div className="buy-price-bar">
              <div className="buy-price-summary">
                <span className="buy-price-count">2 tracks + 3 cars</span>
                <span className="buy-price-subtotal">Subtotal: ${priced.subtotal.toFixed(2)}</span>
                {priced.discountPct > 0 && (
                  <span className="buy-price-discount">
                    {priced.discountPct}% off - <span className="buy-price-discount-amount">−${priced.discountAmount.toFixed(2)}</span>
                  </span>
                )}
                {nextTier && (
                  <span className="buy-price-next-tier">
                    Add {nextTier.minItems - priced.count} more for {nextTier.discountPct}% off
                  </span>
                )}
                <span className="buy-price-total">Total: ${priced.total.toFixed(2)}</span>
              </div>
              <button className="buy-iracing-btn">Buy on iRacing →</button>
            </div>
          </Variant>
          <Note>Prices and tiers come from the same tables the race-cost chips use.</Note>
        </Variants>
      ),
    },
    {
      name: 'Section headers',
      description: 'Titles with a count, used on Special Events and above content lists.',
      keywords: 'se-section-header se-event-count garage-modal-summary count-label',
      render: () => (
        <Variants layout="stack">
          <Variant label="Special Events" wide>
            <div className="se-section-header">
              <h2>Upcoming iRacing Special Events</h2>
              <span className="se-event-count">17 events</span>
            </div>
          </Variant>
          <Variant label="Past events" wide>
            <div className="se-section-header se-section-header--past">
              <h2>Past Events</h2>
              <span className="se-event-count">9 events</span>
            </div>
          </Variant>
          <Variant label="Selection summary" wide>
            <div className="garage-modal-summary">24 / 131 cars selected</div>
          </Variant>
          <Variant label="Saved count" wide>
            <div className="my-schedule-header">
              <span className="count-label">7 races saved</span>
            </div>
          </Variant>
        </Variants>
      ),
    },
  ],
};
