import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import type { IAlbum } from '../../types/api';
import { getReleaseYear } from '../../utils/getReleaseYear';
import './NewReleasesCarousel.scss';

interface NewReleasesCarouselProps {
  albums: IAlbum[];
  isLoading: boolean;
}

// The first covers are on screen as soon as the page loads (and are often the
// largest thing painted), so they must not be lazy-loaded. The rest still are.
const EAGER_COVER_COUNT = 3;

// Skeleton cards shown while loading. Four fill a desktop row.
const SKELETON_COUNT = 4;

/** "Ray Charles · 2004" - the artist and the release year, whichever are known. */
const describeRelease = (album: IAlbum) =>
  [album.artist?.name, getReleaseYear(album.releaseDate)]
    .filter(Boolean)
    .join(' · ');

/** A row of album covers that scrolls sideways when there are too many to fit. */
const NewReleasesCarousel = ({ albums, isLoading }: NewReleasesCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  // An arrow is only useful while there is something to scroll to.
  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollBack(track.scrollLeft > 0);
    // The -1 forgives sub-pixel rounding at the far end.
    setCanScrollForward(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    );
  }, []);

  // Check again when the cards arrive and when the window is resized,
  // because both change how much of the row fits on screen.
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows, { passive: true });
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows, albums.length, isLoading]);

  const scrollTrack = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Move most of a screen at a time; scroll-snap settles on the nearest card.
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="new-releases">
      <button
        type="button"
        className="new-releases__arrow new-releases__arrow--previous"
        onClick={() => scrollTrack(-1)}
        disabled={!canScrollBack}
        aria-label="Show earlier releases"
      >
        <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      <div
        ref={trackRef}
        className="new-releases__track"
        onScroll={updateArrows}
        // A scrolling area needs to be reachable with the keyboard so the
        // arrow keys can scroll it. When everything fits there is no need.
        tabIndex={canScrollBack || canScrollForward ? 0 : undefined}
        role="group"
        aria-label="New releases"
        aria-busy={isLoading}
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <div
                key={index}
                className="new-releases__card new-releases__card--skeleton"
                aria-hidden="true"
              >
                <span className="skeleton new-releases__cover" />
                <p className="new-releases__title">
                  <span className="skeleton new-releases__line" />
                </p>
                <p className="new-releases__meta">
                  <span className="skeleton new-releases__line" />
                </p>
              </div>
            ))
          : albums.map((album, index) => (
              <Link
                key={album.id}
                to={`/albums/${album.id}`}
                className="new-releases__card"
              >
                <div className="new-releases__cover">
                  {album.coverImage ? (
                    // The title below already names the album.
                    <img
                      src={album.coverImage}
                      alt=""
                      width="200"
                      height="200"
                      loading={index < EAGER_COVER_COUNT ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  ) : (
                    <div className="new-releases__placeholder">
                      <Music size={28} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <p className="new-releases__title">{album.title}</p>
                <p className="new-releases__meta">{describeRelease(album)}</p>
              </Link>
            ))}
      </div>

      <button
        type="button"
        className="new-releases__arrow new-releases__arrow--next"
        onClick={() => scrollTrack(1)}
        disabled={!canScrollForward}
        aria-label="Show later releases"
      >
        <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
};

export default NewReleasesCarousel;
