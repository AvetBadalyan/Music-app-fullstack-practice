import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateArtistMutation } from '../../services/artistsApi';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import type { IArtist } from '../../types/artist';
import {
  idleFeedback,
  getErrorMessage,
  type FormFeedback,
} from './formHelpers';
import './forms.scss';

interface CreateArtistFormProps {
  /** Called with the new artist after a successful create. Used by callers
   * that embed this form inline (e.g. ArtistPicker's "create new" modal) and
   * need to react immediately, instead of the visitor following the success
   * link to the artist's page. */
  onCreated?: (artist: IArtist) => void;
}

const CreateArtistForm = ({ onCreated }: CreateArtistFormProps) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<FormFeedback>(idleFeedback);
  const [createArtist, { isLoading }] = useCreateArtistMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(idleFeedback);

    try {
      const created = await createArtist({
        name: name.trim(),
        bio: bio.trim() || undefined,
        profilePicture: profilePicture ?? undefined,
      }).unwrap();

      setName('');
      setBio('');
      setProfilePicture(null);
      setFeedback({
        kind: 'success',
        message: `Artist "${created.name}" created successfully.`,
        linkPath: `/artists/${created.id}`,
        linkLabel: 'Open artist',
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
            Name <span className="required-mark">*</span>
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={FIELD_LIMITS.artistName}
          />
        </label>
        <label>
          <span>Bio</span>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            maxLength={FIELD_LIMITS.artistBio}
          />
        </label>
        <label>
          <span>Profile picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setProfilePicture(event.target.files?.[0] ?? null)
            }
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Create artist'}
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

export default CreateArtistForm;
