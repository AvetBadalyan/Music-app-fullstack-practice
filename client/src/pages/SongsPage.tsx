import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useGetAllSongsQuery, useSearchSongsQuery } from '../services/songsApi';
import SongList from '../components/songs/SongList';
import SearchBar from '../components/common/SearchBar';
import { SongListSkeleton } from '../components/common/Skeleton';
import CreateSongForm from '../components/forms/CreateSongForm';
import type { IArtist } from '../types/artist';

interface SongsPageLocationState {
  createSong?: boolean;
  artist?: IArtist;
}

const SongsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingState = location.state as SongsPageLocationState | null;
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(Boolean(incomingState?.createSong));
  const [initialArtist, setInitialArtist] = useState<IArtist | null>(
    incomingState?.artist ?? null,
  );

  useEffect(() => {
    if (incomingState?.createSong) {
      // Consume state so a later reload doesn't re-open the form.
      navigate(location.pathname, { replace: true, state: null });
    }
    // Run only when navigation delivers new state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingState]);
  const { data: allSongs, isLoading: allLoading } = useGetAllSongsQuery();
  const { data: searchResults, isLoading: searchLoading } = useSearchSongsQuery(
    searchTerm,
    {
      skip: searchTerm.length === 0,
    },
  );

  const songs = searchTerm ? searchResults : allSongs;
  const isLoading = searchTerm ? searchLoading : allLoading;

  return (
    <div className="songs-page">
      <div className="page-toolbar">
        <h1>Songs</h1>
        <button
          type="button"
          className="toolbar-toggle"
          onClick={() => {
            setShowForm((prev) => {
              if (prev) setInitialArtist(null);
              return !prev;
            });
          }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Close' : 'New song'}</span>
        </button>
      </div>
      {showForm && <CreateSongForm initialArtist={initialArtist} />}
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
