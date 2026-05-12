import './Skeleton.scss';

interface SongListSkeletonProps {
  rows?: number;
}

export const SongListSkeleton = ({ rows = 6 }: SongListSkeletonProps) => (
  <div
    className="song-list-skeleton"
    aria-busy="true"
    aria-label="Loading songs"
  >
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-row">
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

interface AlbumGridSkeletonProps {
  count?: number;
}

export const AlbumGridSkeleton = ({ count = 6 }: AlbumGridSkeletonProps) => (
  <div
    className="album-grid-skeleton"
    aria-busy="true"
    aria-label="Loading albums"
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-card">
        <span className="skeleton sk-cover" />
        <span className="skeleton sk-card-title" />
        <span className="skeleton sk-card-sub" />
      </div>
    ))}
  </div>
);
