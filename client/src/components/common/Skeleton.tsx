import './Skeleton.scss';

/**
 * Placeholders shown in the shape of the content that is loading, so a page
 * does not shift once the data lands. One per layout the app uses: the track
 * list, the album/artist card grids, and the genre tiles.
 */

interface SongListSkeletonProps {
  rows?: number;
}

export const SongListSkeleton = ({ rows = 6 }: SongListSkeletonProps) => (
  <div className="song-list-skeleton" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="skeleton-row">
        <span className="skeleton sk-index" />
        <div className="sk-info">
          <span className="skeleton sk-title" />
          <span className="skeleton sk-sub" />
        </div>
        <span className="skeleton sk-album" />
        <span className="skeleton sk-duration" />
      </div>
    ))}
  </div>
);

interface CardGridSkeletonProps {
  count?: number;
  /** 'circle' matches the round artist avatars; 'square' the album covers. */
  shape?: 'square' | 'circle';
}

export const CardGridSkeleton = ({
  count = 6,
  shape = 'square',
}: CardGridSkeletonProps) => (
  <div className="card-grid-skeleton" aria-busy="true" aria-label="Loading">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="skeleton-card">
        <span className={`skeleton sk-media sk-media--${shape}`} />
        <span className="skeleton sk-card-title" />
        <span className="skeleton sk-card-sub" />
      </div>
    ))}
  </div>
);

interface TileGridSkeletonProps {
  count?: number;
}

export const TileGridSkeleton = ({ count = 6 }: TileGridSkeletonProps) => (
  <div className="tile-grid-skeleton" aria-busy="true" aria-label="Loading">
    {Array.from({ length: count }, (_, index) => (
      <span key={index} className="skeleton sk-tile" />
    ))}
  </div>
);
