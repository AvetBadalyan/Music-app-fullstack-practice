import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import './MainLayout.scss';

const MainLayout = () => {
  // Drawer state for the mobile sidebar.
  // The Sidebar closes itself on every NavLink click, so explicit route-change handling isn't needed.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-layout">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
      />
      <div className="layout-body">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
