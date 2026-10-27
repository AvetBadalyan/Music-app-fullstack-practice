import { useRef, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { useGetRecentAlbumsQuery } from '../../services/albumsApi';
import { truncateText } from '../../utils/truncateText';
import './NewReleasesCarousel.scss';

const MAX_ALBUMS = 8;
const SKELETON_COUNT = 4;

const NewReleasesCarousel = () => {
  const { data: albums, isLoading } = useGetRecentAlbumsQuery();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter to albums with a release date, capped at MAX_ALBUMS.
  const filtered = (albums ?? [])
    .filter((a) => a.releaseDate !== null)
    .slice(0, MAX_ALBUMS);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
    // Re-run when filtered length changes so arrows recalculate after data loads.
  }, [updateArrows, filtered.length]);

  const scrollByCard = useCallback((direction: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>('.new-releases__card');
    if (!firstCard) return;
    const columnGap = parseFloat(getComputedStyle(el).columnGap) || 16;
    const cardWidth = firstCard.offsetWidth + columnGap;
    el.scrollTo({
      left: el.scrollLeft + (direction === 'left' ? -cardWidth : cardWidth),
      behavior: 'smooth',
    });
  }, []);

  // Once loading is done, hide the section entirely when there's nothing to show.
  if (!isLoading && filtered.length === 0) return null;

  return (
    <section className="new-releases">
      <h2 className="new-releases__heading">New Releases</h2>

      <div className="new-releases__wrapper">
        {/* Left arrow */}
        <button
          type="button"
          className={`new-releases__arrow new-releases__arrow--left${canScrollLeft ? '' : ' new-releases__arrow--hidden'}`}
          onClick={() => scrollByCard('left')}
          aria-label="Scroll new releases left"
          aria-hidden={!canScrollLeft}
          tabIndex={canScrollLeft ? 0 : -1}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="new-releases__track"
          aria-busy={isLoading || undefined}
          aria-label={isLoading ? 'Loading new releases' : undefined}
        >
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <div key={i} className="new-releases__card new-releases__card--skeleton">
                  <span className="skeleton new-releases__skeleton-cover" />
                  <span className="skeleton new-releases__skeleton-title" />
                  <span className="skeleton new-releases__skeleton-sub" />
                </div>
              ))
            : filtered.map((album) => {
                const year = album.releaseDate
                  ? new Date(album.releaseDate).getFullYear()
                  : null;

                return (
                  <Link
                    key={album.id}
                    to={`/albums/${album.id}`}
                    className="new-releases__card"
                    aria-label={[
                      album.title,
                      album.artist ? `by ${album.artist.name}` : null,
                      year ? String(year) : null,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  >
                    <div className="new-releases__cover">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          width="200"
                          height="200"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="new-releases__placeholder"
                          aria-hidden="true"
                        >
                          <Music size={28} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <p className="new-releases__card-title">
                      {truncateText(album.title, 30)}
                    </p>

                    {album.artist && (
                      <p className="new-releases__card-sub">
                        {truncateText(album.artist.name, 30)}
                      </p>
                    )}

                    {year !== null && (
                      <p className="new-releases__card-year">{year}</p>
                    )}
                  </Link>
                );
              })}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          className={`new-releases__arrow new-releases__arrow--right${canScrollRight ? '' : ' new-releases__arrow--hidden'}`}
          onClick={() => scrollByCard('right')}
          aria-label="Scroll new releases right"
          aria-hidden={!canScrollRight}
          tabIndex={canScrollRight ? 0 : -1}
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
};

export default NewReleasesCarousel;
