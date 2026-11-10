import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Music, Timer } from 'lucide-react';
import { useGetAllSongsQuery, useSearchSongsQuery } from '../services/songsApi';
import { useAppSelector } from '../app/hooks';
import { formatDuration } from '../utils/formatDuration';
import { formatTotalDuration } from '../utils/formatTotalDuration';
import EmptyState from '../components/common/EmptyState';
import ListControls, {
  ChipGroup,
  SortSelect,
} from '../components/common/ListControls';
import ListPage from '../components/common/ListPage';
import PageToolbar from '../components/common/PageToolbar';
import SearchBar from '../components/common/SearchBar';
import { SongListSkeleton } from '../components/common/Skeleton';
import StatCard from '../components/common/StatCard';
import CreateSongForm from '../components/forms/CreateSongForm';
import SongList from '../components/songs/SongList';
import type { IArtistRef, ISong } from '../types/api';
import './SongsPage.scss';

/** Sent by the artist page's "Add song", to open the form for that artist. */
interface SongsPageLocationState {
  createSong?: boolean;
  artist?: IArtistRef;
}

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'artist-asc', label: 'Artist A–Z' },
  { value: 'duration-asc', label: 'Shortest first' },
  { value: 'duration-desc', label: 'Longest first' },
];

const sortSongs = (songs: ISong[], sortBy: string): ISong[] => {
  const sorted = [...songs];

  switch (sortBy) {
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'artist-asc':
      return sorted.sort((a, b) =>
        (a.artist?.name ?? '').localeCompare(b.artist?.name ?? ''),
      );
    case 'duration-asc':
      return sorted.sort((a, b) => a.duration - b.duration);
    case 'duration-desc':
      return sorted.sort((a, b) => b.duration - a.duration);
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
};

/** Every genre used by at least one of the songs, A to Z. */
const getGenreNames = (songs: ISong[]): string[] => {
  const names = songs.flatMap((song) =>
    (song.genres ?? []).map((genre) => genre.name),
  );

  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
};

/** The whole library: headline numbers, then the songs to sort and filter. */
const SongLibrary = ({ songs }: { songs: ISong[] }) => {
  const [sortBy, setSortBy] = useState('title-asc');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((current) =>
      current.includes(genre)
        ? current.filter((name) => name !== genre)
        : [...current, genre],
    );
  };

  // With no genre picked every song is shown.
  const matchingSongs =
    selectedGenres.length === 0
      ? songs
      : songs.filter((song) =>
          song.genres?.some((genre) => selectedGenres.includes(genre.name)),
        );
  const visibleSongs = sortSongs(matchingSongs, sortBy);

  return (
    <>
      <div className="stat-row">
        <StatCard
          icon={<Music size={20} />}
          value={songs.length}
          label={songs.length === 1 ? 'Song' : 'Songs'}
        />
        <StatCard
          icon={<Clock size={20} />}
          value={totalSeconds}
          format={formatTotalDuration}
          label="Total length"
        />
        <StatCard
          icon={<Timer size={20} />}
          value={totalSeconds / songs.length}
          format={formatDuration}
          label="Average song"
        />
      </div>

      <ListControls>
        <SortSelect
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={setSortBy}
        />
        <ChipGroup
          label="Filter by genre"
          options={getGenreNames(songs)}
          selected={selectedGenres}
          onToggle={toggleGenre}
        />
      </ListControls>

      {visibleSongs.length === 0 ? (
        <EmptyState
          context="no-filter-results"
          description="No songs match the selected genres."
          action={{ label: 'Clear filters', onClick: () => setSelectedGenres([]) }}
        />
      ) : (
        <SongList songs={visibleSongs} />
      )}
    </>
  );
};

const SongsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const incomingState = location.state as SongsPageLocationState | null;
  const [isCreateOpen, setIsCreateOpen] = useState(
    Boolean(incomingState?.createSong),
  );
  const [initialArtist, setInitialArtist] = useState<IArtistRef | null>(
    incomingState?.artist ?? null,
  );

  // The state above is read once, on the render this navigation caused; clear
  // it so reloading the page doesn't reopen the form.
  useEffect(() => {
    if (incomingState) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [incomingState, location.pathname, navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const isSearching = searchTerm.length > 0;

  // Only one of the two runs: the full list, or the search endpoint once
  // something has been typed.
  const { data: allSongs, isLoading: isLoadingAll } = useGetAllSongsQuery(
    undefined,
    { skip: isSearching },
  );
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchSongsQuery(searchTerm, { skip: !isSearching });

  const handleCreateToggle = () => {
    setIsCreateOpen((open) => {
      // Closing the form drops the artist it was prefilled with, so reopening
      // it starts blank.
      if (open) setInitialArtist(null);
      return !open;
    });
  };

  const renderResults = () => {
    if (isSearching) {
      if (isLoadingSearch) return <SongListSkeleton rows={10} />;
      if (!searchResults?.length) {
        return (
          <EmptyState
            context="no-search-results"
            description={`No songs match “${searchTerm}”.`}
          />
        );
      }
      return <SongList songs={searchResults} />;
    }

    if (isLoadingAll) return <SongListSkeleton rows={10} />;
    if (!allSongs?.length) return <EmptyState context="no-songs" />;
    return <SongLibrary songs={allSongs} />;
  };

  return (
    <ListPage>
      <PageToolbar
        title="Songs"
        createLabel="New song"
        isCreateOpen={isCreateOpen}
        onCreateToggle={isAdmin ? handleCreateToggle : undefined}
      />
      {isAdmin && isCreateOpen && (
        <CreateSongForm initialArtist={initialArtist} />
      )}
      <SearchBar
        placeholder="Search songs by title..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {renderResults()}
    </ListPage>
  );
};

export default SongsPage;
