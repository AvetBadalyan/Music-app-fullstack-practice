import { useId, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import './ConfirmDialog.scss';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const messageId = useId();

  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      role="alertdialog"
      descriptionId={messageId}
      initialFocusRef={confirmRef}
      disableClose={isLoading}
      icon={
        <div className="confirm-dialog__icon" aria-hidden="true">
          <AlertTriangle size={24} strokeWidth={2} />
        </div>
      }
    >
      <p id={messageId} className="confirm-dialog__message">
        {message}
      </p>
      <div className="confirm-dialog__actions">
        <button
          type="button"
          className="confirm-dialog__cancel"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          ref={confirmRef}
          className="confirm-dialog__confirm"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
