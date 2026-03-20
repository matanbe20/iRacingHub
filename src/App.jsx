import React, { useEffect, useRef } from 'react';
import useStore from './store/useStore.js';
import Header from './components/Header.jsx';
import TabNav from './components/TabNav.jsx';
import FilterSidebar from './components/FilterSidebar.jsx';
import AllSeriesPanel from './components/AllSeriesPanel.jsx';
import ThisWeekPanel from './components/ThisWeekPanel.jsx';
import MySchedulePanel from './components/MySchedulePanel.jsx';
import ShareModal from './components/ShareModal.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const theme = useStore(s => s.theme);
  const isDrawerOpen = useStore(s => s.isDrawerOpen);
  const isShareModalOpen = useStore(s => s.isShareModalOpen);
  const activeTab = useStore(s => s.activeTab);
  const stickyRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Body class for drawer
  useEffect(() => {
    document.body.classList.toggle('drawer-active', isDrawerOpen);
    return () => document.body.classList.remove('drawer-active');
  }, [isDrawerOpen]);

  // Body class for share modal
  useEffect(() => {
    document.body.classList.toggle('share-modal-open', isShareModalOpen);
    return () => document.body.classList.remove('share-modal-open');
  }, [isShareModalOpen]);

  // --sticky-height ResizeObserver
  useEffect(() => {
    if (!stickyRef.current) return;
    const update = () => {
      const h = stickyRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--sticky-height', h + 'px');
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stickyRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div className="sticky-top" ref={stickyRef}>
        <Header />
        <TabNav />
      </div>

      <div className="main-layout">
        <FilterSidebar />
        <div className="content-area">
          <div className="container">
            {activeTab === 'all' && <AllSeriesPanel />}
            {activeTab === 'week' && <ThisWeekPanel />}
            {activeTab === 'my' && <MySchedulePanel />}
          </div>
        </div>
      </div>

      <Toast />
      <ShareModal />
    </>
  );
}
