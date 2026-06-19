import React from 'react';
import useStore from '../store/useStore';
import { ALL_CATEGORIES, ALL_CLASSES } from '../store/useStore';

const CAT_ABBREV: Record<string, string> = {
  'OVAL':        'OV',
  'SPORTS CAR':  'SC',
  'FORMULA CAR': 'FC',
  'DIRT OVAL':   'DO',
  'DIRT ROAD':   'DR',
  'UNRANKED':    'UN',
};

const CAT_COLOR: Record<string, string> = {
  'OVAL':        'var(--oval)',
  'SPORTS CAR':  'var(--sports)',
  'FORMULA CAR': 'var(--formula)',
  'DIRT OVAL':   'var(--dirt-oval)',
  'DIRT ROAD':   'var(--dirt-road)',
  'UNRANKED':    'var(--unranked)',
};

const CLS_COLOR: Record<string, string> = {
  'R': '#ef4444',
  'D': '#f97316',
  'C': '#eab308',
  'B': '#22c55e',
  'A': '#3b82f6',
};

export default function AdvancedClassMatrix() {
  const activeCategories = useStore(s => s.activeCategories);
  const advancedClassMap = useStore(s => s.advancedClassMap);
  const toggleAdvancedClass = useStore(s => s.toggleAdvancedClass);

  return (
    <div className="adv-class-matrix">
      <div className="adv-matrix-header">
        <span className="adv-matrix-corner" />
        {ALL_CLASSES.map(cls => (
          <span key={cls} className="adv-matrix-cls-label" style={{ color: CLS_COLOR[cls] }}>
            {cls}
          </span>
        ))}
      </div>
      {ALL_CATEGORIES.map(cat => {
        const isActive = activeCategories.has(cat);
        const catClasses = advancedClassMap[cat] ?? new Set(ALL_CLASSES);
        return (
          <div key={cat} className={'adv-matrix-row' + (isActive ? '' : ' adv-row-dimmed')}>
            <span className="adv-matrix-cat-label" style={{ color: CAT_COLOR[cat] }}>
              {CAT_ABBREV[cat]}
            </span>
            {ALL_CLASSES.map(cls => {
              const on = catClasses.has(cls);
              return (
                <button
                  key={cls}
                  className={'adv-matrix-dot' + (on ? ' adv-dot-on' : '')}
                  style={on ? { color: CLS_COLOR[cls] } : undefined}
                  onClick={() => toggleAdvancedClass(cat, cls)}
                  title={`${cat} · Class ${cls}`}
                  aria-pressed={on}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
