import React, { useMemo } from 'react';
import useStore from '../store/useStore';
import { formatSessionTime, resolveTimeZone } from '../utils/raceTimes';
import Modal from './Modal';
import ThemeMockup from './ThemeMockup';
import type { Theme } from '../types';

const THEME_CHOICES: { value: Theme; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

/** Used only if the engine lacks Intl.supportedValuesOf (pre-2022 Safari/Firefox). */
const FALLBACK_ZONES = [
  'Pacific/Auckland', 'Australia/Sydney', 'Australia/Brisbane', 'Australia/Adelaide',
  'Australia/Perth', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore',
  'Asia/Hong_Kong', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Kolkata', 'Asia/Karachi',
  'Asia/Dubai', 'Asia/Tehran', 'Europe/Moscow', 'Asia/Jerusalem', 'Europe/Istanbul',
  'Africa/Johannesburg', 'Europe/Helsinki', 'Europe/Athens', 'Europe/Berlin',
  'Europe/Paris', 'Europe/Madrid', 'Europe/Rome', 'Europe/Amsterdam', 'Europe/Stockholm',
  'Europe/Warsaw', 'Europe/Prague', 'Europe/London', 'Europe/Dublin', 'Europe/Lisbon',
  'Atlantic/Reykjavik', 'America/Sao_Paulo', 'America/Argentina/Buenos_Aires',
  'America/Halifax', 'America/New_York', 'America/Toronto', 'America/Chicago',
  'America/Mexico_City', 'America/Denver', 'America/Phoenix', 'America/Los_Angeles',
  'America/Vancouver', 'America/Anchorage', 'Pacific/Honolulu', 'UTC',
];

/** Minutes east of UTC for a zone right now — used to sort the picker sensibly. */
function offsetMinutes(tz: string, at: number): number {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, timeZoneName: 'longOffset',
    }).formatToParts(at);
    const name = parts.find(p => p.type === 'timeZoneName')?.value ?? '';
    const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
    if (!m) return 0; // bare "GMT" means +00:00
    return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
  } catch {
    return 0;
  }
}

function offsetLabel(minutes: number): string {
  if (minutes === 0) return 'GMT+0';
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `GMT${sign}${h}` + (m ? ':' + String(m).padStart(2, '0') : '');
}

function buildZoneList(at: number): { tz: string; label: string }[] {
  let zones: string[];
  try {
    zones = typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : FALLBACK_ZONES;
  } catch {
    zones = FALLBACK_ZONES;
  }
  return zones
    .map(tz => ({ tz, offset: offsetMinutes(tz, at) }))
    .sort((a, b) => a.offset - b.offset || a.tz.localeCompare(b.tz))
    .map(({ tz, offset }) => ({ tz, label: `${tz.replace(/_/g, ' ')} (${offsetLabel(offset)})` }));
}

export default function SettingsModal() {
  const isOpen = useStore(s => s.isSettingsModalOpen);
  const closeSettingsModal = useStore(s => s.closeSettingsModal);
  const timeZone = useStore(s => s.timeZone);
  const timeZoneAuto = useStore(s => s.timeZoneAuto);
  const timeFormat = useStore(s => s.timeFormat);
  const showRaceTimes = useStore(s => s.showRaceTimes);
  const theme = useStore(s => s.theme);
  const setTheme = useStore(s => s.setTheme);
  const setTimeZone = useStore(s => s.setTimeZone);
  const setTimeFormat = useStore(s => s.setTimeFormat);
  const toggleRaceTimes = useStore(s => s.toggleRaceTimes);

  // Offsets are DST-dependent, so build the list once per open rather than at
  // module load — but not on every render, since it's ~430 Intl formats.
  const zones = useMemo(() => (isOpen ? buildZoneList(Date.now()) : []), [isOpen]);
  const browserZone = useMemo(() => resolveTimeZone(null), []);

  if (!isOpen) return null;

  // Preview against a fixed, recognisable slot (Saturday 18:00 GMT) so the effect
  // of a change is visible immediately.
  const previewUtc = Date.parse('2026-08-01T18:00:00Z');
  const preview = formatSessionTime(previewUtc, timeZone, timeFormat, previewUtc - 86_400_000);

  return (
    <Modal
      title="Settings"
      onClose={closeSettingsModal}
      size="lg"
      className="settings-modal"
      flushBody
      footer={<button className="modal-confirm-btn" onClick={closeSettingsModal}>Done</button>}
    >
      <div className="settings-body">
          <div className="settings-row">
            <span className="settings-label">Theme</span>
            <div className="settings-themes">
              {THEME_CHOICES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={'settings-theme' + (theme === c.value ? ' active' : '')}
                  onClick={() => setTheme(c.value)}
                  aria-pressed={theme === c.value}
                >
                  <ThemeMockup variant={c.value} />
                  <span className="settings-theme-name">
                    {c.label}
                    {theme === c.value && <span className="settings-theme-check">&#10003;</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <label className="settings-label" htmlFor="settings-tz">Time zone</label>
            <select
              id="settings-tz"
              className="settings-select"
              value={timeZoneAuto ? '__auto__' : timeZone}
              onChange={e => setTimeZone(e.target.value === '__auto__' ? null : e.target.value)}
            >
              <option value="__auto__">Auto — {browserZone.replace(/_/g, ' ')}</option>
              {zones.map(z => <option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
            <span className="settings-hint">Race times are shown in this zone.</span>
          </div>

          <div className="settings-row">
            <span className="settings-label">Clock</span>
            <div className="settings-seg">
              <button
                className={'settings-seg-btn' + (timeFormat === '24h' ? ' active' : '')}
                onClick={() => setTimeFormat('24h')}
              >24-hour</button>
              <button
                className={'settings-seg-btn' + (timeFormat === '12h' ? ' active' : '')}
                onClick={() => setTimeFormat('12h')}
              >12-hour</button>
            </div>
          </div>

          <div className="settings-row">
            <label className="settings-check">
              <input type="checkbox" checked={showRaceTimes} onChange={toggleRaceTimes} />
              Show race times &amp; countdowns
            </label>
            <span className="settings-hint">Turn off to hide every time chip on the race cards.</span>
          </div>

          <div className="settings-preview">
            A race at <strong>18:00 GMT</strong> on a Saturday shows as <strong>{preview}</strong>
          </div>

        <p className="settings-note">
          Start times come from each series&rsquo; published race frequency. A few series
          only list &ldquo;4 timeslots per week&rdquo; with no times, so they show no chip.
        </p>
      </div>
    </Modal>
  );
}
