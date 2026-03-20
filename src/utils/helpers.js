export function cleanName(name) {
  return name
    .replace(/\s*-\s*2026 Season\s*\d?\s*-?\s*(Fixed)?$/i, '')
    .replace(/\s*-\s*2026 Season\s*\d?\s*(Fixed)?$/i, '')
    .replace(/\s*2026 Season\s*\d?\s*-?\s*(Fixed)?$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function catClass(cat) {
  return {
    'OVAL': 'oval',
    'SPORTS CAR': 'sports',
    'FORMULA CAR': 'formula',
    'DIRT OVAL': 'dirt-oval',
    'DIRT ROAD': 'dirt-road',
    'UNRANKED': 'unranked'
  }[cat] || 'unranked';
}

export function catLabel(cat) {
  return {
    'OVAL': 'Oval',
    'SPORTS CAR': 'Sports Car',
    'FORMULA CAR': 'Formula',
    'DIRT OVAL': 'Dirt Oval',
    'DIRT ROAD': 'Dirt Road',
    'UNRANKED': 'Unranked'
  }[cat] || cat;
}

export function catLabelShort(cat) {
  return {
    'OVAL': 'Oval',
    'SPORTS CAR': 'S.Car',
    'FORMULA CAR': 'Formula',
    'DIRT OVAL': 'D.Oval',
    'DIRT ROAD': 'D.Road',
    'UNRANKED': 'Unrnk'
  }[cat] || cat;
}

export function baseTrackName(name) {
  const idx = name.indexOf(' - ');
  return (idx !== -1 ? name.slice(0, idx) : name).trim();
}

export function isFixed(name) {
  return /fixed/i.test(name);
}

export function parseDateStr(dateStr) {
  try { return new Date(dateStr + ', 2026').getTime(); } catch { return 0; }
}

export function getWeekDateRange(weekNum) {
  const seasonStart = new Date('2026-03-17');
  const start = new Date(seasonStart.getTime() + (weekNum - 1) * 7 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmt = d => months[d.getMonth()] + ' ' + d.getDate();
  return 'Week ' + weekNum + ' \u2014 ' + fmt(start) + ' \u2013 ' + fmt(end);
}

export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function exportCSV(mySchedule) {
  const entries = Object.values(mySchedule);
  if (!entries.length) return;
  entries.sort((a, b) => a.weekNum !== b.weekNum ? a.weekNum - b.weekNum : a.displayName.localeCompare(b.displayName));
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"';
  const rows = [['Week','Date','Series','Category','Class','Cars','Track','Laps'].map(esc).join(',')];
  entries.forEach(e => rows.push([e.weekNum, e.date, e.displayName, e.category, e.cls, e.cars, e.track, e.laps].map(esc).join(',')));
  downloadFile('iracing-2026s2-my-schedule.csv', rows.join('\n'), 'text/csv');
}

export function exportICS(mySchedule) {
  const entries = Object.values(mySchedule);
  if (!entries.length) return;
  entries.sort((a, b) => parseDateStr(a.date) - parseDateStr(b.date));
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'PRODID:-//iRacing Schedule//2026 Season 2//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'
  ];
  entries.forEach(e => {
    const d = new Date(e.date + ', 2026');
    const ds = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
    const uid = 'iracing-2026s2-' + e.id.replace(/[^a-zA-Z0-9]/g, '-') + '@iracing-schedule';
    lines.push(
      'BEGIN:VEVENT',
      'DTSTART;VALUE=DATE:' + ds,
      'DTEND;VALUE=DATE:' + ds,
      'SUMMARY:iRacing: ' + e.displayName + ' @ ' + e.track,
      'DESCRIPTION:Series: ' + e.displayName + '\\nTrack: ' + e.track + '\\nClass: ' + e.cls + '\\nCars: ' + e.cars + (e.laps ? '\\nLaps: ' + e.laps : ''),
      'UID:' + uid,
      'END:VEVENT'
    );
  });
  lines.push('END:VCALENDAR');
  downloadFile('iracing-2026s2-my-schedule.ics', lines.join('\r\n'), 'text/calendar');
}
