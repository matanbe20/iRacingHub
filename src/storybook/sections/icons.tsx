import React from 'react';
import * as Icons from '../../components/icons';
import type { StorySection } from '../Story';

/** Everything exported from icons.tsx, so a new glyph shows up here for free. */
const ENTRIES = Object.entries(Icons).filter(([name]) => name.startsWith('Icon'));

export const icons: StorySection = {
  id: 'icons',
  title: 'Icons',
  blurb: 'One module, sized by prop, painted with currentColor. Two are deliberately full-colour: the garage and coin in the race-cost popover, where they read as distinct actions rather than decoration.',
  stories: [
    {
      name: 'Icon set',
      description: 'Rendered at their default sizes, inheriting the text colour around them.',
      keywords: 'icons svg currentColor car track grid list calendar trophy cart gear clock rain',
      render: () => (
        <div className="sb-icon-grid">
          {ENTRIES.map(([name, Icon]) => {
            const Component = Icon as React.ComponentType<{ size?: number }>;
            return (
              <div className="sb-icon" key={name}>
                <span className="sb-icon-glyph"><Component /></span>
                <code className="sb-swatch-name">{name}</code>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      name: 'Sizing & colour',
      description: 'The size prop scales the glyph; colour follows the surrounding text, which is what lets one icon serve a dim toolbar button and an accented tab.',
      keywords: 'size prop currentColor accent dim',
      render: () => (
        <div className="sb-inline" style={{ alignItems: 'flex-end' }}>
          {[12, 16, 20, 28, 40].map(size => (
            <span key={size} style={{ color: 'var(--text-dim)' }}><Icons.IconCar size={size} /></span>
          ))}
          <span style={{ color: 'var(--accent)' }}><Icons.IconCar size={40} /></span>
          <span style={{ color: 'var(--sports)' }}><Icons.IconTrophy size={40} /></span>
          <span style={{ color: 'var(--oval)' }}><Icons.IconRainDrop size={40} /></span>
        </div>
      ),
    },
  ],
};
