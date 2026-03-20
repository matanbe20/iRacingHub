import { create } from 'zustand';
import { SCHEDULE_DATA } from '../data.js';
import { cleanName } from '../utils/helpers.js';

const ALL_CATEGORIES = ['OVAL', 'SPORTS CAR', 'FORMULA CAR', 'DIRT OVAL', 'DIRT ROAD', 'UNRANKED'];
const ALL_CLASSES = ['R', 'D', 'C', 'B', 'A'];
const STORAGE_KEY = 'iracing-2026s2-filters';
const MY_SCHEDULE_KEY = 'iracing-2026s2-my-schedule';
const FAVORITES_KEY = 'iracing-2026s2-favorites';
const THEME_KEY = 'iracing-theme';

export { ALL_CATEGORIES, ALL_CLASSES };

function loadInitialState() {
  const params = new URLSearchParams(window.location.search);
  const hasUrlParams = params.has('cat') || params.has('cls') || params.has('q') || params.has('cars') || params.has('tracks');

  let filters;
  if (hasUrlParams) {
    const cats = params.get('cat');
    const cls = params.get('cls');
    const cars = params.get('cars');
    const tracks = params.get('tracks');
    filters = {
      activeCategories: new Set(cats ? cats.split(',').filter(c => ALL_CATEGORIES.includes(c)) : ALL_CATEGORIES),
      activeClasses: new Set(cls ? cls.split(',').filter(c => ALL_CLASSES.includes(c)) : ALL_CLASSES),
      searchQuery: params.get('q') || '',
      activeCars: new Set(cars ? cars.split(',').filter(Boolean) : []),
      activeTracks: new Set(tracks ? tracks.split(',').filter(Boolean) : []),
    };
  } else {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        filters = {
          activeCategories: new Set((saved.categories || ALL_CATEGORIES).filter(c => ALL_CATEGORIES.includes(c))),
          activeClasses: new Set((saved.classes || ALL_CLASSES).filter(c => ALL_CLASSES.includes(c))),
          searchQuery: saved.search || '',
          activeCars: new Set(saved.cars || []),
          activeTracks: new Set(saved.tracks || []),
        };
      }
    } catch {}
    if (!filters) {
      filters = {
        activeCategories: new Set(ALL_CATEGORIES),
        activeClasses: new Set(ALL_CLASSES),
        searchQuery: '',
        activeCars: new Set(),
        activeTracks: new Set(),
      };
    }
  }

  let mySchedule = {};
  try {
    const saved = JSON.parse(localStorage.getItem(MY_SCHEDULE_KEY));
    if (saved && typeof saved === 'object') mySchedule = saved;
  } catch {}

  let favorites = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    if (Array.isArray(saved)) favorites = new Set(saved);
  } catch {}

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  const tabParam = params.get('tab');
  let activeTab = 'all';
  if (tabParam === 'my') activeTab = 'my';
  else if (tabParam === 'week') activeTab = 'week';

  // Handle share param
  let sharedEntries = [];
  let isShareModalOpen = false;
  const shareParam = params.get('share');
  if (shareParam) {
    try {
      const sharedIds = JSON.parse(atob(shareParam));
      if (Array.isArray(sharedIds)) {
        sharedIds.forEach(id => {
          const sep = id.lastIndexOf('_');
          if (sep === -1) return;
          const rawName = id.slice(0, sep);
          const weekNum = Number(id.slice(sep + 1));
          const series = SCHEDULE_DATA.find(s => s.name === rawName);
          if (!series) return;
          const week = series.weeks.find(w => w.week === weekNum);
          if (!week) return;
          sharedEntries.push({
            id, rawName, weekNum,
            displayName: cleanName(rawName),
            category: series.category,
            cls: series.class,
            cars: series.cars,
            track: week.track,
            date: week.date,
            laps: week.laps || ''
          });
        });
        sharedEntries.sort((a, b) => {
          if (a.weekNum !== b.weekNum) return a.weekNum - b.weekNum;
          return a.displayName.localeCompare(b.displayName);
        });
        if (sharedEntries.length > 0) isShareModalOpen = true;
      }
    } catch {}
    // Clean share param from URL
    const cleanParams = new URLSearchParams(window.location.search);
    cleanParams.delete('share');
    const qs = cleanParams.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  return { ...filters, mySchedule, favorites, theme, activeTab, sharedEntries, isShareModalOpen };
}

function syncUrlParams(state) {
  const params = new URLSearchParams();
  const allCatsActive = ALL_CATEGORIES.every(c => state.activeCategories.has(c));
  const allClsActive = ALL_CLASSES.every(c => state.activeClasses.has(c));

  if (!allCatsActive) params.set('cat', [...state.activeCategories].join(','));
  if (!allClsActive) params.set('cls', [...state.activeClasses].join(','));
  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.activeCars.size > 0) params.set('cars', [...state.activeCars].join(','));
  if (state.activeTracks.size > 0) params.set('tracks', [...state.activeTracks].join(','));
  if (state.activeTab === 'my' || state.activeTab === 'week') params.set('tab', state.activeTab);

  const qs = params.toString();
  const url = window.location.pathname + (qs ? '?' + qs : '');
  history.replaceState(null, '', url);
}

function saveFilters(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    categories: [...state.activeCategories],
    classes: [...state.activeClasses],
    search: state.searchQuery,
    cars: [...state.activeCars],
    tracks: [...state.activeTracks],
  }));
}

const initialState = loadInitialState();

const useStore = create((set, get) => ({
  // Filters
  activeCategories: initialState.activeCategories,
  activeClasses: initialState.activeClasses,
  searchQuery: initialState.searchQuery,
  activeCars: initialState.activeCars,
  activeTracks: initialState.activeTracks,

  // Navigation & UI
  activeTab: initialState.activeTab,
  theme: initialState.theme,
  isDrawerOpen: false,
  isShareModalOpen: initialState.isShareModalOpen,
  sharedEntries: initialState.sharedEntries,
  toastMessage: null,

  // User data
  mySchedule: initialState.mySchedule,
  favorites: initialState.favorites,

  // Filter actions
  toggleCategory(cat) {
    set(state => {
      const next = new Set(state.activeCategories);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return { activeCategories: next };
    });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  filterByCategory(cat) {
    set(() => ({ activeCategories: new Set([cat]) }));
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  toggleClass(cls) {
    set(state => {
      const next = new Set(state.activeClasses);
      if (next.has(cls)) next.delete(cls); else next.add(cls);
      return { activeClasses: next };
    });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  filterByClass(cls) {
    set(() => ({ activeClasses: new Set([cls]) }));
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  setSearchQuery(query) {
    set({ searchQuery: query });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  addCarFilter(car) {
    set(state => ({ activeCars: new Set([...state.activeCars, car]) }));
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  removeCarFilter(car) {
    set(state => {
      const next = new Set(state.activeCars);
      next.delete(car);
      return { activeCars: next };
    });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  clearCarFilter() {
    set({ activeCars: new Set() });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  addTrackFilter(track) {
    set(state => ({ activeTracks: new Set([...state.activeTracks, track]) }));
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  removeTrackFilter(track) {
    set(state => {
      const next = new Set(state.activeTracks);
      next.delete(track);
      return { activeTracks: next };
    });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  clearTrackFilter() {
    set({ activeTracks: new Set() });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  clearAllFilters() {
    set({
      activeCategories: new Set(ALL_CATEGORIES),
      activeClasses: new Set(ALL_CLASSES),
      activeCars: new Set(),
      activeTracks: new Set(),
      searchQuery: '',
    });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  // Navigation
  setActiveTab(tab) {
    set({ activeTab: tab });
    const s = get();
    syncUrlParams(s); saveFilters(s);
  },

  // Theme
  toggleTheme() {
    set(state => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      document.documentElement.dataset.theme = next;
      return { theme: next };
    });
  },

  // Schedule actions
  addRace(rawName, weekNum) {
    const series = SCHEDULE_DATA.find(s => s.name === rawName);
    if (!series) return;
    const week = series.weeks.find(w => w.week === weekNum);
    if (!week) return;
    const id = rawName + '_' + weekNum;
    set(state => ({
      mySchedule: {
        ...state.mySchedule,
        [id]: {
          id, rawName, weekNum,
          displayName: cleanName(rawName),
          category: series.category,
          cls: series.class,
          cars: series.cars,
          track: week.track,
          date: week.date,
          laps: week.laps || ''
        }
      }
    }));
    const s = get();
    localStorage.setItem(MY_SCHEDULE_KEY, JSON.stringify(s.mySchedule));
  },

  removeRace(id) {
    set(state => {
      const next = { ...state.mySchedule };
      delete next[id];
      return { mySchedule: next };
    });
    const s = get();
    localStorage.setItem(MY_SCHEDULE_KEY, JSON.stringify(s.mySchedule));
  },

  toggleRace(rawName, weekNum) {
    const id = rawName + '_' + weekNum;
    const { mySchedule, addRace, removeRace } = get();
    if (mySchedule[id]) {
      removeRace(id);
    } else {
      addRace(rawName, weekNum);
    }
  },

  toggleSeries(rawName) {
    const series = SCHEDULE_DATA.find(s => s.name === rawName);
    if (!series) return;
    const { mySchedule } = get();
    const fullyAdded = series.weeks.every(w => !!mySchedule[rawName + '_' + w.week]);
    if (fullyAdded) {
      set(state => {
        const next = { ...state.mySchedule };
        series.weeks.forEach(w => { delete next[rawName + '_' + w.week]; });
        return { mySchedule: next };
      });
    } else {
      set(state => {
        const next = { ...state.mySchedule };
        series.weeks.forEach(w => {
          const id = rawName + '_' + w.week;
          if (!next[id]) {
            next[id] = {
              id, rawName, weekNum: w.week,
              displayName: cleanName(rawName),
              category: series.category,
              cls: series.class,
              cars: series.cars,
              track: w.track,
              date: w.date,
              laps: w.laps || ''
            };
          }
        });
        return { mySchedule: next };
      });
    }
    const s = get();
    localStorage.setItem(MY_SCHEDULE_KEY, JSON.stringify(s.mySchedule));
  },

  toggleFavorite(rawName) {
    set(state => {
      const next = new Set(state.favorites);
      if (next.has(rawName)) next.delete(rawName); else next.add(rawName);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return { favorites: next };
    });
  },

  // Drawer
  openDrawer() { set({ isDrawerOpen: true }); },
  closeDrawer() { set({ isDrawerOpen: false }); },

  // Share modal
  openShareModal(entries) { set({ sharedEntries: entries, isShareModalOpen: true }); },
  closeShareModal() { set({ isShareModalOpen: false }); },

  addSharedRace(id) {
    const { sharedEntries, mySchedule } = get();
    if (mySchedule[id]) return;
    const entry = sharedEntries.find(e => e.id === id);
    if (!entry) return;
    set(state => ({
      mySchedule: { ...state.mySchedule, [id]: { ...entry } }
    }));
    const s = get();
    localStorage.setItem(MY_SCHEDULE_KEY, JSON.stringify(s.mySchedule));
  },

  addAllShared() {
    const { sharedEntries, mySchedule } = get();
    const toAdd = sharedEntries.filter(e => !mySchedule[e.id]);
    if (!toAdd.length) return;
    set(state => {
      const next = { ...state.mySchedule };
      toAdd.forEach(e => { next[e.id] = { ...e }; });
      return { mySchedule: next };
    });
    const s = get();
    localStorage.setItem(MY_SCHEDULE_KEY, JSON.stringify(s.mySchedule));
    get().showToast(toAdd.length + ' race' + (toAdd.length !== 1 ? 's' : '') + ' added to your schedule');
  },

  // Filtered count (updated by AllSeriesPanel)
  filteredCount: 0,
  setFilteredCount(n) { set({ filteredCount: n }); },

  // Toast
  showToast(msg) {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 3500);
  },
  clearToast() { set({ toastMessage: null }); },
}));

export default useStore;
