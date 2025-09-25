import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';

/**
 * City input field for the venue form (Norway only).
 *
 * @remarks
 * - Associates label and input via `htmlFor`/`id`.
 * - Announces validation errors with `aria-invalid` and `role="alert"`.
 * - Uses `aria-describedby` to link either help or error text.
 */
export function CityField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();

  const inputId = useId();
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const hasError = !!errors.city;

  return (
    <div className="pb-4">
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium font-text">
        City (Norway)
      </label>
      <input
        id={inputId}
        type="text"
        placeholder="Oslo"
        {...register('city')}
        className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
          hasError
            ? 'border-red-400 focus:ring-2 focus:ring-red-300'
            : 'border-gray-300 focus:ring-2 focus:ring-highlight'
        }`}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helpId}
      />
      {hasError && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600 font-text">
          {errors.city?.message}
        </p>
      )}
      <p id={helpId} className="mt-1 text-xs text-gray-500 font-text">
        Country is set to Norway.
      </p>
    </div>
  );
}
