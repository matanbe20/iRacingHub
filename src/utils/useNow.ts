import { useSyncExternalStore } from 'react';

/**
 * One shared 1-second ticker for every live countdown on the page — hundreds of
 * race cards must not each own a `setInterval`. The timer only runs while at
 * least one countdown is mounted.
 */

let now = Date.now();
const subscribers = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(cb: () => void): () => void {
  subscribers.add(cb);
  if (timer === undefined) {
    timer = setInterval(() => {
      now = Date.now();
      subscribers.forEach(fn => fn());
    }, 1000);
  }
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => now;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
