import { Link } from 'react-router-dom';
import type { FormFeedback } from './formHelpers';

interface FormFeedbackMessageProps {
  feedback: FormFeedback;
}

/**
 * The result banner under every create form: the API's error message, or a
 * confirmation with a link to the record that was just created.
 */
const FormFeedbackMessage = ({ feedback }: FormFeedbackMessageProps) => {
  if (feedback.kind === 'idle') return null;

  return (
    <div className={`feedback ${feedback.kind}`} role="status">
      <span>{feedback.message}</span>
      {feedback.kind === 'success' && (
        <Link to={feedback.linkPath}>{feedback.linkLabel}</Link>
      )}
    </div>
  );
};

export default FormFeedbackMessage;
