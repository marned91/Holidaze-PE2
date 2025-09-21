type FieldErrorProps = {
  message?: string;
  id?: string;
};

/**
 * Displays an accessible error message for form fields.
 *
 * Behavior:
 * - Renders `null` if no message is provided.
 * - Adds `role="alert"` for screen readers.
 *
 * @param message - Error text to display.
 * @param id - Optional id for aria-describedby linkage.
 * @returns A styled <p> element or null.
 */
export function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-sm text-red-600 font-text italic"
    >
      {message}
    </p>
  );
}
