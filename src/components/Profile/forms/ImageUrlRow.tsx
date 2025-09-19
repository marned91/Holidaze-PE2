import type { UseFormRegisterReturn } from 'react-hook-form';

type ImageUrlRowProps = {
  inputProps: UseFormRegisterReturn;
  value?: string;
  errorMessage?: string;
  canRemove?: boolean;
  onRemove?: () => void;
};

export function ImageUrlRow({
  inputProps,
  value,
  errorMessage,
  canRemove,
  onRemove,
}: ImageUrlRowProps) {
  const url = (value || '').trim();

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row">
      <div className="mt-0.5 h-40 w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-24 sm:w-32">
        {url ? (
          <img
            src={url}
            alt="Preview"
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center font-text justify-center text-xs text-gray-500">
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
            {...inputProps}
            className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
              errorMessage
                ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                : 'border-gray-300 focus:ring-2 focus:ring-highlight'
            }`}
            aria-invalid={!!errorMessage}
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
          <p className="mt-1 text-sm text-red-600 font-text">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
