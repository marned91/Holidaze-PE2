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
  /**
   * Action row for forms with Cancel and Submit buttons.
   *
   * @param onCancel   - Callback when the user clicks Cancel.
   * @param submitting - Whether the form is currently submitting.
   * @param idleLabel  - Label shown on the submit button when idle.
   * @param busyLabel  - Label shown on the submit button when submitting.
   */
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 font-medium-buttons"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting}
        aria-busy={submitting}
        className="cursor-pointer rounded-lg bg-main-dark px-5 py-2 text-white hover:bg-dark-highlight disabled:opacity-80 font-medium-buttons"
      >
        {submitting ? busyLabel : idleLabel}
      </button>
    </div>
  );
}
