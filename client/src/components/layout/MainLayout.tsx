import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MusicPlayer from './MusicPlayer';
import ErrorBoundary from '../common/ErrorBoundary';
import PageStatus from '../common/PageStatus';
import PageTransition from '../common/PageTransition';
import QueueSidebar from '../queue/QueueSidebar';
import './MainLayout.scss';

const SITE_NAME = 'MusicAvet';

// The text shown in the browser tab (and read out by screen readers when the
// page changes). Detail pages share one title per section.
const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return `${SITE_NAME} - Music library`;
  if (pathname === '/login') return `Admin sign in - ${SITE_NAME}`;

  const section = pathname.split('/')[1];
  const isDetailPage = pathname.split('/').length > 2;
  const titles: Record<string, string> = {
    songs: isDetailPage ? 'Song' : 'Songs',
    artists: isDetailPage ? 'Artist' : 'Artists',
    albums: isDetailPage ? 'Album' : 'Albums',
    genres: isDetailPage ? 'Genre' : 'Genres',
  };

  return `${titles[section] ?? 'Page not found'} - ${SITE_NAME}`;
};

// The sidebar is a sliding drawer below this width and a fixed column above
// it (the same 1025px breakpoint the stylesheets use).
const DESKTOP_QUERY = '(min-width: 1025px)';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Every new page starts at the top. A layout effect runs before the browser
  // paints, so the new page is never shown at the old scroll position first.
  // It depends on the pathname only: changing a filter in the query string
  // must not scroll the page.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Update the tab title, and move keyboard focus to the new page so screen
  // reader and keyboard users notice that the page changed. Not on the very
  // first load, where the browser already starts at the top of the page.
  useEffect(() => {
    document.title = getPageTitle(pathname);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Close the drawer on Escape, and when the window grows to desktop width
  // (otherwise it would still be "open" when the window shrinks again).
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div className="main-layout">
      {/* Lets keyboard users jump past the header and menu. */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
      />
      <div className="layout-body">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main id="main-content" className="content" tabIndex={-1} ref={mainRef}>
          {/* The key resets the boundary when the visitor navigates away from
              a page that crashed, so one broken page does not block the rest. */}
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageStatus isLoading>Loading...</PageStatus>}>
              <PageTransition transitionKey={pathname}>
                <Outlet />
              </PageTransition>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <MusicPlayer />
      <QueueSidebar />
    </div>
  );
};

export default MainLayout;
