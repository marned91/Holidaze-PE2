import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { authChanged } from '../hooks/useAuthStatus';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setEmailError(null);
    setPasswordError(null);
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    try {
      const account = await login(trimmedEmail, trimmedPassword);

      const username =
        account?.name ??
        (JSON.parse(localStorage.getItem('user') || 'null')?.name as
          | string
          | undefined) ??
        '';

      if (username) {
        localStorage.setItem('username', username);
      }

      authChanged();
      alert('Login successful!');
      navigate(username ? `/profile/${encodeURIComponent(username)}` : '/');
    } catch (unknownError: unknown) {
      console.error('Login failed:', unknownError);
      const message = (unknownError as Error)?.message?.toLowerCase() ?? '';
      if (message.includes('invalid')) {
        setEmailError('Invalid email or password');
        setPasswordError('Invalid email or password');
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-light px-4">
      <section className="w-full max-w-md bg-white rounded-lg shadow-xl py-10 px-8">
        <h1 className="text-3xl font-semibold text-dark mb-6">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-10" noValidate>
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
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                emailError
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
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
              className="block text-md text-gray-700 mb-1 font-text"
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
              autoComplete="current-password"
              className={`w-full font-text border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                passwordError
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-1 focus:ring-gray-300'
              }`}
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600 font-text italic">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-medium-buttons bg-main-dark text-white py-2 rounded-lg font-medium hover:bg-dark-highlight disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
