import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';

/**
 * Checkbox group for venue facilities (all optional).
 *
 * @remarks
 * - Adds `aria-describedby` to reference a help text for screen readers.
 * - Keeps label-wrapping pattern for implicit input–label association.
 */
export function FacilitiesField() {
  const { register } = useFormContext<TVenueFormValues>();
  const helpId = `${useId()}-help`;

  return (
    <fieldset className="mt-2 pb-4" aria-describedby={helpId}>
      <legend className="mb-2 text-sm font-medium font-text">
        Facilities (optional)
      </legend>

      <div id={helpId} className="sr-only">
        Select any facilities that apply. All options are optional.
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-text text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            {...register('meta.wifi')}
            className="h-4 w-4"
          />
          Wi-Fi
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            {...register('meta.parking')}
            className="h-4 w-4"
          />
          Parking
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            {...register('meta.breakfast')}
            className="h-4 w-4"
          />
          Breakfast
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            {...register('meta.pets')}
            className="h-4 w-4"
          />
          Pets
        </label>
      </div>
    </fieldset>
  );
}
