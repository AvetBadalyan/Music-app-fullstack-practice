import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateArtistMutation } from '../../services/artistsApi';
import { idleFeedback, getErrorMessage, type FormFeedback } from './formHelpers';
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
        name,
        bio: bio || undefined,
        profilePicture: profilePicture || undefined,
      }).unwrap();

      setName('');
      setBio('');
      setProfilePicture('');
      toast.success(`Artist “${created.name}” created`);
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
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <span>Bio</span>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </label>
        <label>
          <span>Profile picture</span>
          <input
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="Image URL or file name"
          />
        </label>
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
