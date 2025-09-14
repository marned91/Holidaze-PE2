import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { TRegisterData, TRegisterFieldErrors } from '../types/auth';
import { registerAccount } from '../api/authApi';

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  isVenueManager: boolean;
  avatarUrl: string;
};

function isNoroffStudentEmail(email?: string): boolean {
  if (!email) return false;
  return /^[^@]+@stud\.noroff\.no$/i.test(email.trim());
}

const signUpSchema: yup.ObjectSchema<SignUpFormValues> = yup
  .object({
    name: yup
      .string()
      .required('Name is required')
      .max(20, 'Name cannot be greater than 20 characters')
      .matches(
        /^[A-Za-z0-9_ ]+$/,
        'Only letters, numbers, spaces, and underscore are allowed'
      ),
    email: yup
      .string()
      .required('Email is required')
      .email('Enter a valid email')
      .test(
        'noroff',
        'Email must be a @stud.noroff.no address',
        isNoroffStudentEmail
      ),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'At least 8 characters'),
    isVenueManager: yup.boolean().default(false),
    avatarUrl: yup
      .string()
      .required('Image URL is required')
      .url('Enter a valid URL'),
  })
  .required();

export function SignUpPage() {
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isVenueManager: false,
      avatarUrl: '',
    },
  });

  const isVenueManager = watch('isVenueManager');

  async function onSubmit(values: SignUpFormValues) {
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
      alert('Account created — welcome!');
      navigate('/login');
    } catch (unknownError: unknown) {
      const fieldErrorsLoose = (unknownError as any)?.fieldErrors as
        | TRegisterFieldErrors
        | Record<string, string>
        | undefined;

      if (fieldErrorsLoose) {
        const fieldErrors = fieldErrorsLoose as Record<string, string>;

        if (fieldErrors.name) {
          setError('name', { type: 'server', message: fieldErrors.name });
        }
        if (fieldErrors.email) {
          setError('email', { type: 'server', message: fieldErrors.email });
        }
        if (fieldErrors.password) {
          setError('password', {
            type: 'server',
            message: fieldErrors.password,
          });
        }
        if (fieldErrors.avatarUrl) {
          setError('avatarUrl', {
            type: 'server',
            message: fieldErrors.avatarUrl,
          });
        }
      } else {
        alert((unknownError as Error)?.message || 'Registration failed.');
      }
    }
  }

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-light px-4">
      <section className="w-full max-w-lg bg-white rounded-lg shadow-xl p-5 md:p-10 my-10">
        <h1 className="text-3xl font-semibold text-dark mb-6 font-large">
          Create account
        </h1>

        <div className="mb-8">
          <p className="mb-2 text-sm text-gray-700 font-text">
            Select account type:
          </p>
          <input
            type="checkbox"
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            {...registerField('isVenueManager')}
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
                      !isVenueManager
                        ? 'text-dark font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
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
                      isVenueManager
                        ? 'text-dark font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
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
          <div
            className="mt-6"
            id="account-type-description"
            role="region"
            aria-live="polite"
          >
            <h2 className="text-xl font-semibold font-medium-buttons mb-1">
              {isVenueManager ? 'Venue manager account' : 'Customer account'}
            </h2>
            {isVenueManager ? (
              <p className="text-sm text-gray-600 font-text">
                Create and manage venues, set availability and prices, and view
                upcoming bookings for your venues.
              </p>
            ) : (
              <p className="text-sm text-gray-600 font-text">
                Discover and book venues securely, manage your reservations, and
                save favourites.
              </p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="block text-md text-gray-700 mb-1 font-text"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              maxLength={20}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              {...registerField('name')}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.name
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-md text-gray-700 mb-1 font-text"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              {...registerField('email')}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-md text-gray-700 mb-1 font-text"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              {...registerField('password')}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.password
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="avatarUrl"
              className="block text-md text-gray-700 mb-1 font-text"
            >
              Profile image URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              placeholder="https://…"
              inputMode="url"
              disabled={isSubmitting}
              aria-invalid={!!errors.avatarUrl}
              {...registerField('avatarUrl')}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.avatarUrl
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {errors.avatarUrl && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {errors.avatarUrl.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full font-medium-buttons bg-main-dark text-white py-2 rounded-lg font-medium hover:bg-dark-highlight disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}
