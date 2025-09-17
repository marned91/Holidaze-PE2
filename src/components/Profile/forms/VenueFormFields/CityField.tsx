import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';

export function CityField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();
  return (
    <div className="pb-4">
      <label className="mb-1 block text-sm font-medium font-text">
        City (Norway)
      </label>
      <input
        type="text"
        placeholder="Oslo"
        {...register('city')}
        className={`w-full rounded-lg border px-3 py-2 outline-none font-text ${
          errors.city
            ? 'border-red-400 focus:ring-2 focus:ring-red-300'
            : 'border-gray-300 focus:ring-2 focus:ring-highlight'
        }`}
        aria-invalid={!!errors.city}
      />
      {errors.city && (
        <p className="mt-1 text-sm text-red-600 font-text">
          {errors.city.message}
        </p>
      )}
      <p className="mt-1 text-xs text-gray-500 font-text">
        Country is set to Norway.
      </p>
    </div>
  );
}
