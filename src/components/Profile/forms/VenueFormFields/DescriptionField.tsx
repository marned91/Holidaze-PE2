import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';

export function DescriptionField({ max = 1000 }: { max?: number }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();
  const value = watch('description') || '';
  return (
    <div>
      <label className="mb-1 block text-sm font-medium font-text">
        Description
      </label>
      <textarea
        rows={4}
        {...register('description')}
        className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
          errors.description
            ? 'border-red-400 focus:ring-2 focus:ring-red-300'
            : 'border-gray-300 focus:ring-2 focus:ring-highlight'
        }`}
        aria-invalid={!!errors.description}
      />
      <div className="mt-1 flex items-center justify-between text-xs font-text">
        <span className="text-red-600">{errors.description?.message}</span>
        <span
          className={`${value.length > max ? 'text-red-600' : 'text-gray-500'}`}
        >
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}
