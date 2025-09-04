import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import {
  type AccountType,
  type TRegisterData,
  type TRegisterFieldErrors,
} from '../types/auth';

export function SignUpPage() {
  const [accountType, setAccountType] = useState<AccountType>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [avatarUrlError, setAvatarUrlError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setAvatarUrlError(null);
    setLoading(true);

    const payload: TRegisterData = {
      name: name.trim(),
      email: email.trim(),
      password,
      venueManager: accountType === 'venueManager',
      ...(avatarUrl.trim()
        ? { avatar: { url: avatarUrl.trim(), alt: `${name || 'User'} avatar` } }
        : {}),
    };

    try {
      await register(payload);
      alert('Account created - welcome!');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', error);

      const fieldErrors = error?.fieldErrors as
        | TRegisterFieldErrors
        | undefined;

      if (fieldErrors) {
        if (fieldErrors.name) setNameError(fieldErrors.name);
        if (fieldErrors.email) setEmailError(fieldErrors.email);
        if (fieldErrors.password) setPasswordError(fieldErrors.password);
        if (fieldErrors.avatarUrl) setAvatarUrlError(fieldErrors.avatarUrl);
      } else {
        alert(error?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
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

          <div
            role="tablist"
            aria-label="Account type"
            className="relative inline-grid grid-cols-2 rounded-lg bg-gray-200 p-1 shadow-inner w-full overflow-hidden"
          >
            <span
              aria-hidden="true"
              className={[
                'pointer-events-none absolute inset-y-1 w-1/2 rounded-lg bg-white shadow-sm',
                'transform-gpu will-change-transform transition-transform duration-150 ease-out',
                'motion-reduce:transition-none',
                accountType === 'customer'
                  ? 'translate-x-0'
                  : 'translate-x-full',
              ].join(' ')}
            />

            <button
              type="button"
              role="tab"
              aria-selected={accountType === 'customer'}
              aria-controls="account-type-description"
              onClick={() => setAccountType('customer')}
              disabled={loading}
              className={[
                'font-text relative z-10 px-5 py-2 rounded-lg text-sm transition-colors transition-shadow focus-visible:outline-none',
                accountType === 'customer'
                  ? 'text-dark font-medium ring-2 ring-highlight ring-offset-2'
                  : 'text-gray-600 focus-visible:ring-2 focus-visible:ring-highlight',
              ].join(' ')}
            >
              Customer
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={accountType === 'venueManager'}
              aria-controls="account-type-description"
              onClick={() => setAccountType('venueManager')}
              disabled={loading}
              className={[
                'font-text relative z-10 px-5 py-2 rounded-lg text-sm transition-colors',
                accountType === 'venueManager'
                  ? 'text-dark font-medium ring-2 ring-highlight ring-offset-2'
                  : 'text-gray-600 focus-visible:ring-2 focus-visible:ring-highlight',
              ].join(' ')}
            >
              Venue manager
            </button>
          </div>
        </div>

        <div id="account-type-description" role="tabpanel" className="mb-6">
          <h2 className="font-semibold mb-1 text-xl font-medium-buttons">
            {accountType === 'venueManager'
              ? 'Venue manager account'
              : 'Customer account'}
          </h2>

          {accountType === 'venueManager' ? (
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (nameError) setNameError(null);
              }}
              disabled={loading}
              className="w-full font-text border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-100"
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {nameError}
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
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError(null);
              }}
              disabled={loading}
              autoComplete="email"
              className="w-full font-text border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-100"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-mdtext-gray-700 mb-1 font-text"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (passwordError) setPasswordError(null);
              }}
              disabled={loading}
              autoComplete="new-password"
              className="w-full font-text border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-100"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {passwordError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="avatarUrl"
              className="block text-md text-gray-700 mb-1 font-text"
            >
              Profile Image (URL)
            </label>
            <input
              id="avatarUrl"
              type="url"
              placeholder="https://…"
              value={avatarUrl}
              onChange={(event) => {
                setAvatarUrl(event.target.value);
                if (avatarUrlError) setAvatarUrlError(null);
              }}
              disabled={loading}
              inputMode="url"
              className="w-full font-text border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-100"
            />
            {avatarUrlError && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {avatarUrlError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium-buttons bg-main-dark text-white py-2 rounded-lg font-medium hover:bg-dark-highlight disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}
