import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.scss';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Content rendered above the title, e.g. ConfirmDialog's warning icon.
   * Fully self-styled by the caller - Modal only places it. */
  icon?: ReactNode;
  /** 'alertdialog' for interruption-style dialogs (confirmations) that
   * demand a response, vs the default 'dialog' for ordinary forms. */
  role?: 'dialog' | 'alertdialog';
  /** Id of an element (usually a message paragraph) that describes the
   * dialog, wired to aria-describedby on the panel. */
  descriptionId?: string;
  /** Element to focus on open instead of the panel itself - e.g.
   * ConfirmDialog focuses its confirm button so Enter confirms. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** While true, Escape / overlay click / the (X) button do nothing - e.g.
   * ConfirmDialog disables closing while its destructive action is in flight. */
  disableClose?: boolean;
}

const Modal = ({
  open,
  title,
  onClose,
  children,
  icon,
  role = 'dialog',
  descriptionId,
  initialFocusRef,
  disableClose = false,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Focus the panel on open - or initialFocusRef's element, e.g. ConfirmDialog
  // autofocusing its confirm button - so Escape/Enter reach it before
  // anything is clicked, and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    (initialFocusRef?.current ?? panelRef.current)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, initialFocusRef]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={disableClose ? undefined : onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="modal-panel"
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        // React bubbles portaled events through the React tree, not the DOM
        // tree, so both handlers below stop at this panel: without them a
        // modal opened from inside another modal would close its parent too
        // (Escape) and submit the form it is nested under (submit).
        onKeyDown={(e) => {
          if (e.key !== 'Escape') return;
          e.stopPropagation();
          if (!disableClose) onClose();
        }}
        onSubmit={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-panel__close"
          onClick={onClose}
          disabled={disableClose}
          aria-label="Close"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        {icon}
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
