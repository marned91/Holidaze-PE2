import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';

/**
 * Multiline description field with live character counter.
 *
 * @param max - Soft limit used for the counter (UI only).
 * @remarks
 * - Associates label and textarea via `htmlFor`/`id`.
 * - Announces validation errors with `aria-invalid` and `role="alert"`.
 * - Uses `aria-describedby` to link either error text or counter for screen readers.
 */
export function DescriptionField({ max = 1000 }: { max?: number }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();

  const value = watch('description') || '';
  const textareaId = useId();
  const errorId = `${textareaId}-error`;
  const counterId = `${textareaId}-counter`;
  const hasError = !!errors.description;

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="mb-1 block text-sm font-medium font-text"
      >
        Description
      </label>
      <textarea
        id={textareaId}
        rows={4}
        {...register('description')}
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
          {errors.description?.message}
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
