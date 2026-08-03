import React from 'react';

/**
 * The gallery's own building blocks: a story is one component shown in a canvas,
 * with the variants that matter labelled underneath their own heading.
 */

export interface StoryDef {
  /** Shown as the story heading, and matched against the search box. */
  name: string;
  /** What the component is for, and anything a reader would otherwise have to guess. */
  description?: string;
  /** Extra search terms - class names, related components. */
  keywords?: string;
  render: () => React.ReactNode;
}

export interface StorySection {
  id: string;
  title: string;
  blurb?: string;
  stories: StoryDef[];
}

export function StoryCard({ story }: { story: StoryDef }) {
  return (
    <article className="sb-story" id={'story-' + slug(story.name)}>
      <header className="sb-story-head">
        <h3 className="sb-story-title">{story.name}</h3>
        {story.description && <p className="sb-story-desc">{story.description}</p>}
      </header>
      <div className="sb-canvas">{story.render()}</div>
    </article>
  );
}

export function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface VariantsProps {
  /** 'row' wraps items inline; 'stack' gives each its own full-width line. */
  layout?: 'row' | 'stack';
  children: React.ReactNode;
}

export function Variants({ layout = 'row', children }: VariantsProps) {
  return <div className={'sb-variants sb-variants--' + layout}>{children}</div>;
}

interface VariantProps {
  label: string;
  /** Fills the canvas width - cards, sidebars, whole panels. */
  wide?: boolean;
  children: React.ReactNode;
}

export function Variant({ label, wide, children }: VariantProps) {
  return (
    <div className={'sb-variant' + (wide ? ' sb-variant--wide' : '')}>
      <span className="sb-variant-label">{label}</span>
      <div className="sb-variant-body">{children}</div>
    </div>
  );
}

/** A short aside inside a canvas - how to trigger a state, or what is mobile-only. */
export function Note({ children }: { children: React.ReactNode }) {
  return <p className="sb-note">{children}</p>;
}

/**
 * Renders app markup that expects the real page frame (a sticky sidebar, a
 * full-width nav bar) inside a bounded box, so it can't stretch the gallery.
 */
export function Frame({ height, fit, children }: { height?: number; fit?: boolean; children: React.ReactNode }) {
  return (
    <div className={'sb-frame' + (fit ? ' sb-frame--fit' : '')} style={height ? { height } : undefined}>
      {children}
    </div>
  );
}
