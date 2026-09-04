import { Plus, X } from 'lucide-react';
import './PageToolbar.scss';

interface PageToolbarProps {
  title: string;
  /** Label for the create form the button reveals, e.g. "New song". */
  createLabel?: string;
  /** Whether that form is currently open. */
  isCreateOpen?: boolean;
  /** Omitted for visitors, which is what hides the button entirely. */
  onCreateToggle?: () => void;
}

/**
 * The heading row every list page opens with: the page title, plus the
 * admin-only toggle for its create form.
 */
const PageToolbar = ({
  title,
  createLabel,
  isCreateOpen = false,
  onCreateToggle,
}: PageToolbarProps) => (
  <div className="page-toolbar">
    <h1>{title}</h1>
    {onCreateToggle && createLabel && (
      <button
        type="button"
        className="toolbar-toggle"
        onClick={onCreateToggle}
        aria-expanded={isCreateOpen}
      >
        {isCreateOpen ? <X size={16} /> : <Plus size={16} />}
        <span>{isCreateOpen ? 'Close' : createLabel}</span>
      </button>
    )}
  </div>
);

export default PageToolbar;
