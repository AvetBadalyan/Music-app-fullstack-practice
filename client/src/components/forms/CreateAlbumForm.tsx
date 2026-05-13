import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateAlbumMutation } from '../../services/albumsApi';
import type { IArtist } from '../../types/artist';
import ArtistPicker from './ArtistPicker';
import { FIELD_LIMITS, IMAGE_URL_WARN_AT } from '../../constants/fieldLimits';
import {
  idleFeedback,
  getErrorMessage,
  type FormFeedback,
} from './formHelpers';
import './forms.scss';

const CreateAlbumForm = () => {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [artist, setArtist] = useState<IArtist | null>(null);
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
        coverImage: coverImage.trim() || undefined,
      }).unwrap();

      setTitle('');
      setReleaseDate('');
      setCoverImage('');
      setArtist(null);
      setFeedback({
        kind: 'success',
        message: `Album "${created.title}" created successfully.`,
        linkPath: `/albums/${created.id}`,
        linkLabel: 'Open album',
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
            value={coverImage}
            onChange={(event) => setCoverImage(event.target.value)}
            placeholder="Image URL or file name"
            maxLength={FIELD_LIMITS.imageUrl}
          />
        </label>
        {coverImage.length >= IMAGE_URL_WARN_AT && (
          <p className="field-warning">
            This URL is very long ({coverImage.length}/{FIELD_LIMITS.imageUrl}).
            Please shorten the source filename before uploading.
          </p>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create album'}
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
