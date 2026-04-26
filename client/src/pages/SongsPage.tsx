import { useState } from 'react';
import { useGetAllSongsQuery, useSearchSongsQuery } from '../services/songsApi';
import SongList from '../components/songs/SongList';
import SearchBar from '../components/common/SearchBar';
import './SongsPage.scss';

const SongsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: allSongs, isLoading: allLoading } = useGetAllSongsQuery();
  const { data: searchResults, isLoading: searchLoading } = useSearchSongsQuery(
    searchTerm,
    { skip: searchTerm.length === 0 }
  );

  const songs = searchTerm ? searchResults : allSongs;
  const isLoading = searchTerm ? searchLoading : allLoading;

  return (
    <div className="songs-page">
      <h1>Songs</h1>
      <SearchBar
        placeholder="Search songs by title..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <SongList songs={songs ?? []} />
      )}
    </div>
  );
};

export default SongsPage;
