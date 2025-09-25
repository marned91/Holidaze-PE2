/**
 * Generic form action row with Cancel and Submit buttons.
 *
 * Behavior:
 * - Disables both buttons while `submitting` is true.
 * - Shows `busyLabel` while submitting, otherwise `idleLabel`.
 * - Invokes `onCancel` when the Cancel button is clicked.
 *
 * @param onCancel - Callback to run when the user cancels the form.
 * @param submitting - Whether the form is currently submitting (disables buttons).
 * @param idleLabel - Submit button label in idle state.
 * @param busyLabel - Submit button label while submitting.
 * @returns A right-aligned action bar with Cancel and Submit buttons.
 */
export function FormActions({
  onCancel,
  submitting,
  idleLabel,
  busyLabel,
}: {
  onCancel: () => void;
  submitting: boolean;
  idleLabel: string;
  busyLabel: string;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        aria-disabled={submitting}
        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 font-medium-buttons"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting}
        aria-busy={submitting}
        className="cursor-pointer rounded-lg bg-main-dark px-5 py-2 text-white hover:bg-dark-highlight font-medium-buttons"
      >
        {submitting ? busyLabel : idleLabel}
      </button>
    </div>
  );
}
