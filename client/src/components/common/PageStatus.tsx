import './PageStatus.scss';

interface PageStatusProps {
  children: string;
  /** Shows the spinner. Off for terminal messages such as "not found". */
  isLoading?: boolean;
}

/**
 * The full-height message a page shows instead of its content while loading,
 * or when there is nothing to show.
 */
const PageStatus = ({ children, isLoading = false }: PageStatusProps) => (
  <p
    className={`page-status${isLoading ? ' page-status--loading' : ''}`}
    role="status"
    aria-live="polite"
  >
    {children}
  </p>
);

export default PageStatus;
