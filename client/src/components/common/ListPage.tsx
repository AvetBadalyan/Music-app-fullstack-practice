import type { ReactNode } from 'react';
import './ListPage.scss';

/**
 * The shell the list pages (songs, artists, albums, genres) share. It spaces
 * its direct children - toolbar, search, controls, results - with one gap, so
 * no section has to carry its own margin and the rhythm stays even.
 */
const ListPage = ({ children }: { children: ReactNode }) => (
  <div className="page list-page">{children}</div>
);

export default ListPage;
