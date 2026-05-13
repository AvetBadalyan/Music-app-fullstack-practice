import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateArtistMutation } from '../../services/artistsApi';
import { FIELD_LIMITS, IMAGE_URL_WARN_AT } from '../../constants/fieldLimits';
import {
  idleFeedback,
  getErrorMessage,
  type FormFeedback,
} from './formHelpers';
import './forms.scss';

const CreateArtistForm = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [feedback, setFeedback] = useState<FormFeedback>(idleFeedback);
  const [createArtist, { isLoading }] = useCreateArtistMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(idleFeedback);

    try {
      const created = await createArtist({
        name: name.trim(),
        bio: bio.trim() || undefined,
        profilePicture: profilePicture.trim() || undefined,
      }).unwrap();

      setName('');
      setBio('');
      setProfilePicture('');
      setFeedback({
        kind: 'success',
        message: `Artist "${created.name}" created successfully.`,
        linkPath: `/artists/${created.id}`,
        linkLabel: 'Open artist',
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
            value={profilePicture}
            onChange={(event) => setProfilePicture(event.target.value)}
            placeholder="Image URL or file name"
            maxLength={FIELD_LIMITS.imageUrl}
          />
        </label>
        {profilePicture.length >= IMAGE_URL_WARN_AT && (
          <p className="field-warning">
            This URL is very long ({profilePicture.length}/
            {FIELD_LIMITS.imageUrl}). Please shorten the source filename before
            uploading.
          </p>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create artist'}
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
