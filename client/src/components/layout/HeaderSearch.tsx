import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc, Music2, Search, User, X } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSearchSongsQuery } from '../../services/songsApi';
import { useSearchArtistsQuery } from '../../services/artistsApi';
import { useSearchAlbumsQuery } from '../../services/albumsApi';
import './HeaderSearch.scss';

const MAX = 3; // max results per category

const HeaderSearch = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debounced = useDebouncedValue(query, 300);
  const skip = debounced.length < 1;

  const { data: songs = [] } = useSearchSongsQuery(debounced, { skip });
  const { data: artists = [] } = useSearchArtistsQuery(debounced, { skip });
  const { data: albums = [] } = useSearchAlbumsQuery(debounced, { skip });

  const hasResults =
    songs.length > 0 || artists.length > 0 || albums.length > 0;

  // Close when clicking outside
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // Ctrl/Cmd+K focuses the input from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const select = (route: string) => {
    navigate(route);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const showDropdown = open && debounced.length >= 1;

  return (
    <div ref={containerRef} className={`header-search${open ? ' header-search--open' : ''}`}>
      <Search className="header-search__icon" size={18} strokeWidth={2} aria-hidden />
      <input
        ref={inputRef}
        type="search"
        className="header-search__input"
        placeholder="Search…"
        value={query}
        aria-label="Search songs, artists, albums"
        autoComplete="off"
        spellCheck={false}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={e => {
          if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
        }}
      />
      {query && (
        <button
          type="button"
          className="header-search__clear"
          onClick={() => { setQuery(''); inputRef.current?.focus(); }}
          aria-label="Clear search"
          tabIndex={-1}
        >
          <X size={13} strokeWidth={2.5} aria-hidden />
        </button>
      )}

      {showDropdown && (
        <div className="header-search__dropdown" role="listbox" aria-label="Search results">

          {/* Songs */}
          {songs.length > 0 && (
            <p className="header-search__group-label">Songs</p>
          )}
          {songs.slice(0, MAX).map(s => (
            <button
              key={s.id}
              type="button"
              className="header-search__item"
              role="option"
              aria-selected={false}
              onClick={() => select(`/songs/${s.id}`)}
            >
              <span className="header-search__thumb header-search__thumb--rounded">
                {s.album?.coverImage ? (
                  <img src={s.album.coverImage} alt="" loading="lazy" />
                ) : (
                  <Music2 className="header-search__thumb-icon" size={18} strokeWidth={2} aria-hidden />
                )}
              </span>
              <span className="header-search__item-text">
                <span className="header-search__item-title">{s.title}</span>
                {s.artist && <span className="header-search__item-sub">{s.artist.name}</span>}
              </span>
            </button>
          ))}

          {/* Artists */}
          {artists.length > 0 && (
            <p className="header-search__group-label">Artists</p>
          )}
          {artists.slice(0, MAX).map(a => (
            <button
              key={a.id}
              type="button"
              className="header-search__item"
              role="option"
              aria-selected={false}
              onClick={() => select(`/artists/${a.id}`)}
            >
              <span className="header-search__thumb header-search__thumb--circle">
                {a.profilePicture ? (
                  <img src={a.profilePicture} alt="" loading="lazy" />
                ) : (
                  <User className="header-search__thumb-icon" size={18} strokeWidth={2} aria-hidden />
                )}
              </span>
              <span className="header-search__item-text">
                <span className="header-search__item-title">{a.name}</span>
                <span className="header-search__item-sub">Artist</span>
              </span>
            </button>
          ))}

          {/* Albums */}
          {albums.length > 0 && (
            <p className="header-search__group-label">Albums</p>
          )}
          {albums.slice(0, MAX).map(al => (
            <button
              key={al.id}
              type="button"
              className="header-search__item"
              role="option"
              aria-selected={false}
              onClick={() => select(`/albums/${al.id}`)}
            >
              <span className="header-search__thumb header-search__thumb--rounded">
                {al.coverImage ? (
                  <img src={al.coverImage} alt="" loading="lazy" />
                ) : (
                  <Disc className="header-search__thumb-icon" size={18} strokeWidth={2} aria-hidden />
                )}
              </span>
              <span className="header-search__item-text">
                <span className="header-search__item-title">{al.title}</span>
                {al.artist && <span className="header-search__item-sub">{al.artist.name}</span>}
              </span>
            </button>
          ))}

          {!hasResults && (
            <p className="header-search__empty">No results for "{debounced}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
