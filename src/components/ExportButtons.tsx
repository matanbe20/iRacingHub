import React, { useState } from 'react';
import useStore from '../store/useStore';
import { exportCSV, exportICS } from '../utils/helpers';
import { IconCalendarExport, IconDownload, IconPdf, IconShare } from './icons';
import type { RaceEntry } from '../types';

export default function ExportButtons() {
  const mySchedule = useStore(s => s.mySchedule);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  function handleShare() {
    const ids = Object.keys(mySchedule);
    const encoded = btoa(JSON.stringify(ids));
    const url = location.origin + location.pathname + '?share=' + encoded + '&tab=my';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => { prompt('Copy this URL:', url); });
    } else {
      prompt('Copy this URL:', url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try {
      const entries = Object.values(mySchedule) as RaceEntry[];
      entries.sort((a, b) => {
        if (a.weekNum !== b.weekNum) return a.weekNum - b.weekNum;
        return a.displayName.localeCompare(b.displayName);
      });
      const groups: Record<string, RaceEntry[]> = {};
      const groupOrder: string[] = [];
      entries.forEach(e => {
        const key = 'Week ' + e.weekNum + '   ' + e.date;
        if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
        groups[key].push(e);
      });
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      // Lazy-load the PDF library so it doesn't bloat the initial bundle
      const [{ pdf }, { SchedulePDFDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./PrintSchedule'),
      ]);

      const blob = await pdf(
        <SchedulePDFDocument entries={entries} groups={groups} groupOrder={groupOrder} today={today} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iracing-2026s3-my-schedule.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="export-group">
      <button
        className={'export-btn' + (copied ? ' export-btn-copied' : '')}
        onClick={handleShare}
        title="Share"
      >
        <IconShare />
        <span className="btn-label">{copied ? 'Copied!' : 'Share'}</span>
      </button>
      <button className="export-btn" onClick={() => exportCSV(mySchedule)} title="Download CSV">
        <IconDownload />
        <span className="btn-label">Download CSV</span>
      </button>
      <button className="export-btn" onClick={() => exportICS(mySchedule)} title="Download .ics">
        <IconCalendarExport />
        <span className="btn-label">Download .ics</span>
      </button>
      <button className="export-btn" onClick={handleDownloadPDF} disabled={pdfLoading} title="Download PDF">
        <IconPdf />
        <span className="btn-label">{pdfLoading ? 'Generating…' : 'Download PDF'}</span>
      </button>
    </div>
  );
}
