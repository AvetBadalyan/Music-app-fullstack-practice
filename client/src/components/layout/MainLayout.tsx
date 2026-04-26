import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import './MainLayout.scss';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
