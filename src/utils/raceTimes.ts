import type { TimeFormat } from '../types';

/**
 * Race session timing.
 *
 * The schedule data carries no structured start times - only a free-text
 * `Series.frequency` sentence. This module turns those sentences into concrete
 * UTC timestamps so they can be shown in the viewer's timezone.
 *
 * iRacing anchors every session to the UTC hour grid, so an interval pattern
 * like "every 2 hours at :15 past" means 00:15, 02:15, 04:15 … UTC.
 */

export type FreqKind = 'interval' | 'timeslots' | 'unknown';

export interface TimeSlot {
  /** 0 = Sunday … 6 = Saturday, in UTC */
  utcDay: number;
  hour: number;
  minute: number;
}

export interface RaceSchedulePattern {
  kind: FreqKind;
  /** interval: minute-of-hour offsets, ascending - e.g. [15, 45] */
  minutes?: number[];
  /** interval: 60 (every hour) or 120 (every 2 hours) */
  hourStep?: number;
  /** interval + hourStep 120: which UTC hours are used */
  parity?: 'even' | 'odd';
  /** timeslots: explicit GMT day + time list */
  slots?: TimeSlot[];
}

const DAY_INDEX: Record<string, number> = {
  sunday: 0, sundays: 0, suns: 0, sun: 0,
  monday: 1, mondays: 1, mon: 1,
  tuesday: 2, tuesdays: 2, tues: 2, tue: 2,
  wednesday: 3, wednesdays: 3, weds: 3, wed: 3,
  thursday: 4, thursdays: 4, thurs: 4, thur: 4, thu: 4,
  friday: 5, fridays: 5, fri: 5,
  saturday: 6, saturdays: 6, sats: 6, sat: 6,
};

// Longest spellings first so "thursday" isn't consumed as "thu".
const DAY_ALT = [
  'sundays', 'sunday', 'suns', 'sun',
  'mondays', 'monday', 'mon',
  'tuesdays', 'tuesday', 'tues', 'tue',
  'wednesdays', 'wednesday', 'weds', 'wed',
  'thursdays', 'thursday', 'thurs', 'thur', 'thu',
  'fridays', 'friday', 'fri',
  'saturdays', 'saturday', 'sats', 'sat',
].join('|');

/** Matches a day name, or an hour with an optional `:mm` ("17:00", "7", "1"). */
const TOKEN_RE = new RegExp(`\\b(${DAY_ALT})\\b|\\b(\\d{1,2})(?::(\\d{2}))?\\b`, 'g');

/**
 * Parses the day/hour lists of a GMT timeslot sentence, e.g.
 * "Races Thur & Sat at 10, 19 GMT & Fri & Sun at 1,4 GMT".
 *
 * Walks tokens left to right: a run of consecutive day names forms a group, and
 * the numbers that follow (up to the next day name) are that group's GMT times.
 */
function parseTimeslots(s: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let days: number[] = [];
  let times: { hour: number; minute: number }[] = [];

  const flush = () => {
    for (const utcDay of days) {
      for (const t of times) slots.push({ utcDay, hour: t.hour, minute: t.minute });
    }
    days = [];
    times = [];
  };

  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(s)) !== null) {
    if (m[1] !== undefined) {
      // A day name after we've already collected times starts a new group.
      if (times.length > 0) flush();
      const idx = DAY_INDEX[m[1]];
      if (idx !== undefined && !days.includes(idx)) days.push(idx);
    } else if (days.length > 0) {
      const hour = Number(m[2]);
      const minute = m[3] !== undefined ? Number(m[3]) : 0;
      if (hour <= 23 && minute <= 59) times.push({ hour, minute });
    }
  }
  flush();
  return slots;
}

function parseMinuteOffsets(s: string): number[] {
  const found = new Set<number>();
  for (const m of s.matchAll(/:(\d{2})\b/g)) {
    const v = Number(m[1]);
    if (v <= 59) found.add(v);
  }
  for (const m of s.matchAll(/\b(\d{1,2})\s*(?:past|after)\b/g)) {
    const v = Number(m[1]);
    if (v <= 59) found.add(v);
  }
  if (/half past/.test(s)) found.add(30);
  return [...found].sort((a, b) => a - b);
}

const patternCache = new Map<string, RaceSchedulePattern>();

export function parseFrequency(freq: string): RaceSchedulePattern {
  const cached = patternCache.get(freq);
  if (cached) return cached;

  // Only the race cadence matters - drop trailing qualifying info after "|".
  const s = freq.toLowerCase().split('|')[0];
  let result: RaceSchedulePattern;

  if (s.includes('gmt')) {
    const slots = parseTimeslots(s);
    result = slots.length > 0 ? { kind: 'timeslots', slots } : { kind: 'unknown' };
  } else {
    const half = /every\s+(?:30|thirty)\s+minutes/.test(s);
    const twoHourly = /\b2\s+hours\b/.test(s);
    const hourly = /hourly|every\s+hour|each\s+hour|every\s+other\s+hour/.test(s);
    let minutes = parseMinuteOffsets(s);

    if (!half && !twoHourly && !hourly && minutes.length === 0) {
      // "4 Timeslots Per Week" and friends - no timing information at all.
      result = { kind: 'unknown' };
    } else {
      if (half) {
        // "every 30 minutes at :15" implies :15 and :45.
        if (minutes.length === 0) minutes = [0, 30];
        else if (minutes.length === 1) minutes = [minutes[0], (minutes[0] + 30) % 60].sort((a, b) => a - b);
      }
      if (minutes.length === 0) minutes = [0];
      result = half
        ? { kind: 'interval', minutes, hourStep: 60 }
        : twoHourly
          // An unqualified "every 2 hours" runs on even UTC hours.
          ? { kind: 'interval', minutes, hourStep: 120, parity: /\bodd\b/.test(s) ? 'odd' : 'even' }
          : { kind: 'interval', minutes, hourStep: 60 };
    }
  }

  patternCache.set(freq, result);
  return result;
}

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

/**
 * An iRacing race week runs Tuesday 00:00 GMT → Monday 23:59 GMT. `Week.date` is
 * usually that Tuesday, but endurance and heat-race series store their actual
 * race day instead, so normalize to the Tuesday at or before the given date.
 */
export function raceWeekStartUtc(weekDate: string): number {
  const ms = Date.parse(weekDate + 'T00:00:00Z');
  if (Number.isNaN(ms)) return NaN;
  const daysSinceTuesday = (new Date(ms).getUTCDay() - 2 + 7) % 7;
  return ms - daysSinceTuesday * DAY_MS;
}

/**
 * The week entry to use for a series-level "next race", i.e. the earliest whose race
 * week hasn't ended yet. Not the same as the season's current week: short-season
 * series (Creventic, DTM, the endurance championships) have no entry for many weeks,
 * so their next race can be several weeks out. Null once the series is over.
 */
export function upcomingWeek<T extends { date: string }>(weeks: T[], now: number): T | null {
  let best: T | null = null;
  let bestStart = Infinity;
  for (const w of weeks) {
    const start = raceWeekStartUtc(w.date);
    if (Number.isNaN(start)) continue;
    if (now < start + 7 * DAY_MS && start < bestStart) {
      best = w;
      bestStart = start;
    }
  }
  return best;
}

/**
 * The next session start (UTC ms) for a series in a given race week, or null when
 * there is no answer: an unparseable frequency, or a week that is already over.
 * For a week that hasn't begun yet, returns that week's first session.
 */
export function getNextSession(freq: string, weekDate: string, now: number): number | null {
  const p = parseFrequency(freq);
  if (p.kind === 'unknown') return null;

  const weekStart = raceWeekStartUtc(weekDate);
  if (Number.isNaN(weekStart)) return null;
  const weekEnd = weekStart + 7 * DAY_MS;
  if (now >= weekEnd) return null;

  // Keep a session that just went green visible for a minute instead of skipping it.
  const from = Math.max(weekStart, now - 60_000);

  if (p.kind === 'timeslots') {
    let best: number | null = null;
    for (const slot of p.slots!) {
      const ts = weekStart
        + ((slot.utcDay - 2 + 7) % 7) * DAY_MS
        + slot.hour * HOUR_MS
        + slot.minute * 60_000;
      if (ts >= from && ts < weekEnd && (best === null || ts < best)) best = ts;
    }
    return best;
  }

  const minutes = p.minutes!;
  const hourStart = Math.floor(from / HOUR_MS) * HOUR_MS;
  // Sessions run at least every 2 hours, so a couple of hours of lookahead is
  // plenty; the bound only guards against a malformed pattern.
  for (let i = 0; i < 48; i++) {
    const hourTs = hourStart + i * HOUR_MS;
    if (hourTs >= weekEnd) return null;
    if (hourTs < weekStart) continue;
    if (p.hourStep === 120) {
      const isEven = new Date(hourTs).getUTCHours() % 2 === 0;
      if (isEven !== (p.parity !== 'odd')) continue;
    }
    for (const m of minutes) {
      const ts = hourTs + m * 60_000;
      if (ts >= from && ts < weekEnd) return ts;
    }
  }
  return null;
}

/**
 * The earliest upcoming session across several race weeks. Used for the series-level
 * chip, which must look past the current week: a series racing only Thu/Fri has
 * nothing left from Friday night until the week flips, but its next race still exists.
 * Pass a single date to scope the answer to one specific race.
 */
export function nextSessionAcross(freq: string, weekDates: string[], now: number): number | null {
  let best: number | null = null;
  for (const date of weekDates) {
    // Weeks starting after a hit can't beat it, and past weeks return null cheaply.
    if (best !== null && raceWeekStartUtc(date) > best) continue;
    const ts = getNextSession(freq, date, now);
    if (ts !== null && (best === null || ts < best)) best = ts;
  }
  return best;
}

// ── Formatting ───────────────────────────────────────────────────────────────

const fmtCache = new Map<string, Intl.DateTimeFormat>();

function formatter(key: string, tz: string, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const cacheKey = key + '|' + tz;
  let f = fmtCache.get(cacheKey);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat(undefined, { ...opts, timeZone: tz });
    } catch {
      f = new Intl.DateTimeFormat(undefined, opts);
    }
    fmtCache.set(cacheKey, f);
  }
  return f;
}

function timeFormatter(tz: string, fmt: TimeFormat): Intl.DateTimeFormat {
  return fmt === '12h'
    ? formatter('t12', tz, { hour: 'numeric', minute: '2-digit', hour12: true })
    // hourCycle h23 avoids "24:00" for midnight, which hour12:false can produce.
    : formatter('t24', tz, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
}

/** Stable per-timezone calendar-day key, so "is this today?" never uses local getDate(). */
function dayKey(utcMs: number, tz: string): string {
  return formatter('day', tz, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(utcMs);
}

export function resolveTimeZone(tz?: string | null): string {
  if (tz) {
    try {
      new Intl.DateTimeFormat(undefined, { timeZone: tz });
      return tz;
    } catch { /* fall through to the browser zone */ }
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

/**
 * "18:00" today, "Sat 18:00" within the coming week, "Aug 29, 18:00" beyond that -
 * a bare weekday would be ambiguous for the biweekly endurance series, whose next
 * event can be over a month out.
 */
export function formatSessionTime(utcMs: number, tz: string, fmt: TimeFormat, now = Date.now()): string {
  const time = timeFormatter(tz, fmt).format(utcMs);
  if (dayKey(utcMs, tz) === dayKey(now, tz)) return time;
  if (utcMs - now >= 6 * DAY_MS) {
    return formatter('md', tz, { month: 'short', day: 'numeric' }).format(utcMs) + ', ' + time;
  }
  return formatter('wd', tz, { weekday: 'short' }).format(utcMs) + ' ' + time;
}

/** "3d 4h" · "2h 07m" · "42m 13s" · "Now" */
export function formatCountdown(ms: number): string {
  if (ms <= 60_000) return 'Now';
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86_400);
  const h = Math.floor((totalSec % 86_400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * The raw frequency sentence plus a restatement in the viewer's timezone, on a
 * second line. Used as the `.series-freq` tooltip text (rendered via
 * `content: attr(data-freq)` with `white-space: pre-line`).
 */
export function localizedFrequencyLabel(
  freq: string,
  weekDate: string,
  tz: string,
  fmt: TimeFormat,
): string {
  const p = parseFrequency(freq);
  const weekStart = raceWeekStartUtc(weekDate);
  if (p.kind === 'unknown' || Number.isNaN(weekStart)) return freq;

  if (p.kind === 'timeslots') {
    const slots = [...p.slots!]
      .map(slot => weekStart + ((slot.utcDay - 2 + 7) % 7) * DAY_MS + slot.hour * HOUR_MS + slot.minute * 60_000)
      .sort((a, b) => a - b);
    const wd = formatter('wd', tz, { weekday: 'short' });
    const tf = timeFormatter(tz, fmt);
    const shown = slots.slice(0, 5).map(ts => wd.format(ts) + ' ' + tf.format(ts));
    if (slots.length > shown.length) shown.push('…');
    return freq + '\nYour time: ' + shown.join(', ');
  }

  // Half-hour-offset zones (e.g. Asia/Kolkata) shift the minute mark, so read it
  // back off a real occurrence rather than doing arithmetic on the UTC minute.
  const minuteOf = formatter('min', tz, { minute: 'numeric' });
  const localMinutes = [...new Set(
    p.minutes!.map(m => Number(minuteOf.format(weekStart + m * 60_000)))
  )].sort((a, b) => a - b);

  const cadence = p.hourStep === 120
    ? 'every 2 hours'
    : p.minutes!.length > 1 ? 'every 30 min' : 'every hour';
  return freq + '\nYour time: ' + cadence + ' at ' + localMinutes.map(m => ':' + pad2(m)).join(', ');
}
