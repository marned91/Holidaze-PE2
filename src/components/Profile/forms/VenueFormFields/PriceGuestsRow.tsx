import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';
import { MAX_GUESTS } from '../validateCreateAndEditVenueSchema';

export function PriceGuestsRow({
  showGuestsPlaceholder = false,
}: {
  showGuestsPlaceholder?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();

  return (
    <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium font-text">
          Price per night (NOK)
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          {...register('price', { valueAsNumber: true })}
          className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
            errors.price
              ? 'border-red-400 focus:ring-2 focus:ring-red-300'
              : 'border-gray-300 focus:ring-2 focus:ring-highlight'
          }`}
          aria-invalid={!!errors.price}
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600 font-text">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium font-text">
          How many people?
        </label>
        <select
          {...register('maxGuests', { setValueAs: (v) => Number(v) })}
          className={`w-full rounded-lg border px-3 py-2 bg-white text-xs outline-none font-text ${
            errors.maxGuests
              ? 'border-red-400 focus:ring-2 focus:ring-red-300'
              : 'border-gray-300 focus:ring-2 focus:ring-highlight'
          }`}
          aria-invalid={!!errors.maxGuests}
        >
          {showGuestsPlaceholder && <option value={0}>Select…</option>}
          {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {errors.maxGuests && (
          <p className="mt-1 text-sm text-red-600 font-text">
            {errors.maxGuests.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 font-text">
          Max {MAX_GUESTS} guests
        </p>
      </div>
    </div>
  );
}
