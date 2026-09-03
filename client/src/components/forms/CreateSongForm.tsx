import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllAlbumsQuery } from '../../services/albumsApi';
import { useGetAllGenresQuery } from '../../services/genresApi';
import { useCreateSongMutation } from '../../services/songsApi';
import type { IArtist } from '../../types/artist';
import type { IAlbum } from '../../types/album';
import type { IGenre } from '../../types/genre';
import ArtistPicker from './ArtistPicker';
import CreateAlbumForm from './CreateAlbumForm';
import CreateGenreForm from './CreateGenreForm';
import Modal from '../common/Modal';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import {
  idleFeedback,
  getErrorMessage,
  type FormFeedback,
} from './formHelpers';
import './forms.scss';

interface CreateSongFormProps {
  initialArtist?: IArtist | null;
}

const CreateSongForm = ({ initialArtist = null }: CreateSongFormProps) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState<IArtist | null>(initialArtist);
  const [albumId, setAlbumId] = useState('');
  const [genreIds, setGenreIds] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<FormFeedback>(idleFeedback);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isCreateGenreOpen, setIsCreateGenreOpen] = useState(false);

  const [createSong, { isLoading }] = useCreateSongMutation();
  const { data: genres } = useGetAllGenresQuery();
  const { data: albums } = useGetAllAlbumsQuery();

  const filteredAlbums = useMemo(() => {
    if (!albums) return [];
    if (!artist) return albums;
    return albums.filter((album) => album.artist?.id === artist.id);
  }, [albums, artist]);

  const handleArtistSelect = (next: IArtist | null) => {
    setArtist(next);
    setAlbumId('');
  };

  const toggleGenre = (genreId: string) => {
    setGenreIds((current) =>
      current.includes(genreId)
        ? current.filter((id) => id !== genreId)
        : [...current, genreId],
    );
  };

  const handleAlbumCreated = (album: IAlbum) => {
    setIsCreateAlbumOpen(false);
    // The visitor may have swapped the artist inside the modal - follow it, or
    // the new album falls outside filteredAlbums and the select goes blank.
    if (album.artist) setArtist(album.artist);
    setAlbumId(album.id);
  };

  const handleGenreCreated = (genre: IGenre) => {
    setIsCreateGenreOpen(false);
    setGenreIds((current) => [...current, genre.id]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(idleFeedback);

    if (!artist) {
      setFeedback({
        kind: 'error',
        message: 'Select an artist before creating a song.',
      });
      return;
    }

    if (!audioFile) {
      setFeedback({
        kind: 'error',
        message: 'Choose an audio file before submitting.',
      });
      return;
    }

    try {
      const created = await createSong({
        title: title.trim(),
        artistId: artist.id,
        audioFile,
        albumId: albumId || undefined,
        genreIds,
      }).unwrap();
      setTitle('');
      setArtist(null);
      setAlbumId('');
      setGenreIds([]);
      setAudioFile(null);
      setFeedback({
        kind: 'success',
        message: `Song "${created.title}" created successfully.`,
        linkPath: `/songs/${created.id}`,
        linkLabel: 'Open song',
      });
    } catch (error) {
      setFeedback({ kind: 'error', message: getErrorMessage(error) });
    }
  };

  return (
    <section className="entity-form">
      <form onSubmit={handleSubmit}>
        <label>
          <span>
            Title <span className="required-mark">*</span>
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={FIELD_LIMITS.songTitle}
          />
        </label>
        <ArtistPicker
          label="Artist"
          selectedArtist={artist}
          onSelect={handleArtistSelect}
          required
          hint="Pick an artist first. Album options update after selection."
        />
        <label>
          <span>Album (optional)</span>
          <div className="field-with-action">
            <select
              value={albumId}
              onChange={(event) => setAlbumId(event.target.value)}
            >
              <option value="">No album</option>
              {filteredAlbums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                  {album.artist?.name ? ` - ${album.artist.name}` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="field-action create-affordance"
              onClick={() => setIsCreateAlbumOpen(true)}
              disabled={!artist}
              title={artist ? undefined : 'Select an artist first'}
            >
              + New album
            </button>
          </div>
        </label>
        <div className="genre-selector">
          <span>Genres (optional)</span>
          <div className="checkbox-grid">
            {(genres ?? []).map((genre) => (
              <label key={genre.id} className="checkbox-pill">
                <input
                  type="checkbox"
                  checked={genreIds.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                />
                <span>{genre.name}</span>
              </label>
            ))}
            <button
              type="button"
              className="checkbox-pill checkbox-pill--create create-affordance"
              onClick={() => setIsCreateGenreOpen(true)}
            >
              + New genre
            </button>
          </div>
        </div>
        <label>
          <span>
            Audio file <span className="required-mark">*</span>
          </span>
          <input
            type="file"
            accept="audio/*"
            onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Create song'}
        </button>
      </form>
      {feedback.kind !== 'idle' && (
        <div className={`feedback ${feedback.kind}`}>
          <span>{feedback.message}</span>
          {feedback.linkPath && feedback.linkLabel && (
            <Link to={feedback.linkPath}>{feedback.linkLabel}</Link>
          )}
        </div>
      )}

      <Modal
        open={isCreateAlbumOpen}
        title="Create new album"
        onClose={() => setIsCreateAlbumOpen(false)}
      >
        <CreateAlbumForm initialArtist={artist} onCreated={handleAlbumCreated} />
      </Modal>

      <Modal
        open={isCreateGenreOpen}
        title="Create new genre"
        onClose={() => setIsCreateGenreOpen(false)}
      >
        <CreateGenreForm onCreated={handleGenreCreated} />
      </Modal>
    </section>
  );
};

export default CreateSongForm;
