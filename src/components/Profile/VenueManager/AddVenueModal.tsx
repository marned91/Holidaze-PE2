import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from '../../Common/Modal';
import { createVenue } from '../../../api/venuesApi';
import type { TCreateVenueInput, TVenue } from '../../../types/venueTypes';
import type { TVenueFormValues } from '../../../types/formTypes';
import { venueSchema } from '../forms/validateCreateAndEditVenueSchema';
import { TitleField } from '../forms/VenueFormFields/TitleField';
import { ImagesField } from '../forms/VenueFormFields/ImageField';
import { DescriptionField } from '../forms/VenueFormFields/DescriptionField';
import { PriceGuestsRow } from '../forms/VenueFormFields/PriceGuestsRow';
import { CityField } from '../forms/VenueFormFields/CityField';
import { FacilitiesField } from '../forms/VenueFormFields/FacilitiesField';
import { FormActions } from '../forms/VenueFormFields/FormActions';

type AddVenueModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (venue: TVenue) => void;
};

export function AddVenueModal({
  open,
  onClose,
  onCreated,
}: AddVenueModalProps) {
  const methods = useForm<TVenueFormValues>({
    resolver: yupResolver(venueSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: '',
      description: '',
      images: [{ url: '' }, { url: '' }],
      maxGuests: 0,
      price: 0,
      city: '',
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        description: '',
        images: [{ url: '' }, { url: '' }],
        maxGuests: 0,
        price: 0,
        city: '',
        meta: { wifi: false, parking: false, breakfast: false, pets: false },
      });
    }
  }, [open, reset]);

  async function onSubmit(values: TVenueFormValues) {
    const media = values.images
      .map((item, index) => ({
        url: item.url.trim(),
        alt: `${values.name} photo ${index + 1}`,
      }))
      .filter((m) => m.url.length > 0);

    const payload: TCreateVenueInput = {
      name: values.name.trim(),
      description: values.description.trim(),
      media,
      maxGuests: values.maxGuests,
      price: values.price,
      location: { country: 'Norway', city: values.city.trim() },
      meta: {
        wifi: !!values.meta.wifi,
        parking: !!values.meta.parking,
        breakfast: !!values.meta.breakfast,
        pets: !!values.meta.pets,
      },
    };

    try {
      const created = await createVenue(payload);
      onCreated(created);
      alert('Venue created!');
      onClose();
    } catch (error) {
      alert((error as Error)?.message || 'Could not create venue');
    }
  }

  return (
    <Modal
      open={open}
      title="Add venue"
      ariaLabel="Add venue"
      onClose={onClose}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <p className="text-sm text-gray-600 font-text">
            Fill in the details to publish your venue.
          </p>

          <TitleField max={40} />
          <DescriptionField max={600} />
          <ImagesField />
          <PriceGuestsRow showGuestsPlaceholder />
          <CityField />
          <FacilitiesField />

          <FormActions
            onCancel={onClose}
            submitting={isSubmitting}
            idleLabel="Add venue"
            busyLabel="Adding…"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
