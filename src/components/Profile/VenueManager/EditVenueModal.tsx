import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../../Common/Modal';
import { updateVenue } from '../../../api/venuesApi';
import type { TVenue } from '../../../types/venues';
import type { VenueFormValues } from '../../../types/formTypes';
import {
  venueSchema,
  MAX_GUESTS,
} from '../forms/validateCreateAndEditVenueSchema';
import {
  venueToFormValues,
  formValuesToCreatePayload,
} from '../../../utils/venueFormMapping';

type EditVenueModalProps = {
  open: boolean;
  onClose: () => void;
  venue: TVenue;
  profileName: string;
  onUpdated?: (venue: TVenue) => void; // hvis du vil oppdatere liste lokalt
};

export function EditVenueModal({
  open,
  onClose,
  venue,
  profileName,
  onUpdated,
}: EditVenueModalProps) {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VenueFormValues>({
    resolver: yupResolver(venueSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: venueToFormValues(venue),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'images' });
  const nameValue = watch('name') || '';
  const descValue = watch('description') || '';

  useEffect(() => {
    if (open) {
      reset(venueToFormValues(venue));
    }
  }, [open, venue, reset]);

  async function onSubmit(values: VenueFormValues) {
    const payload = formValuesToCreatePayload(values);
    try {
      const updated = await updateVenue(venue.id, payload);
      onUpdated?.(updated);
      alert('Venue updated!');
      onClose();
      navigate(`/profile/${encodeURIComponent(profileName)}`);
    } catch (unknownError) {
      alert((unknownError as Error)?.message || 'Could not update venue');
    }
  }

  return (
    <Modal
      open={open}
      title="Edit venue"
      ariaLabel="Edit venue"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <p className="text-sm text-gray-600 font-text">
          Update the details for your venue.
        </p>
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
              className={`${
                nameValue.length > 100 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {nameValue.length}/100
            </span>
          </div>
        </div>
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
              className={`${
                descValue.length > 1000 ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {descValue.length}/1000
            </span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium font-text">
            Venue images <span className="text-gray-500">(min 2)</span>
          </label>
          <div className="space-y-2">
            {fields.map((field, index) => {
              const fieldError = (
                errors.images?.[index] as
                  | { url?: { message?: string } }
                  | undefined
              )?.url;
              return (
                <div key={field.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://…"
                      inputMode="url"
                      {...register(`images.${index}.url` as const)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight font-text"
                      aria-invalid={!!fieldError}
                    />
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 font-text"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {fieldError?.message && (
                    <p className="text-sm text-red-600 font-text">
                      {fieldError.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => append({ url: '' })}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 font-text"
            >
              + Add image
            </button>
          </div>
          {typeof (errors.images as any)?.message === 'string' && (
            <p className="mt-1 text-sm text-red-600 font-text">
              {(errors.images as any).message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
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
              {...register('maxGuests', {
                setValueAs: (value) => Number(value),
              })}
              className={`w-full rounded-lg border px-3 py-2 outline-none font-text text-xs bg-white ${
                errors.maxGuests
                  ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-highlight'
              }`}
              aria-invalid={!!errors.maxGuests}
            >
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
        <fieldset className="mt-2 pb-4">
          <legend className="mb-2 text-sm font-medium font-text">
            Facilities (optional)
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label className="inline-flex items-center gap-2 text-sm font-text">
              <input
                type="checkbox"
                {...register('meta.wifi')}
                className="h-4 w-4"
              />
              Wi-Fi
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-text">
              <input
                type="checkbox"
                {...register('meta.parking')}
                className="h-4 w-4"
              />
              Parking
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-text">
              <input
                type="checkbox"
                {...register('meta.breakfast')}
                className="h-4 w-4"
              />
              Breakfast
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-text">
              <input
                type="checkbox"
                {...register('meta.pets')}
                className="h-4 w-4"
              />
              Pets
            </label>
          </div>
        </fieldset>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium-buttons font-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-main-dark px-5 py-2 text-white disabled:opacity-80 hover:bg-dark-highlight cursor-pointer font-medium-buttons font-text"
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
