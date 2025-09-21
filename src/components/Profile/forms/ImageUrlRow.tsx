import type { UseFormRegisterReturn } from 'react-hook-form';

type ImageUrlRowProps = {
  inputProps: UseFormRegisterReturn;
  value?: string;
  errorMessage?: string;
  canRemove?: boolean;
  onRemove?: () => void;
};

/**
 * Renders a single “image URL” row with a live preview on the left
 * and a URL input (with optional “Remove” button) on the right.
 *
 * Accessibility:
 * - Sets `aria-invalid` when there’s an error message.
 * - Links the input to the error text via `aria-describedby`.
 */
export function ImageUrlRow({
  inputProps,
  value,
  errorMessage,
  canRemove,
  onRemove,
}: ImageUrlRowProps) {
  const url = (value || '').trim();
  const errorId = errorMessage ? `${inputProps.name}-error` : undefined;

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row">
      <div className="mt-0.5 h-40 w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-24 sm:w-32">
        {url ? (
          <img
            src={url}
            alt="Image preview"
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500 font-text">
            No preview
          </div>
        )}
      </div>
      <div className="w-full min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="https://…"
            inputMode="url"
            aria-invalid={!!errorMessage || undefined}
            aria-describedby={errorId}
            className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
              errorMessage
                ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                : 'border-gray-300 focus:ring-2 focus:ring-highlight'
            }`}
            {...inputProps}
          />
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 font-text font-medium-buttons"
            >
              Remove
            </button>
          )}
        </div>

        {errorMessage && (
          <p id={errorId} className="mt-1 text-sm text-red-600 font-text">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
