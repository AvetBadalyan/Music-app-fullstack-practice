import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateGenreMutation } from '../../services/genresApi';
import { idleFeedback, getErrorMessage, type FormFeedback } from './formHelpers';
import './forms.scss';

const CreateGenreForm = () => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<FormFeedback>(idleFeedback);
  const [createGenre, { isLoading }] = useCreateGenreMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(idleFeedback);

    try {
      const created = await createGenre({ name: name.trim() }).unwrap();
      setName('');
      setFeedback({
        kind: 'success',
        message: `Genre "${created.name}" created successfully.`,
        linkPath: `/genres/${created.id}`,
        linkLabel: 'Open genre',
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create genre'}
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

export default CreateGenreForm;
