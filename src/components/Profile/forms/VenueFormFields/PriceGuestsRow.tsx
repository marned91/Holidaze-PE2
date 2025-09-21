import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';
import { MAX_GUESTS } from '../validateCreateAndEditVenueSchema';

/**
 * Row with price (number) and guests (select) fields for the venue form.
 *
 * @param showGuestsPlaceholder - Whether to render a placeholder option in the guests select.
 * @remarks
 * - Associates labels and controls via `htmlFor`/`id`.
 * - Uses `aria-invalid` and `role="alert"` for error announcements.
 * - `aria-describedby` links either to the error text (if present) or to the help text.
 */
export function PriceGuestsRow({
  showGuestsPlaceholder = false,
}: {
  showGuestsPlaceholder?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();

  const priceId = useId();
  const priceErrorId = `${priceId}-error`;

  const guestsId = useId();
  const guestsErrorId = `${guestsId}-error`;
  const guestsHelpId = `${guestsId}-help`;

  const hasPriceError = !!errors.price;
  const hasGuestsError = !!errors.maxGuests;

  return (
    <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor={priceId}
          className="mb-1 block text-sm font-medium font-text"
        >
          Price per night (NOK)
        </label>
        <input
          id={priceId}
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          {...register('price', { valueAsNumber: true })}
          className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
            hasPriceError
              ? 'border-red-400 focus:ring-2 focus:ring-red-300'
              : 'border-gray-300 focus:ring-2 focus:ring-highlight'
          }`}
          aria-invalid={hasPriceError}
          aria-describedby={hasPriceError ? priceErrorId : undefined}
        />
        {hasPriceError && (
          <p
            id={priceErrorId}
            role="alert"
            className="mt-1 text-sm text-red-600 font-text"
          >
            {errors.price?.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={guestsId}
          className="mb-1 block text-sm font-medium font-text"
        >
          How many people?
        </label>
        <select
          id={guestsId}
          {...register('maxGuests', { setValueAs: (v) => Number(v) })}
          className={`w-full rounded-lg border px-3 py-2 bg-white text-xs outline-none font-text ${
            hasGuestsError
              ? 'border-red-400 focus:ring-2 focus:ring-red-300'
              : 'border-gray-300 focus:ring-2 focus:ring-highlight'
          }`}
          aria-invalid={hasGuestsError}
          aria-describedby={hasGuestsError ? guestsErrorId : guestsHelpId}
        >
          {showGuestsPlaceholder && <option value={0}>Select…</option>}
          {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {hasGuestsError && (
          <p
            id={guestsErrorId}
            role="alert"
            className="mt-1 text-sm text-red-600 font-text"
          >
            {errors.maxGuests?.message}
          </p>
        )}
        <p id={guestsHelpId} className="mt-1 text-xs text-gray-500 font-text">
          Max {MAX_GUESTS} guests
        </p>
      </div>
    </div>
  );
}
