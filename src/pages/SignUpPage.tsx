import { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerAccount } from '../api/authApi';
import type { TRegisterData } from '../types/authTypes';
import type { TSignUpFormValues } from '../types/formTypes';
import { signUpSchema } from '../components/Auth/signUpSchema';
import { mapRegisterErrors } from '../components/Auth/errors/mapRegisterErrors';
import { TextInput } from '../components/Common/forms/TextInput';
import { PasswordInput } from '../components/Common/forms/PasswordInput';
import { UrlInput } from '../components/Common/forms/UrlInput';
import { setValueAsTrim } from '../utils/formValueTransforms';
import { useAlerts } from '../hooks/useAlerts';

/**
 * Sign-up page with account type selection and validated form fields.
 *
 * @remarks
 * - Uses `react-hook-form` with a Yup resolver.
 * - Maps API validation errors to specific fields; uses the AlertsProvider for user feedback.
 */
export function SignUpPage() {
  const navigate = useNavigate();
  const headingId = useId();
  const { showSuccessAlert, showErrorAlert } = useAlerts();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TSignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isVenueManager: false,
      avatarUrl: '',
    },
  });

  const isVenueManager = watch('isVenueManager');

  async function onSubmit(values: TSignUpFormValues) {
    const payload: TRegisterData = {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      venueManager: values.isVenueManager,
      avatar: {
        url: values.avatarUrl.trim(),
        alt: 'Holidaze profile image',
      },
    };

    try {
      await registerAccount(payload);
      showSuccessAlert('Account created — welcome!');
      navigate('/login');
    } catch (unknownError: unknown) {
      const fieldErrors = mapRegisterErrors(unknownError);

      if (fieldErrors?.name) {
        setError('name', { type: 'server', message: fieldErrors.name });
      }
      if (fieldErrors?.email) {
        setError('email', { type: 'server', message: fieldErrors.email });
      }
      if (fieldErrors?.password) {
        setError('password', { type: 'server', message: fieldErrors.password });
      }
      if (fieldErrors?.avatarUrl) {
        setError('avatarUrl', {
          type: 'server',
          message: fieldErrors.avatarUrl,
        });
      }

      if (!fieldErrors) {
        const message =
          unknownError &&
          typeof unknownError === 'object' &&
          'message' in unknownError &&
          typeof (unknownError as { message?: unknown }).message === 'string'
            ? (unknownError as { message: string }).message
            : 'Registration failed.';
        showErrorAlert(message);
      }
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden flex items-center justify-center bg-light px-4">
      <section
        className="w-full max-w-lg bg-white rounded-lg shadow-xl p-5 md:p-10 my-10"
        aria-labelledby={headingId}
      >
        <h1 id={headingId} className="text-3xl font-semibold text-dark mb-6 font-large">
          Create account
        </h1>
        <div className="mb-8">
          <p className="mb-2 text-sm text-gray-700 font-text">Select account type:</p>
          <input
            type="checkbox"
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            {...register('isVenueManager')}
          />
          <div
            role="tablist"
            aria-label="Account type"
            className="relative rounded-2xl border border-gray-300 bg-white shadow-sm overflow-hidden"
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-2xl border-2 border-highlight transition-transform duration-200 ease-out z-0 ${
                isVenueManager ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            <div className="grid grid-cols-2">
              <button
                type="button"
                role="tab"
                aria-selected={!isVenueManager}
                className={`relative z-10 px-5 py-3 text-center font-medium-buttons transition
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight
                    ${
                      !isVenueManager ? 'text-dark font-semibold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                onClick={() =>
                  setValue('isVenueManager', false, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                Customer
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isVenueManager}
                className={`relative z-10 px-5 py-3 text-center font-medium-buttons transition
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight
                    ${
                      isVenueManager ? 'text-dark font-semibold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                onClick={() =>
                  setValue('isVenueManager', true, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                Venue manager
              </button>
            </div>
          </div>
          <div className="mt-6" id="account-type-description" role="region" aria-live="polite">
            <h2 className="text-2xl font-semibold font-medium-buttons mb-1">
              {isVenueManager ? 'Venue manager account' : 'Customer account'}
            </h2>
            {isVenueManager ? (
              <p className="text-sm text-gray-600 font-text">
                Create and manage venues, view upcoming bookings for your venues and manage your own
                bookings.
              </p>
            ) : (
              <p className="text-sm text-gray-600 font-text">
                Discover and book venues, view and manage your bookings.
              </p>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <TextInput
            id="name"
            label="Name"
            ariaInvalid={!!errors.name}
            disabled={isSubmitting}
            errorMessage={errors.name?.message}
            inputProps={{
              maxLength: 20,
              ...register('name'),
            }}
          />
          <TextInput
            id="email"
            label="Email"
            ariaInvalid={!!errors.email}
            disabled={isSubmitting}
            errorMessage={errors.email?.message}
            inputProps={{
              type: 'email',
              autoComplete: 'email',
              ...register('email', { setValueAs: setValueAsTrim }),
            }}
          />
          <PasswordInput
            id="password"
            label="Password"
            ariaInvalid={!!errors.password}
            disabled={isSubmitting}
            errorMessage={errors.password?.message}
            inputProps={{
              autoComplete: 'new-password',
              ...register('password'),
            }}
          />
          <UrlInput
            id="avatarUrl"
            label="Profile image URL"
            ariaInvalid={!!errors.avatarUrl}
            disabled={isSubmitting}
            errorMessage={errors.avatarUrl?.message}
            inputProps={{
              ...register('avatarUrl', { setValueAs: setValueAsTrim }),
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            aria-disabled={isSubmitting || !isValid}
            aria-busy={isSubmitting}
            className="w-full font-medium-buttons bg-main-dark text-white py-2 rounded-lg font-medium hover:bg-dark-highlight disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}
