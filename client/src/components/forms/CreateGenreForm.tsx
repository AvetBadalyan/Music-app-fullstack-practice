import { useState, type FormEvent } from 'react';
import { useCreateGenreMutation } from '../../services/genresApi';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import type { IGenre } from '../../types/api';
import FormFeedbackMessage from './FormFeedbackMessage';
import {
  idleFeedback,
  getErrorMessage,
  type FormFeedback,
} from './formHelpers';
import './forms.scss';

interface CreateGenreFormProps {
  /** Called with the new genre after a successful create - used by callers
   * that embed this form inline (e.g. CreateSongForm's "create new genre"
   * modal) and need to react immediately. */
  onCreated?: (genre: IGenre) => void;
}

const CreateGenreForm = ({ onCreated }: CreateGenreFormProps) => {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState<FormFeedback>(idleFeedback);
  const [createGenre, { isLoading }] = useCreateGenreMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
            maxLength={FIELD_LIMITS.genreName}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create genre'}
        </button>
      </form>
      <FormFeedbackMessage feedback={feedback} />
    </section>
  );
};

export default CreateGenreForm;
