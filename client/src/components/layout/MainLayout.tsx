import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import PageStatus from '../common/PageStatus';
import PageTransition from '../common/PageTransition';
import QueueSidebar from '../queue/QueueSidebar';
import './MainLayout.scss';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="main-layout">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <div className="layout-body">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="content">
          <Suspense fallback={<PageStatus isLoading>Loading...</PageStatus>}>
            <PageTransition transitionKey={location.key}>
              <Outlet />
            </PageTransition>
          </Suspense>
        </main>
      </div>
      <MusicPlayer />
      <QueueSidebar />
    </div>
  );
};

export default MainLayout;
