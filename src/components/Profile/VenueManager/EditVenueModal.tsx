import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../Common/Modal';
import { updateVenue } from '../../../api/venuesApi';
import type { TVenue } from '../../../types/venueTypes';
import type { TVenueFormValues } from '../../../types/formTypes';
import { venueSchema } from '../forms/validateCreateAndEditVenueSchema';
import { venueToFormValues, formValuesToCreatePayload } from '../../../utils/venueFormMapping';
import { TitleField } from '../forms/VenueFormFields/TitleField';
import { DescriptionField } from '../forms/VenueFormFields/DescriptionField';
import { ImagesField } from '../forms/VenueFormFields/ImagesField';
import { PriceGuestsRow } from '../forms/VenueFormFields/PriceGuestsRow';
import { CityField } from '../forms/VenueFormFields/CityField';
import { FacilitiesField } from '../forms/VenueFormFields/FacilitiesField';
import { FormActions } from '../forms/VenueFormFields/FormActions';
import { useAlerts } from '../../../hooks/useAlerts';

type EditVenueModalProps = {
  open: boolean;
  onClose: () => void;
  venue: TVenue;
  profileName: string;
  onUpdated?: (venue: TVenue) => void;
};

/**
 * Edit venue modal with a validated form for updating core venue fields.
 *
 * Behavior:
 * - Initializes form defaults from the provided `venue`.
 * - Resets form when the modal opens or the `venue` prop changes.
 * - Submits to the API; on success, shows a success alert, closes the modal,
 *   navigates to the owner's profile, and invokes `onUpdated`.
 * - On failure, shows an error alert with a friendly message.
 *
 * @param open - Whether the modal is visible.
 * @param onClose - Callback to close the modal without saving.
 * @param venue - Current venue data used as form defaults.
 * @param profileName - Owner profile name for post-save navigation.
 * @param onUpdated - Optional callback receiving the updated venue.
 * @returns Modal containing the edit form.
 */
export function EditVenueModal({
  open,
  onClose,
  venue,
  profileName,
  onUpdated,
}: EditVenueModalProps) {
  const navigate = useNavigate();
  const { showSuccessAlert, showErrorAlert } = useAlerts();

  const methods = useForm<TVenueFormValues>({
    resolver: yupResolver(venueSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: venueToFormValues(venue),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) reset(venueToFormValues(venue));
  }, [open, venue, reset]);

  /**
   * Handles form submission by mapping form values to the API payload and
   * calling `updateVenue`.
   *
   * Behavior:
   * - Maps UI values via `formValuesToCreatePayload`.
   * - Shows success/error alerts based on outcome.
   * - On success: triggers `onUpdated`, closes the modal, and navigates to profile.
   *
   * @param values - Current form values validated by `venueSchema`.
   * @throws Displays an error alert; exceptions are caught and not rethrown.
   */
  async function onSubmit(values: TVenueFormValues) {
    const payload = formValuesToCreatePayload(values);
    try {
      const updated = await updateVenue(venue.id, payload);
      onUpdated?.(updated);
      showSuccessAlert('Venue updated!');
      onClose();
      navigate(`/profile/${encodeURIComponent(profileName)}`);
    } catch (unknownError) {
      const message = (unknownError as Error)?.message || 'Could not update venue';
      showErrorAlert(message);
    }
  }

  return (
    <Modal open={open} title="Edit venue" ariaLabel="Edit venue" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <p className="text-sm text-gray-600 font-text">Update the details for your venue.</p>
          <TitleField max={100} />
          <DescriptionField max={1000} />
          <ImagesField />
          <PriceGuestsRow />
          <CityField />
          <FacilitiesField />
          <FormActions
            onCancel={onClose}
            submitting={isSubmitting}
            idleLabel="Save changes"
            busyLabel="Saving…"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
