import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Disc, Music2, Search, User, X } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSearchSongsQuery } from '../../services/songsApi';
import { useSearchArtistsQuery } from '../../services/artistsApi';
import { useSearchAlbumsQuery } from '../../services/albumsApi';
import './HeaderSearch.scss';

const MAX_PER_GROUP = 3;

interface ResultLinkProps {
  to: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  /** Shown instead of the image when there is none. */
  fallbackIcon: ReactNode;
  /** Artists get round pictures, everything else gets rounded squares. */
  isRound?: boolean;
  onSelect: () => void;
}

/** One row of the results list. */
const ResultLink = ({
  to,
  title,
  subtitle,
  image,
  fallbackIcon,
  isRound = false,
  onSelect,
}: ResultLinkProps) => (
  <Link to={to} className="header-search__item" onClick={onSelect}>
    <span
      className={`header-search__thumb${isRound ? ' header-search__thumb--round' : ''}`}
    >
      {image ? <img src={image} alt="" loading="lazy" /> : fallbackIcon}
    </span>
    <span className="header-search__item-text">
      <span className="header-search__item-title">{title}</span>
      {subtitle && <span className="header-search__item-sub">{subtitle}</span>}
    </span>
  </Link>
);

const HeaderSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  // Links the input to the dropdown so screen readers announce "has popup" and
  // find results without having to leave the input.
  const dropdownId = `${inputId}-results`;

  // Wait until the visitor pauses typing before asking the server.
  const term = useDebouncedValue(query, 300).trim();
  const skip = term.length === 0;
  const songsQuery = useSearchSongsQuery(term, { skip });
  const artistsQuery = useSearchArtistsQuery(term, { skip });
  const albumsQuery = useSearchAlbumsQuery(term, { skip });

  const songs = (songsQuery.data ?? []).slice(0, MAX_PER_GROUP);
  const artists = (artistsQuery.data ?? []).slice(0, MAX_PER_GROUP);
  const albums = (albumsQuery.data ?? []).slice(0, MAX_PER_GROUP);
  const hasResults = songs.length + artists.length + albums.length > 0;
  const isSearching =
    songsQuery.isFetching || artistsQuery.isFetching || albumsQuery.isFetching;
  const showDropdown = isOpen && term.length > 0;

  // Ctrl/Cmd + K jumps to the search box from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const resultLinks = Array.from(
      dropdownRef.current?.querySelectorAll('a') ?? [],
    );

    if (event.key === 'Escape') {
      // Chrome also clears a search field on Escape. Doing it ourselves,
      // and cancelling that, keeps the state and the screen in step.
      event.preventDefault();
      closeSearch();
    } else if (event.key === 'Enter' && event.target === inputRef.current) {
      // There is no results page, so Enter opens the first result.
      resultLinks[0]?.click();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      // The input comes first, followed by the results, top to bottom.
      const focusOrder: (HTMLElement | null)[] = [
        inputRef.current,
        ...resultLinks,
      ];
      const position = focusOrder.indexOf(
        document.activeElement as HTMLElement,
      );
      const step = event.key === 'ArrowDown' ? 1 : -1;
      focusOrder[position + step]?.focus();
    }
  };

  return (
    <div
      className="header-search"
      role="search"
      onKeyDown={handleKeyDown}
      // Close when focus leaves the whole widget (input and results).
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      {/* Clicking the icon focuses the input. On phones that is what opens
          the search, because the input is hidden until it has focus. */}
      <label htmlFor={inputId} className="header-search__icon">
        <Search size={18} strokeWidth={2} aria-hidden="true" />
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        className="header-search__input"
        placeholder="Search…"
        aria-label="Search songs, artists, albums"
        // Combobox: tells screen readers the input controls a results popup.
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        aria-controls={dropdownId}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {query && (
        <button
          type="button"
          className="header-search__clear"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          tabIndex={-1}
        >
          <X size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}

      {showDropdown && (
        <div
          ref={dropdownRef}
          id={dropdownId}
          className="header-search__dropdown"
          role="listbox"
          aria-label="Search results"
          // Keep focus in the input while a result is clicked. Otherwise the
          // input loses focus first, the list closes, and the click is lost.
          onMouseDown={(event) => event.preventDefault()}
        >
          {songs.length > 0 && (
            <p className="header-search__group-label">Songs</p>
          )}
          {songs.map((song) => (
            <ResultLink
              key={song.id}
              to={`/songs/${song.id}`}
              title={song.title}
              subtitle={song.artist?.name}
              image={song.album?.coverImage}
              fallbackIcon={<Music2 size={18} strokeWidth={2} aria-hidden="true" />}
              onSelect={closeSearch}
            />
          ))}

          {artists.length > 0 && (
            <p className="header-search__group-label">Artists</p>
          )}
          {artists.map((artist) => (
            <ResultLink
              key={artist.id}
              to={`/artists/${artist.id}`}
              title={artist.name}
              subtitle="Artist"
              image={artist.profilePicture}
              fallbackIcon={<User size={18} strokeWidth={2} aria-hidden="true" />}
              isRound
              onSelect={closeSearch}
            />
          ))}

          {albums.length > 0 && (
            <p className="header-search__group-label">Albums</p>
          )}
          {albums.map((album) => (
            <ResultLink
              key={album.id}
              to={`/albums/${album.id}`}
              title={album.title}
              subtitle={album.artist?.name}
              image={album.coverImage}
              fallbackIcon={<Disc size={18} strokeWidth={2} aria-hidden="true" />}
              onSelect={closeSearch}
            />
          ))}

          {!hasResults && (
            <p className="header-search__message" role="status">
              {isSearching ? 'Searching…' : `No results for “${term}”`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
