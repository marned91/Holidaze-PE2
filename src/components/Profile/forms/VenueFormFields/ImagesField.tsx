import { useFieldArray, useFormContext } from 'react-hook-form';
import type { TVenueFormValues } from '../../../../types/formTypes';
import { ImageUrlRow } from '../ImageUrlRow';

/**
 * Dynamic list of image URL fields for a venue.
 *
 * @remarks
 * - Renders one `ImageUrlRow` per item in `images`.
 * - Allows appending/removing rows (min 2 kept visually via `canRemove`).
 * - Displays an array-level error message when present.
 */
export function ImagesField() {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<TVenueFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const imagesWatch = watch('images') || [];

  type ImagesArrayError = { message?: string } | undefined;
  const imagesArrayError = (errors.images as ImagesArrayError)?.message;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium font-text">
        Venue images <span className="text-gray-500">(min 2)</span>
      </label>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <ImageUrlRow
            key={field.id}
            inputProps={register(`images.${index}.url` as const)}
            value={imagesWatch?.[index]?.url || ''}
            errorMessage={
              (
                errors.images?.[index] as
                  | { url?: { message?: string } }
                  | undefined
              )?.url?.message
            }
            canRemove={fields.length > 2}
            onRemove={() => remove(index)}
          />
        ))}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => append({ url: '' })}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 font-medium-buttons"
        >
          + Add image
        </button>
      </div>

      {typeof imagesArrayError === 'string' && (
        <p role="alert" className="mt-1 text-sm text-red-600 font-text">
          {imagesArrayError}
        </p>
      )}
    </div>
  );
}
