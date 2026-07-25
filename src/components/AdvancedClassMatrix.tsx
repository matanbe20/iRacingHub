import React from 'react';
import useStore from '../store/useStore';
import { ALL_CATEGORIES, ALL_CLASSES } from '../store/useStore';
import { catAbbrev, catColorVar, classColorVar } from '../utils/helpers';

export default function AdvancedClassMatrix() {
  const activeCategories = useStore(s => s.activeCategories);
  const advancedClassMap = useStore(s => s.advancedClassMap);
  const toggleAdvancedClass = useStore(s => s.toggleAdvancedClass);

  return (
    <div className="adv-class-matrix">
      <div className="adv-matrix-header">
        <span className="adv-matrix-corner" />
        {ALL_CLASSES.map(cls => (
          <span key={cls} className="adv-matrix-cls-label" style={{ color: classColorVar(cls) }}>
            {cls}
          </span>
        ))}
      </div>
      {ALL_CATEGORIES.map(cat => {
        const isActive = activeCategories.has(cat);
        const catClasses = advancedClassMap[cat] ?? new Set(ALL_CLASSES);
        return (
          <div key={cat} className={'adv-matrix-row' + (isActive ? '' : ' adv-row-dimmed')}>
            <span className="adv-matrix-cat-label" style={{ color: catColorVar(cat) }}>
              {catAbbrev(cat)}
            </span>
            {ALL_CLASSES.map(cls => {
              const on = catClasses.has(cls);
              return (
                <button
                  key={cls}
                  className={'adv-matrix-dot' + (on ? ' adv-dot-on' : '')}
                  style={on ? { color: classColorVar(cls) } : undefined}
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
