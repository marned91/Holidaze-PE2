import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from '../Common/Modal';
import { setProfilePicture } from '../../api/profilesApi';
import type { TUpdateProfilePictureFormValues } from '../../types/formTypes';
import { profilePictureSchema } from './forms/profilePictureSchema';
import { setValueAsTrim } from '../../utils/formValueTransforms';

type UpdateProfilePictureProps = {
  username: string;
  open: boolean;
  onClose: () => void;
  onUpdated: (url: string, alt?: string) => void;
  initialUrl?: string;
  initialAlt?: string;
};

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
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (open) {
      reset({
        avatarUrl: initialUrl ?? '',
        avatarAlt: initialAlt ?? '',
      });
    }
  }, [open, initialUrl, initialAlt, reset]);

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
      alert('Profile picture updated');
      onClose();
    } catch (unknownError) {
      const message =
        (unknownError as Error)?.message ||
        'Could not update profile picture, please try again';
      alert(message);
    }
  }

  return (
    <Modal
      open={open}
      title="Update profile picture"
      ariaLabel="Update profile picture"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium font-text">
            Image URL
          </label>
          <input
            type="url"
            inputMode="url"
            placeholder="https://…"
            aria-invalid={!!errors.avatarUrl}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 font-text ${
              errors.avatarUrl
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-highlight'
            }`}
            {...register('avatarUrl', { setValueAs: setValueAsTrim })}
          />
          {errors.avatarUrl?.message && (
            <p className="mt-1 text-sm text-red-600 font-text">
              {errors.avatarUrl.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium font-text">
            Alt text (optional)
          </label>
          <input
            type="text"
            aria-invalid={!!errors.avatarAlt}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 font-text ${
              errors.avatarAlt
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-highlight'
            }`}
            {...register('avatarAlt', { setValueAs: setValueAsTrim })}
          />
          {errors.avatarAlt?.message && (
            <p className="mt-1 text-sm text-red-600 font-text">
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
            disabled={isSubmitting}
            className="rounded-lg bg-main-dark px-5 py-2 text-white disabled:opacity-60 hover:bg-dark-highlight cursor-pointer font-medium-buttons"
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
