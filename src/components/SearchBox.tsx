import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';
import { IconSearch, IconX } from './icons';

const PHRASES = ['Spa', 'Porsche Cup', 'GT3', 'Daytona', 'Formula 4', 'Dirt Oval', 'N\xfcrburgring', 'IMSA', 'Late Model'];

function useTypewriter(inputFocused: boolean, hasValue: boolean): string {
  const [text, setText] = useState('');
  const stateRef = useRef({ pi: 0, ci: 0, deleting: false, running: true, timer: null as ReturnType<typeof setTimeout> | null });

  useEffect(() => {
    const s = stateRef.current;
    s.running = true;

    function tick() {
      if (!s.running) return;
      if (hasValue || inputFocused) {
        setText('');
        return;
      }
      const phrase = PHRASES[s.pi];
      if (!s.deleting) {
        s.ci++;
        setText('Search ' + phrase.slice(0, s.ci));
        if (s.ci === phrase.length) {
          s.deleting = true;
          s.timer = setTimeout(tick, 2000);
          return;
        }
      } else {
        s.ci--;
        setText(s.ci ? 'Search ' + phrase.slice(0, s.ci) : 'Search');
        if (s.ci === 0) {
          s.deleting = false;
          s.pi = (s.pi + 1) % PHRASES.length;
          s.timer = setTimeout(tick, 500);
          return;
        }
      }
      s.timer = setTimeout(tick, s.deleting ? 40 : 80);
    }

    tick();

    return () => {
      s.running = false;
      if (s.timer != null) clearTimeout(s.timer);
    };
  }, [hasValue, inputFocused]);

  return text;
}

export default function SearchBox() {
  const searchQuery = useStore(s => s.searchQuery);
  const setSearchQuery = useStore(s => s.setSearchQuery);
  const [focused, setFocused] = useState(false);

  const hasValue = searchQuery.length > 0;
  const twText = useTypewriter(focused, hasValue);
  const showTypewriter = !focused && !hasValue;

  return (
    <div className="search-wrap">
      <IconSearch className="search-icon-svg" />
      <input
        type="text"
        className="search-box"
        id="search"
        placeholder=""
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {showTypewriter && (
        <div className="search-typewriter" id="search-typewriter" aria-hidden="true">
          <span className="tw-text">{twText}</span>
          <span className="tw-cursor"></span>
        </div>
      )}
      {hasValue && (
        <button
          className="search-clear"
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          tabIndex={-1}
        >
          <IconX />
        </button>
      )}
    </div>
  );
}
