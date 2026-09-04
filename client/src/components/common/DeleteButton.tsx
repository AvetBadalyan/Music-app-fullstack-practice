import { Trash2 } from 'lucide-react';
import './DeleteButton.scss';

interface DeleteButtonProps {
  /** Names what is being deleted, for the tooltip and screen readers. */
  label: string;
  isDeleting: boolean;
  onClick: () => void;
}

/** Admin-only button that opens a delete confirmation. */
const DeleteButton = ({ label, isDeleting, onClick }: DeleteButtonProps) => (
  <button
    type="button"
    className="delete-btn"
    onClick={onClick}
    disabled={isDeleting}
    title={label}
    aria-label={label}
  >
    <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
    <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
  </button>
);

export default DeleteButton;
