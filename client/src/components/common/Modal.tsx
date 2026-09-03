import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.scss';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, title, onClose, children }: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Focus the panel on open - like ConfirmDialog autofocuses its confirm
  // button - so Escape reaches the panel before anything is clicked, and lock
  // body scroll while open.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        // React bubbles portaled events through the React tree, not the DOM
        // tree, so both handlers below stop at this panel: without them a
        // modal opened from inside another modal would close its parent too
        // (Escape) and submit the form it is nested under (submit).
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          e.stopPropagation();
          onClose();
        }}
        onSubmit={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-panel__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <h2 id={titleId} className="modal-panel__title">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
