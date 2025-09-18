import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';
import { useState, useEffect } from 'react';
import { FaBars, FaUser, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../api/authApi';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { getUsername } from '../utils/authStorage';

function getProfileUrl(): string {
  const stored = getUsername();
  return stored ? `/profile/${encodeURIComponent(stored)}` : '/login';
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuthStatus();

  const [searchTerm, setSearchTerm] = useState<string>(() => {
    return new URLSearchParams(location.search).get('q') ?? '';
  });

  useEffect(() => {
    setSearchTerm(new URLSearchParams(location.search).get('q') ?? '');
  }, [location.search]);

  function pushSearchToHome(term: string) {
    const trimmed = term.trim();
    const params = new URLSearchParams(location.search);
    if (trimmed) params.set('q', trimmed);
    else params.delete('q');

    navigate(
      {
        pathname: '/', // alltid vis resultater på Home
        search: params.toString() ? `?${params.toString()}` : '',
      },
      { replace: false }
    );
  }

  function handleSearchChange(next: string) {
    setSearchTerm(next);
    pushSearchToHome(next);
  }

  function handleLogout() {
    logout();
    alert('You have been logged out.');
    setIsMobileMenuOpen(false);
    navigate('/');
  }

  const mobileMenuId = 'primary-mobile-menu';

  // Felles, beskrivende klassenavn
  const pillButtonClassName =
    'uppercase text-white text-sm px-3 py-1.5 rounded-lg bg-white/20 font-medium hover:ring-1 hover:ring-white/60';

  const roundIconButtonClassName = (isActiveRoute: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 ${
      isActiveRoute ? 'ring-2 ring-white/60' : ''
    }`;

  return (
    <header className="w-full bg-main-light">
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="flex max-w-[100%] items-center justify-between gap-12 px-6 py-3">
          <Link to="/" className="flex items-center" aria-label="Holidaze home">
            <img src={Logo} alt="Holidaze logo" className="h-6 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
            <nav aria-label="Primary">
              <ul className="flex list-none items-center gap-4 p-0 font-small-nav-footer">
                {/* Home (alltid synlig) */}
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      roundIconButtonClassName(isActive)
                    }
                    aria-label="Home"
                    title="Home"
                  >
                    <FaHome className="text-lg text-white" />
                  </NavLink>
                </li>

                {!isLoggedIn ? (
                  // ULOGGET: Home → Join us → Log in
                  <>
                    <li>
                      <NavLink
                        to="/signup"
                        className={({ isActive }) =>
                          `${pillButtonClassName} ${
                            isActive ? 'ring-2 ring-white/60' : ''
                          }`
                        }
                      >
                        Join us!
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          `${pillButtonClassName} ${
                            isActive ? 'ring-2 ring-white/60' : ''
                          }`
                        }
                      >
                        Log in
                      </NavLink>
                    </li>
                  </>
                ) : (
                  // INNLOGGET: Home → Profile → Log out
                  <>
                    <li>
                      <NavLink
                        to={getProfileUrl()}
                        className={({ isActive }) =>
                          roundIconButtonClassName(isActive)
                        }
                        aria-label="Profile"
                        title="Profile"
                      >
                        <FaUser className="text-lg text-white" />
                      </NavLink>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={pillButtonClassName}
                      >
                        Log out
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Desktop-søk (kontrollert) */}
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="w-[22rem] lg:w-[22rem] md:w-[18rem] sm:w-[16rem]"
            >
              <label htmlFor="site-search-desktop" className="sr-only">
                Search
              </label>
              <input
                id="site-search-desktop"
                placeholder="Search venues..."
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="w-full rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="px-4 py-5 md:hidden">
        <div className="flex items-center justify-between">
          {/* Større hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen((wasOpen) => !wasOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            className="text-white -m-2 p-2 flex h-10 w-10 items-center justify-center"
          >
            <FaBars className="text-2xl" />
          </button>

          {/* Logo */}
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={Logo} alt="Holidaze logo" className="h-8" />
          </Link>

          {/* Høyre: Log in (ulogget) / profil (innlogget) */}
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${pillButtonClassName} ${
                  isActive ? 'ring-2 ring-white/60' : ''
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </NavLink>
          ) : (
            <NavLink
              to={getProfileUrl()}
              className={({ isActive }) => roundIconButtonClassName(isActive)}
              aria-label="Profile"
              title="Profile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaUser className="text-md text-white" />
            </NavLink>
          )}
        </div>

        {isMobileMenuOpen && (
          <div
            id={mobileMenuId}
            className="mt-10 pt-4 space-y-3 border-t border-white/60 -mx-4 px-4"
          >
            {!isLoggedIn ? (
              <>
                {/* Join us */}
                <NavLink
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `${pillButtonClassName} flex w-fit items-center gap-2 ${
                      isActive ? 'ring-2 ring-white/60' : ''
                    }`
                  }
                >
                  Join us!
                </NavLink>

                {/* Home */}
                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${pillButtonClassName} flex w-fit items-center gap-2`}
                >
                  <FaHome aria-hidden className="text-base" />
                  <span>Home</span>
                </NavLink>

                {/* Søk nederst (kontrollert) */}
                <form
                  role="search"
                  onSubmit={(event) => event.preventDefault()}
                  className="pt-2"
                >
                  <label htmlFor="site-search-mobile" className="sr-only">
                    Search
                  </label>
                  <input
                    id="site-search-mobile"
                    placeholder="Search venues..."
                    value={searchTerm}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="w-[80%] rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
                  />
                </form>
              </>
            ) : (
              <>
                {/* INNLOGGET (mobil meny): Home → Log out → Search */}
                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${pillButtonClassName} flex w-fit items-center gap-2`}
                >
                  <FaHome aria-hidden className="text-base" />
                  <span>Home</span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${pillButtonClassName} flex w-fit items-center gap-2`}
                >
                  <FaSignOutAlt aria-hidden className="text-base" />
                  <span>Log out</span>
                </button>

                <form
                  role="search"
                  onSubmit={(event) => event.preventDefault()}
                  className="pt-2"
                >
                  <label htmlFor="site-search-mobile" className="sr-only">
                    Search
                  </label>
                  <input
                    id="site-search-mobile"
                    placeholder="Search venues..."
                    value={searchTerm}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="w-[80%] rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
                  />
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
