import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/** An RTK Query delete trigger: takes the id, and can be awaited. */
type DeleteTrigger = (id: string) => { unwrap: () => Promise<unknown> };

interface UseDeleteWithConfirmOptions {
  deleteEntity: DeleteTrigger;
  /** List page to return to once the record is gone. */
  redirectTo: string;
}

/**
 * Wires the delete confirmation the four detail pages share.
 *
 * The dialog stays open until the server answers, because the delete cannot be
 * undone: the confirm button holds its pending state while the request is in
 * flight, and a failure leaves the dialog up so it can be retried rather than
 * navigating away from a record that still exists.
 */
export const useDeleteWithConfirm = ({
  deleteEntity,
  redirectTo,
}: UseDeleteWithConfirmOptions) => {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openConfirm = useCallback(() => setIsConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setIsConfirmOpen(false), []);

  const confirmDelete = useCallback(
    async (id: string, name: string) => {
      try {
        await deleteEntity(id).unwrap();
        setIsConfirmOpen(false);
        navigate(redirectTo);
        toast.success(`Deleted "${name}"`);
      } catch {
        toast.error(`Failed to delete "${name}"`);
      }
    },
    [deleteEntity, navigate, redirectTo],
  );

  return { isConfirmOpen, openConfirm, closeConfirm, confirmDelete };
};
