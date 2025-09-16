import { useFormContext } from 'react-hook-form';
import type { VenueFormValues } from '../../../../types/formTypes';

export function TitleField({ max = 100 }: { max?: number }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<VenueFormValues>();
  const value = watch('name') || '';
  return (
    <div>
      <label className="mb-1 block text-sm font-medium font-text">
        Venue name
      </label>
      <input
        type="text"
        {...register('name')}
        className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
          errors.name
            ? 'border-red-400 focus:ring-2 focus:ring-red-300'
            : 'border-gray-300 focus:ring-2 focus:ring-highlight'
        }`}
        aria-invalid={!!errors.name}
      />
      <div className="mt-1 flex items-center justify-between text-xs font-text">
        <span className="text-red-600">{errors.name?.message}</span>
        <span
          className={`${value.length > max ? 'text-red-600' : 'text-gray-500'}`}
        >
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}
