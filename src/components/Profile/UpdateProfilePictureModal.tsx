import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from '../Common/Modal';
import { setProfilePicture } from '../../api/profilesApi';
import type { TUpdateProfilePictureFormValues } from '../../types/formTypes';
import { profilePictureSchema } from './forms/profilePictureSchema';
import { setValueAsTrim } from '../../utils/formValueTransforms';
import { useAlerts } from '../../hooks/useAlerts';

type UpdateProfilePictureProps = {
  username: string;
  open: boolean;
  onClose: () => void;
  onUpdated: (url: string, alt?: string) => void;
  initialUrl?: string;
  initialAlt?: string;
};

/**
 * Modal for updating a user's profile picture (image URL + optional alt text).
 *
 * Behavior:
 * - Initializes and resets form values when the modal opens or initial values change.
 * - Validates inputs with Yup via `react-hook-form`.
 * - Disables Save when submitting, invalid, or unchanged from initial values.
 * - On success: updates parent via `onUpdated`, shows a success alert, and closes.
 * - On failure: shows a user-friendly error alert.
 *
 * @param username - Profile username to update.
 * @param open - Whether the modal is visible.
 * @param onClose - Callback to close the modal.
 * @param onUpdated - Callback invoked with the final URL and alt after a successful save.
 * @param initialUrl - Optional initial image URL to prefill.
 * @param initialAlt - Optional initial alt text to prefill.
 * @returns A modal containing the update form.
 */
export function UpdateProfilePicture({
  username,
  open,
  onClose,
  onUpdated,
  initialUrl,
  initialAlt,
}: UpdateProfilePictureProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TUpdateProfilePictureFormValues>({
    resolver: yupResolver(profilePictureSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      avatarUrl: initialUrl ?? '',
      avatarAlt: initialAlt ?? '',
    },
  });

  const { showSuccessAlert, showErrorAlert } = useAlerts();

  useEffect(() => {
    if (open) {
      reset({
        avatarUrl: initialUrl ?? '',
        avatarAlt: initialAlt ?? '',
      });
    }
  }, [open, initialUrl, initialAlt, reset]);

  /**
   * Submits the form by calling the profile API and reconciling returned values.
   *
   * Behavior:
   * - Trims URL/alt, calls `setProfilePicture(username, url, alt)`.
   * - Uses API response when it includes `avatar.url`/`avatar.alt`,
   *   otherwise falls back to trimmed form values.
   * - Notifies parent via `onUpdated`, shows success, and closes the modal.
   * - Catches errors and shows a friendly error alert.
   *
   * @param values - Current form values validated by `profilePictureSchema`.
   * @throws Errors are handled internally; no rethrow.
   */
  async function onSubmit(values: TUpdateProfilePictureFormValues) {
    try {
      const data = await setProfilePicture(
        username,
        values.avatarUrl.trim(),
        values.avatarAlt?.trim() || undefined
      );
      const nextUrl = data.avatar?.url || values.avatarUrl.trim();
      const nextAlt = data.avatar?.alt || values.avatarAlt?.trim() || undefined;
      onUpdated(nextUrl, nextAlt);
      showSuccessAlert('Profile picture updated');
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Could not update profile picture, please try again';
      showErrorAlert(message);
    }
  }

  const urlInputId = 'update-avatar-url';
  const urlErrorId = 'update-avatar-url-error';
  const altInputId = 'update-avatar-alt';
  const altErrorId = 'update-avatar-alt-error';

  const watchedUrl = watch('avatarUrl') ?? '';
  const watchedAlt = watch('avatarAlt') ?? '';
  const trimmedWatchedUrl = watchedUrl.trim();
  const trimmedWatchedAlt = watchedAlt.trim();
  const initialUrlTrimmed = (initialUrl ?? '').trim();
  const initialAltTrimmed = (initialAlt ?? '').trim();
  const isUnchanged =
    trimmedWatchedUrl === initialUrlTrimmed &&
    trimmedWatchedAlt === initialAltTrimmed;

  const isSaveDisabled = isSubmitting || !isValid || isUnchanged;

  return (
    <Modal
      open={open}
      title="Update profile picture"
      ariaLabel="Update profile picture"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor={urlInputId}
            className="mb-1 block text-sm font-medium font-text"
          >
            Image URL
          </label>
          <input
            id={urlInputId}
            type="url"
            inputMode="url"
            placeholder="https://…"
            aria-invalid={!!errors.avatarUrl || undefined}
            aria-describedby={errors.avatarUrl ? urlErrorId : undefined}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 font-text ${
              errors.avatarUrl
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-highlight'
            }`}
            {...register('avatarUrl', { setValueAs: setValueAsTrim })}
          />
          {errors.avatarUrl?.message && (
            <p id={urlErrorId} className="mt-1 text-sm text-red-600 font-text">
              {errors.avatarUrl.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={altInputId}
            className="mb-1 block text-sm font-medium font-text"
          >
            Alt text (optional)
          </label>
          <input
            id={altInputId}
            type="text"
            aria-invalid={!!errors.avatarAlt || undefined}
            aria-describedby={errors.avatarAlt ? altErrorId : undefined}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 font-text ${
              errors.avatarAlt
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-highlight'
            }`}
            {...register('avatarAlt', { setValueAs: setValueAsTrim })}
          />
          {errors.avatarAlt?.message && (
            <p id={altErrorId} className="mt-1 text-sm text-red-600 font-text">
              {errors.avatarAlt.message}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium-buttons"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaveDisabled}
            className="rounded-lg bg-main-dark px-5 py-2 text-white disabled:opacity-60 hover:bg-dark-highlight cursor-pointer font-medium-buttons"
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
