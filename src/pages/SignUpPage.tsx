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
  avatarAlt: string;
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
    avatarAlt: yup
      .string()
      .required('Alt text is required')
      .max(120, 'Max 120 characters'),
  })
  .required();

export function SignUpPage() {
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    setError,
    watch,
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
      avatarAlt: '',
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
        alt: values.avatarAlt.trim(),
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
        const fe = fieldErrorsLoose as Record<string, string>;
        if (fe.name) setError('name', { type: 'server', message: fe.name });
        if (fe.email) setError('email', { type: 'server', message: fe.email });
        if (fe.password)
          setError('password', { type: 'server', message: fe.password });
        if (fe.avatarUrl)
          setError('avatarUrl', { type: 'server', message: fe.avatarUrl });
        if (fe.avatarAlt)
          setError('avatarAlt', { type: 'server', message: fe.avatarAlt });
        if (fe['avatar.alt'])
          setError('avatarAlt', { type: 'server', message: fe['avatar.alt'] });
      } else {
        alert((unknownError as Error)?.message || 'Registration failed.');
      }
    }
  }

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-light px-4">
      <section className="w-full max-w-lg bg-white rounded-lg shadow-xl p-10 my-10">
        <h1 className="text-3xl font-semibold text-dark mb-6 font-large">
          Create account
        </h1>

        <div className="mb-8">
          <p className="mb-2 text-sm text-gray-700 font-text">
            Select account type:
          </p>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                role="switch"
                aria-checked={isVenueManager}
                aria-label="Toggle venue manager account"
                className="sr-only peer"
                {...registerField('isVenueManager')}
              />
              <span
                className="peer-focus:ring-2 peer-focus:ring-highlight inline-flex h-7 w-12 items-center rounded-full bg-gray-300 transition
                           after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition
                           after:translate-x-1 peer-checked:after:translate-x-5 peer-checked:bg-main-dark"
                aria-hidden="true"
              />
            </label>
          </div>
          <div
            className="mt-4"
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
              Email (stud.noroff.no)
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

          <div>
            <label
              htmlFor="avatarAlt"
              className="block text-md text-gray-700 mb-1 font-text"
            >
              Image alt text
            </label>
            <input
              id="avatarAlt"
              type="text"
              maxLength={120}
              disabled={isSubmitting}
              aria-invalid={!!errors.avatarAlt}
              {...registerField('avatarAlt')}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.avatarAlt
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {errors.avatarAlt && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {errors.avatarAlt.message}
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
