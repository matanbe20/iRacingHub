import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { RaceEntry } from '../types';
import { catClass, catLabel } from '../utils/helpers';

const CAT_COLORS: Record<string, string> = {
  oval: '#ef4444',
  sports: '#22c55e',
  formula: '#a855f7',
  'dirt-oval': '#f59e0b',
  'dirt-road': '#ec4899',
  unranked: '#6b7280',
};

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#111111',
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 42,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1.5,
    borderBottomColor: '#111111',
    paddingBottom: 6,
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -0.3,
    color: '#111111',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginTop: 1,
  },
  meta: {
    fontSize: 8,
    color: '#777777',
    textAlign: 'right',
  },
  weekBlock: {
    marginBottom: 13,
  },
  weekLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#222222',
    backgroundColor: '#f3f3f3',
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.75,
    borderBottomColor: '#bbbbbb',
    backgroundColor: '#fafafa',
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  th: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#666666',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
    paddingVertical: 3.5,
    paddingRight: 5,
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    fontSize: 8.5,
    color: '#111111',
    paddingHorizontal: 5,
  },
  cellCenter: {
    fontSize: 8.5,
    color: '#111111',
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  catCell: {
    fontSize: 8.5,
    paddingRight: 5,
    paddingLeft: 7,
    borderLeftWidth: 3,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 42,
    right: 42,
    borderTopWidth: 0.5,
    borderTopColor: '#dddddd',
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7.5,
    color: '#aaaaaa',
  },
});

// Column widths as percentages of page width
const COL = {
  cat:    '10%',
  series: '28%',
  cls:    '5%',
  car:    '22%',
  track:  '27%',
  laps:   '8%',
};

interface Props {
  entries: RaceEntry[];
  groups: Record<string, RaceEntry[]>;
  groupOrder: string[];
  today: string;
}

export function SchedulePDFDocument({ entries, groups, groupOrder, today }: Props) {
  return (
    <Document title="iRacing Hub — My Schedule" author="iracinghub.com">
      <Page size="A4" orientation="landscape" style={s.page}>
        {/* Header */}
        <View style={s.header} fixed>
          <View style={s.headerLeft}>
            <Text style={s.title}>iRacing Hub</Text>
            <Text style={s.subtitle}>2026 Season 2 — My Schedule</Text>
          </View>
          <Text style={s.meta}>Generated {today}{'\n'}{entries.length} race{entries.length !== 1 ? 's' : ''} saved</Text>
        </View>

        {/* Weeks */}
        {groupOrder.map(key => (
          <View key={key} style={s.weekBlock} wrap={false}>
            <Text style={s.weekLabel}>{key}</Text>

            {/* Table header */}
            <View style={s.tableHeader}>
              <Text style={[s.th, { width: COL.cat }]}>Category</Text>
              <Text style={[s.th, { width: COL.series }]}>Series</Text>
              <Text style={[s.th, { width: COL.cls, textAlign: 'center' }]}>Cls</Text>
              <Text style={[s.th, { width: COL.car }]}>Car</Text>
              <Text style={[s.th, { width: COL.track }]}>Track</Text>
              <Text style={[s.th, { width: COL.laps, textAlign: 'center' }]}>Laps</Text>
            </View>

            {/* Rows */}
            {groups[key].map((e, i) => {
              const cc = catClass(e.category);
              const color = CAT_COLORS[cc] || '#6b7280';
              return (
                <View key={e.id} style={[s.row, i % 2 === 1 ? s.rowEven : {}]}>
                  <View style={{ width: COL.cat }}>
                    <Text style={[s.catCell, { borderLeftColor: color, color }]}>
                      {catLabel(e.category)}
                    </Text>
                  </View>
                  <View style={{ width: COL.series }}>
                    <Text style={s.cell}>{e.displayName}</Text>
                  </View>
                  <View style={{ width: COL.cls }}>
                    <Text style={s.cellCenter}>{e.cls}</Text>
                  </View>
                  <View style={{ width: COL.car }}>
                    <Text style={s.cell}>{e.cars}</Text>
                  </View>
                  <View style={{ width: COL.track }}>
                    <Text style={s.cell}>{e.track}</Text>
                  </View>
                  <View style={{ width: COL.laps }}>
                    <Text style={s.cellCenter}>{e.laps || '—'}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>iracinghub.com</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
