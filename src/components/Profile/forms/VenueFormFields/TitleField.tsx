import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';

/**
 * Single-line venue title field with a live character counter.
 *
 * @param max - Soft limit used for the counter (UI only).
 * @remarks
 * - Associates label and input via `htmlFor`/`id`.
 * - Uses `aria-invalid` and `role="alert"` for error announcements.
 * - `aria-describedby` links either to the error text (if present) or to the counter.
 */
export function TitleField({ max = 100 }: { max?: number }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();

  const value = watch('name') || '';
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const counterId = `${inputId}-counter`;
  const hasError = !!errors.name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium font-text"
      >
        Venue name
      </label>
      <input
        id={inputId}
        type="text"
        {...register('name')}
        className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
          hasError
            ? 'border-red-400 focus:ring-2 focus:ring-red-300'
            : 'border-gray-300 focus:ring-2 focus:ring-highlight'
        }`}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : counterId}
      />
      <div className="mt-1 flex items-center justify-between text-xs font-text">
        <span id={errorId} role="alert" className="text-red-600">
          {errors.name?.message}
        </span>
        <span
          id={counterId}
          className={value.length > max ? 'text-red-600' : 'text-gray-500'}
        >
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}
