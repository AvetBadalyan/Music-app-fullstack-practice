import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateAlbumMutation } from '../../services/albumsApi';
import type { IArtist } from '../../types/artist';
import type { IAlbum } from '../../types/album';
import ArtistPicker from './ArtistPicker';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import {
  idleFeedback,
  getErrorMessage,
  type FormFeedback,
} from './formHelpers';
import './forms.scss';

interface CreateAlbumFormProps {
  initialArtist?: IArtist | null;
  /** Called with the new album after a successful create - used by callers
   * that embed this form inline (e.g. CreateSongForm's "create new album"
   * modal) and need to react immediately. */
  onCreated?: (album: IAlbum) => void;
}

const CreateAlbumForm = ({
  initialArtist = null,
  onCreated,
}: CreateAlbumFormProps) => {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [artist, setArtist] = useState<IArtist | null>(initialArtist);
  const [feedback, setFeedback] = useState<FormFeedback>(idleFeedback);
  const [createAlbum, { isLoading }] = useCreateAlbumMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(idleFeedback);

    if (!artist) {
      setFeedback({
        kind: 'error',
        message: 'Select an artist before creating an album.',
      });
      return;
    }

    try {
      const created = await createAlbum({
        title: title.trim(),
        artistId: artist.id,
        releaseDate: releaseDate || undefined,
        coverImage: coverImage ?? undefined,
      }).unwrap();

      setTitle('');
      setReleaseDate('');
      setCoverImage(null);
      setArtist(null);
      setFeedback({
        kind: 'success',
        message: `Album "${created.title}" created successfully.`,
        linkPath: `/albums/${created.id}`,
        linkLabel: 'Open album',
      });
      onCreated?.(created);
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
            maxLength={FIELD_LIMITS.albumTitle}
          />
        </label>
        <ArtistPicker
          label="Artist"
          selectedArtist={artist}
          onSelect={setArtist}
          required
          hint="Search by artist name, then select one result."
        />
        <label>
          <span>Release date</span>
          <input
            type="date"
            value={releaseDate}
            onChange={(event) => setReleaseDate(event.target.value)}
          />
        </label>
        <label>
          <span>Cover image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Create album'}
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
    </section>
  );
};

export default CreateAlbumForm;
