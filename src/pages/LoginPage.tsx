import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../api/authApi';
import { authChanged } from '../hooks/useAuthStatus';

type LoginFormValues = {
  email: string;
  password: string;
};

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  async function onLoginSubmit(values: LoginFormValues) {
    try {
      const account = await login(values.email.trim(), values.password);

      const username =
        account?.name ??
        (JSON.parse(localStorage.getItem('user') || 'null')?.name as
          | string
          | undefined) ??
        '';

      if (username) localStorage.setItem('username', username);
      authChanged();
      alert('Login success!');
      navigate(username ? `/profile/${encodeURIComponent(username)}` : '/');
    } catch (unknownError: unknown) {
      const message = (unknownError as Error)?.message?.toLowerCase() ?? '';
      if (message.includes('invalid')) {
        setError('root', {
          type: 'server',
          message: 'Wrong email or password',
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Login failed. Please try again.',
        });
      }
    }
  }

  const emailHasClientError = !!errors.email; // kun klientvalidering
  const passwordHasClientError = !!errors.password;

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-light px-4">
      <section className="w-full max-w-md bg-white rounded-lg shadow-xl py-10 px-8">
        <h1 className="text-3xl font-semibold text-dark mb-6 font-large">
          Sign in
        </h1>

        {errors.root?.message && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-text text-red-700"
          >
            {errors.root.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onLoginSubmit)}
          className="space-y-8"
          noValidate
        >
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
              aria-invalid={emailHasClientError || undefined}
              {...register('email', {
                setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
              })}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                emailHasClientError
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {emailHasClientError && (
              <p
                className="mt-1 text-sm text-red-600 font-text italic"
                role="alert"
              >
                {errors.email?.message}
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
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={passwordHasClientError || undefined}
              {...register('password')}
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                passwordHasClientError
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {passwordHasClientError && (
              <p
                className="mt-1 text-sm text-red-600 font-text italic"
                role="alert"
              >
                {errors.password?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full font-medium-buttons bg-main-dark text-white py-2 rounded-lg font-medium hover:bg-dark-highlight disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
