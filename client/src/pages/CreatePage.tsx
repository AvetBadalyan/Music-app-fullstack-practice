import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateAlbumMutation, useGetAllAlbumsQuery } from '../services/albumsApi';
import {
  useCreateArtistMutation,
  useSearchArtistsQuery,
} from '../services/artistsApi';
import { useCreateGenreMutation, useGetAllGenresQuery } from '../services/genresApi';
import { useCreateSongMutation } from '../services/songsApi';
import type { IArtist } from '../types/artist';
import './CreatePage.scss';

type FormFeedback = {
  kind: 'idle' | 'success' | 'error';
  message: string;
  linkPath?: string;
  linkLabel?: string;
};

const idleFeedback: FormFeedback = {
  kind: 'idle',
  message: '',
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error) {
      const apiError = error as {
        data?: { error?: string } | string;
      };

      if (typeof apiError.data === 'string') {
        return apiError.data;
      }

      if (apiError.data && typeof apiError.data === 'object' && 'error' in apiError.data) {
        return apiError.data.error ?? 'Request failed.';
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }

  return 'Request failed.';
};

interface ArtistPickerProps {
  label: string;
  selectedArtist: IArtist | null;
  onSelect: (artist: IArtist | null) => void;
  required?: boolean;
  hint?: string;
}

const ArtistPicker = ({
  label,
  selectedArtist,
  onSelect,
  required = false,
  hint,
}: ArtistPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const trimmedSearch = searchTerm.trim();
  const { data: artists, isFetching } = useSearchArtistsQuery(trimmedSearch, {
    skip: trimmedSearch.length === 0,
  });

  return (
    <div className="artist-picker">
      <label>
        <span>{label}</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search artists by name"
          required={required && !selectedArtist}
        />
      </label>

      {hint && <p className="field-hint">{hint}</p>}

      {selectedArtist && (
        <div className="selected-pill">
          <span>Selected: {selectedArtist.name}</span>
          <button type="button" onClick={() => onSelect(null)}>
            Clear
          </button>
        </div>
      )}

      {trimmedSearch.length > 0 && (
        <div className="picker-results">
          {isFetching ? (
            <p>Searching...</p>
          ) : artists && artists.length > 0 ? (
            artists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                className="picker-option"
                onClick={() => {
                  onSelect(artist);
                  setSearchTerm('');
                }}
              >
                <strong>{artist.name}</strong>
                {artist.bio && <span>{artist.bio}</span>}
              </button>
            ))
          ) : (
            <p>No artists found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const CreatePage = () => {
  const [artistName, setArtistName] = useState('');
  const [artistBio, setArtistBio] = useState('');
  const [artistProfilePicture, setArtistProfilePicture] = useState('');
  const [artistFeedback, setArtistFeedback] = useState<FormFeedback>(idleFeedback);

  const [genreName, setGenreName] = useState('');
  const [genreFeedback, setGenreFeedback] = useState<FormFeedback>(idleFeedback);

  const [albumTitle, setAlbumTitle] = useState('');
  const [albumReleaseDate, setAlbumReleaseDate] = useState('');
  const [albumCoverImage, setAlbumCoverImage] = useState('');
  const [albumArtist, setAlbumArtist] = useState<IArtist | null>(null);
  const [albumFeedback, setAlbumFeedback] = useState<FormFeedback>(idleFeedback);

  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState<IArtist | null>(null);
  const [songAlbumId, setSongAlbumId] = useState('');
  const [songGenreIds, setSongGenreIds] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [songFeedback, setSongFeedback] = useState<FormFeedback>(idleFeedback);

  const [createArtist, createArtistState] = useCreateArtistMutation();
  const [createGenre, createGenreState] = useCreateGenreMutation();
  const [createAlbum, createAlbumState] = useCreateAlbumMutation();
  const [createSong, createSongState] = useCreateSongMutation();
  const { data: genres } = useGetAllGenresQuery();
  const { data: albums } = useGetAllAlbumsQuery();

  const filteredAlbums = useMemo(() => {
    if (!albums) {
      return [];
    }

    if (!songArtist) {
      return albums;
    }

    return albums.filter((album) => album.artist?.id === songArtist.id);
  }, [albums, songArtist]);

  const handleArtistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setArtistFeedback(idleFeedback);

    try {
      const createdArtist = await createArtist({
        name: artistName,
        bio: artistBio || undefined,
        profilePicture: artistProfilePicture || undefined,
      }).unwrap();

      setArtistName('');
      setArtistBio('');
      setArtistProfilePicture('');
      toast.success(`Artist “${createdArtist.name}” created`);
      setArtistFeedback({
        kind: 'success',
        message: `Artist "${createdArtist.name}" created successfully.`,
        linkPath: `/artists/${createdArtist.id}`,
        linkLabel: 'Open artist',
      });
    } catch (error) {
      setArtistFeedback({
        kind: 'error',
        message: getErrorMessage(error),
      });
    }
  };

  const handleGenreSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGenreFeedback(idleFeedback);

    try {
      const createdGenre = await createGenre({ name: genreName }).unwrap();
      setGenreName('');
      toast.success(`Genre “${createdGenre.name}” created`);
      setGenreFeedback({
        kind: 'success',
        message: `Genre "${createdGenre.name}" created successfully.`,
        linkPath: `/genres/${createdGenre.id}`,
        linkLabel: 'Open genre',
      });
    } catch (error) {
      setGenreFeedback({
        kind: 'error',
        message: getErrorMessage(error),
      });
    }
  };

  const handleAlbumSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAlbumFeedback(idleFeedback);

    if (!albumArtist) {
      setAlbumFeedback({
        kind: 'error',
        message: 'Select an artist before creating an album.',
      });
      return;
    }

    try {
      const createdAlbum = await createAlbum({
        title: albumTitle,
        artistId: albumArtist.id,
        releaseDate: albumReleaseDate || undefined,
        coverImage: albumCoverImage || undefined,
      }).unwrap();

      setAlbumTitle('');
      setAlbumReleaseDate('');
      setAlbumCoverImage('');
      setAlbumArtist(null);
      toast.success(`Album “${createdAlbum.title}” created`);
      setAlbumFeedback({
        kind: 'success',
        message: `Album "${createdAlbum.title}" created successfully.`,
        linkPath: `/albums/${createdAlbum.id}`,
        linkLabel: 'Open album',
      });
    } catch (error) {
      setAlbumFeedback({
        kind: 'error',
        message: getErrorMessage(error),
      });
    }
  };

  const handleSongSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSongFeedback(idleFeedback);

    if (!songArtist) {
      setSongFeedback({
        kind: 'error',
        message: 'Select an artist before creating a song.',
      });
      return;
    }

    if (!audioFile) {
      setSongFeedback({
        kind: 'error',
        message: 'Choose an audio file before submitting.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', songTitle);
    formData.append('artistId', songArtist.id);

    if (songAlbumId) {
      formData.append('albumId', songAlbumId);
    }

    songGenreIds.forEach((genreId) => {
      formData.append('genreIds', genreId);
    });

    formData.append('audioFile', audioFile);

    try {
      const createdSong = await createSong(formData).unwrap();
      setSongTitle('');
      setSongArtist(null);
      setSongAlbumId('');
      setSongGenreIds([]);
      setAudioFile(null);
      toast.success(`Song “${createdSong.title}” created`);
      setSongFeedback({
        kind: 'success',
        message: `Song "${createdSong.title}" created successfully.`,
        linkPath: `/songs/${createdSong.id}`,
        linkLabel: 'Open song',
      });
    } catch (error) {
      setSongFeedback({
        kind: 'error',
        message: getErrorMessage(error),
      });
    }
  };

  const toggleGenre = (genreId: string) => {
    setSongGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((id) => id !== genreId)
        : [...current, genreId]
    );
  };

  const handleSongArtistSelect = (artist: IArtist | null) => {
    setSongArtist(artist);
    setSongAlbumId('');
  };

  return (
    <div className="create-page">
      <header className="page-header">
        <p className="eyebrow">POST requests</p>
        <h1>Create content</h1>
        <p className="page-copy">
          This is the screen for create actions. Start with artists and genres, then add albums,
          then upload songs.
        </p>
      </header>

      <div className="form-grid">
        <section className="form-card">
          <div className="card-header">
            <h2>Create artist</h2>
            <p>Required: name</p>
          </div>
          <form onSubmit={handleArtistSubmit}>
            <label>
              <span>Name</span>
              <input value={artistName} onChange={(event) => setArtistName(event.target.value)} required />
            </label>
            <label>
              <span>Bio</span>
              <textarea value={artistBio} onChange={(event) => setArtistBio(event.target.value)} rows={4} />
            </label>
            <label>
              <span>Profile picture</span>
              <input
                value={artistProfilePicture}
                onChange={(event) => setArtistProfilePicture(event.target.value)}
                placeholder="Image URL or file name"
              />
            </label>
            <button type="submit" disabled={createArtistState.isLoading}>
              {createArtistState.isLoading ? 'Creating...' : 'Create artist'}
            </button>
          </form>
          {artistFeedback.kind !== 'idle' && (
            <div className={`feedback ${artistFeedback.kind}`}>
              <span>{artistFeedback.message}</span>
              {artistFeedback.linkPath && artistFeedback.linkLabel && (
                <Link to={artistFeedback.linkPath}>{artistFeedback.linkLabel}</Link>
              )}
            </div>
          )}
        </section>

        <section className="form-card">
          <div className="card-header">
            <h2>Create genre</h2>
            <p>Required: name</p>
          </div>
          <form onSubmit={handleGenreSubmit}>
            <label>
              <span>Name</span>
              <input value={genreName} onChange={(event) => setGenreName(event.target.value)} required />
            </label>
            <button type="submit" disabled={createGenreState.isLoading}>
              {createGenreState.isLoading ? 'Creating...' : 'Create genre'}
            </button>
          </form>
          {genreFeedback.kind !== 'idle' && (
            <div className={`feedback ${genreFeedback.kind}`}>
              <span>{genreFeedback.message}</span>
              {genreFeedback.linkPath && genreFeedback.linkLabel && (
                <Link to={genreFeedback.linkPath}>{genreFeedback.linkLabel}</Link>
              )}
            </div>
          )}
        </section>

        <section className="form-card">
          <div className="card-header">
            <h2>Create album</h2>
            <p>Required: title, artistId</p>
          </div>
          <form onSubmit={handleAlbumSubmit}>
            <label>
              <span>Title</span>
              <input value={albumTitle} onChange={(event) => setAlbumTitle(event.target.value)} required />
            </label>
            <ArtistPicker
              label="Artist"
              selectedArtist={albumArtist}
              onSelect={setAlbumArtist}
              required
              hint="Search by artist name, then select one result."
            />
            <label>
              <span>Release date</span>
              <input
                type="date"
                value={albumReleaseDate}
                onChange={(event) => setAlbumReleaseDate(event.target.value)}
              />
            </label>
            <label>
              <span>Cover image</span>
              <input
                value={albumCoverImage}
                onChange={(event) => setAlbumCoverImage(event.target.value)}
                placeholder="Image URL or file name"
              />
            </label>
            <button type="submit" disabled={createAlbumState.isLoading}>
              {createAlbumState.isLoading ? 'Creating...' : 'Create album'}
            </button>
          </form>
          {albumFeedback.kind !== 'idle' && (
            <div className={`feedback ${albumFeedback.kind}`}>
              <span>{albumFeedback.message}</span>
              {albumFeedback.linkPath && albumFeedback.linkLabel && (
                <Link to={albumFeedback.linkPath}>{albumFeedback.linkLabel}</Link>
              )}
            </div>
          )}
        </section>

        <section className="form-card song-card">
          <div className="card-header">
            <h2>Create song</h2>
            <p>Required: title, artistId, audioFile</p>
          </div>
          <form onSubmit={handleSongSubmit}>
            <label>
              <span>Title</span>
              <input value={songTitle} onChange={(event) => setSongTitle(event.target.value)} required />
            </label>
            <ArtistPicker
              label="Artist"
              selectedArtist={songArtist}
              onSelect={handleSongArtistSelect}
              required
              hint="Pick an artist first. Album options update after selection."
            />
            <label>
              <span>Album (optional)</span>
              <select value={songAlbumId} onChange={(event) => setSongAlbumId(event.target.value)}>
                <option value="">No album</option>
                {filteredAlbums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                    {album.artist?.name ? ` - ${album.artist.name}` : ''}
                  </option>
                ))}
              </select>
            </label>
            <div className="genre-selector">
              <span>Genres (optional)</span>
              <div className="checkbox-grid">
                {(genres ?? []).map((genre) => (
                  <label key={genre.id} className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={songGenreIds.includes(genre.id)}
                      onChange={() => toggleGenre(genre.id)}
                    />
                    <span>{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <label>
              <span>Audio file</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
                required
              />
            </label>
            <button type="submit" disabled={createSongState.isLoading}>
              {createSongState.isLoading ? 'Uploading...' : 'Create song'}
            </button>
          </form>
          {songFeedback.kind !== 'idle' && (
            <div className={`feedback ${songFeedback.kind}`}>
              <span>{songFeedback.message}</span>
              {songFeedback.linkPath && songFeedback.linkLabel && (
                <Link to={songFeedback.linkPath}>{songFeedback.linkLabel}</Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CreatePage;
