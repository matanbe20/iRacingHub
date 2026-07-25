import React from 'react';
import { ALL_CATEGORIES, ALL_CLASSES } from '../../store/useStore';
import { catAbbrev, catColorVar, catLabel, classColorVar } from '../../utils/helpers';
import { Note, Variant, Variants } from '../Story';
import type { StorySection } from '../Story';

interface SwatchProps {
  name: string;
  value: string;
  /** Text sample drawn on top, for surface colours. */
  sample?: string;
}

function Swatch({ name, value, sample }: SwatchProps) {
  return (
    <div className="sb-swatch">
      <div className="sb-swatch-chip" style={{ background: value }}>
        {sample && <span style={{ color: 'var(--text)' }}>{sample}</span>}
      </div>
      <code className="sb-swatch-name">{name}</code>
    </div>
  );
}

const SURFACES = ['--bg', '--surface', '--surface2', '--border'];
const INK = ['--text', '--text-dim', '--accent', '--accent-glow'];

export const foundations: StorySection = {
  id: 'foundations',
  title: 'Foundations',
  blurb: 'The variables every component reads. Both themes are driven from these — change one here and the whole app follows.',
  stories: [
    {
      name: 'Surfaces & ink',
      description: 'Four stacked surfaces and the text colours that sit on them. Defined on :root, overridden under [data-theme="light"].',
      keywords: '--bg --surface --surface2 --border --text --accent theme',
      render: () => (
        <Variants>
          <Variant label="Surfaces">
            <div className="sb-swatch-row">
              {SURFACES.map(v => <Swatch key={v} name={v} value={`var(${v})`} />)}
            </div>
          </Variant>
          <Variant label="Ink & accent">
            <div className="sb-swatch-row">
              {INK.map(v => <Swatch key={v} name={v} value={`var(${v})`} />)}
            </div>
          </Variant>
        </Variants>
      ),
    },
    {
      name: 'Category hues',
      description: 'One hue per racing discipline, used by the category badge, the By Week group headers and the type filter buttons.',
      keywords: 'oval sports formula dirt unranked colour',
      render: () => (
        <div className="sb-swatch-row">
          {ALL_CATEGORIES.map(cat => (
            <Swatch key={cat} name={catLabel(cat) + ' · ' + catAbbrev(cat)} value={catColorVar(cat)} />
          ))}
        </div>
      ),
    },
    {
      name: 'Licence class hues',
      description: 'Rookie through A, warm to cool. Shared by the class badge, the class filters and the advanced matrix.',
      keywords: 'rookie R D C B A licence class colour',
      render: () => (
        <div className="sb-swatch-row">
          {ALL_CLASSES.map(cls => (
            <Swatch key={cls} name={`--class-${cls.toLowerCase()}`} value={classColorVar(cls)} />
          ))}
        </div>
      ),
    },
    {
      name: 'Type scale',
      description: 'Sizes in use, from the site title down to the smallest badge text.',
      keywords: 'font size typography heading',
      render: () => (
        <Variants layout="stack">
          {[
            ['1.75rem / 800', 'iRacing Hub', '1.75rem', 800],
            ['1rem / 700', 'Modal title', '1rem', 700],
            ['0.875rem / 600', 'Series name, tab label', '0.875rem', 600],
            ['0.82rem / 400', 'List row', '0.82rem', 400],
            ['0.75rem / 400', 'Card meta', '0.75rem', 400],
            ['0.65rem / 600', 'Badge text', '0.65rem', 600],
          ].map(([label, text, size, weight]) => (
            <Variant key={label as string} label={label as string} wide>
              <span style={{ fontSize: size as string, fontWeight: weight as number, letterSpacing: (size as string) === '0.65rem' ? '0.05em' : undefined }}>
                {text as string}
              </span>
            </Variant>
          ))}
        </Variants>
      ),
    },
    {
      name: 'Radii & elevation',
      description: 'Corner radii by element size, and the two shadows: cards stay flat, overlays lift.',
      keywords: 'border-radius shadow box-shadow elevation',
      render: () => (
        <>
          <div className="sb-swatch-row">
            {[
              ['3px', 'week cell'],
              ['4px', 'badge'],
              ['6px', 'button, input'],
              ['8px', 'card'],
              ['12px', 'modal'],
              ['50%', 'icon button'],
            ].map(([r, what]) => (
              <div className="sb-swatch" key={r}>
                <div className="sb-swatch-chip sb-swatch-chip--outline" style={{ borderRadius: r }} />
                <code className="sb-swatch-name">{r} · {what}</code>
              </div>
            ))}
          </div>
          <Note>Overlays use <code>0 20px 60px rgba(0,0,0,.5)</code>; cards use a border and no shadow in dark, a 1px lift in light.</Note>
        </>
      ),
    },
  ],
};
