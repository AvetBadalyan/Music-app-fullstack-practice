import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useGetAllSongsQuery, useSearchSongsQuery } from '../services/songsApi';
import SongList from '../components/songs/SongList';
import SearchBar from '../components/common/SearchBar';
import { SongListSkeleton } from '../components/common/Skeleton';
import CreateSongForm from '../components/forms/CreateSongForm';

const SongsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
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
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Close' : 'New song'}</span>
        </button>
      </div>
      {showForm && <CreateSongForm />}
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
