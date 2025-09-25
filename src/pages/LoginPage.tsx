import { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../api/authApi';
import type { TLoginFormValues } from '../types/formTypes';
import { loginSchema } from '../components/Auth/loginSchema';
import { TextInput } from '../components/Common/forms/TextInput';
import { PasswordInput } from '../components/Common/forms/PasswordInput';
import { setValueAsTrim } from '../utils/formValueTransforms';

/**
 * Login page with email/password form, validation, and error feedback.
 *
 * @remarks
 * - Uses `react-hook-form` with a Yup resolver.
 * - Server error is announced via a live `role="alert"` region.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const headingId = useId();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TLoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  async function onLoginSubmit(values: TLoginFormValues) {
    try {
      const account = await login(values.email.trim(), values.password);
      const username = account?.name || '';
      navigate(username ? `/profile/${encodeURIComponent(username)}` : '/');
    } catch (unknownError: unknown) {
      const message = (unknownError as Error)?.message?.toLowerCase() ?? '';
      setError('root', {
        type: 'server',
        message: message.includes('invalid')
          ? 'Wrong email or password'
          : 'Login failed. Please try again.',
      });
    }
  }

  return (
    <main className="min-h-[calc(100vh-120px)] overflow-x-hidden flex items-center justify-center bg-light px-4">
      <section
        className="w-full max-w-md bg-white rounded-lg shadow-xl py-15 px-8"
        aria-labelledby={headingId}
      >
        <h1 id={headingId} className="text-3xl font-semibold text-dark mb-6 font-large">
          Sign in
        </h1>

        {errors.root?.message && (
          <div
            role="alert"
            className="mb-6 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-text text-red-700"
          >
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-8" noValidate>
          <TextInput
            id="email"
            label="Email"
            ariaInvalid={!!errors.email}
            disabled={isSubmitting}
            errorMessage={errors.email?.message}
            inputProps={{
              type: 'email',
              autoComplete: 'email',
              'aria-describedby': errors.email ? 'email-error' : undefined,
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
              autoComplete: 'current-password',
              'aria-describedby': errors.password ? 'password-error' : undefined,
              ...register('password'),
            }}
          />

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            aria-disabled={isSubmitting || !isValid}
            aria-busy={isSubmitting}
            className="w-full font-medium-buttons bg-main-dark text-white py-2 rounded-lg font-medium hover:bg-dark-highlight disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
