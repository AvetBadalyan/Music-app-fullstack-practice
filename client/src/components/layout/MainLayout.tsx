import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import PageStatus from '../common/PageStatus';
import './MainLayout.scss';

const MainLayout = () => {
  // Drawer state for the mobile sidebar. The Sidebar closes itself on every
  // NavLink click, so no explicit route-change handling is needed.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-layout">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <div className="layout-body">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="content">
          {/* Inside the layout, so the header, nav and player stay on screen
              while the next page's bundle loads. */}
          <Suspense fallback={<PageStatus isLoading>Loading...</PageStatus>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
