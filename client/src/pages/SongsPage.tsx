import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllSongsQuery, useSearchSongsQuery } from '../services/songsApi';
import { useAppSelector } from '../app/hooks';
import SongList from '../components/songs/SongList';
import PageToolbar from '../components/common/PageToolbar';
import SearchBar from '../components/common/SearchBar';
import { SongListSkeleton } from '../components/common/Skeleton';
import CreateSongForm from '../components/forms/CreateSongForm';
import type { IArtistRef } from '../types/api';

/** Sent by the artist page's "Add song", to open the form for that artist. */
interface SongsPageLocationState {
  createSong?: boolean;
  artist?: IArtistRef;
}

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

  // Only one of the two runs: the full list, or the search endpoint once
  // something has been typed.
  const { data: allSongs, isLoading: isLoadingAll } = useGetAllSongsQuery(
    undefined,
    { skip: searchTerm.length > 0 },
  );
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchSongsQuery(searchTerm, { skip: searchTerm.length === 0 });

  const songs = searchTerm ? searchResults : allSongs;
  const isLoading = searchTerm ? isLoadingSearch : isLoadingAll;

  const handleCreateToggle = () => {
    setIsCreateOpen((open) => {
      // Closing the form drops the artist it was prefilled with, so reopening
      // it starts blank.
      if (open) setInitialArtist(null);
      return !open;
    });
  };

  return (
    <div className="page">
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
      {isLoading ? (
        <SongListSkeleton rows={10} />
      ) : (
        <SongList songs={songs ?? []} />
      )}
    </div>
  );
};

export default SongsPage;
