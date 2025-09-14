import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';
import { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { logout } from '../api/authApi';
import { useAuthStatus } from '../hooks/useAuthStatus';

function getProfileUrl(): string {
  const stored = localStorage.getItem('username');
  return stored ? `/profile/${encodeURIComponent(stored)}` : '/login';
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStatus();

  function handleLogout() {
    logout();
    alert('You have been logged out.');
    setMenuOpen(false);
    navigate('/');
  }

  const menuId = 'primary-mobile-menu';

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
                {!isLoggedIn ? (
                  <>
                    <li>
                      <NavLink
                        to="/signup"
                        className={({ isActive }) =>
                          `uppercase text-white px-3 py-2 rounded-lg bg-white/20 font-medium hover:ring-1 hover:ring-white/60 ${
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
                          `flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 ${
                            isActive ? 'ring-2 ring-white/60' : ''
                          }`
                        }
                        aria-label="Login"
                        title="Login"
                      >
                        <FaUser className="text-lg text-white" />
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="uppercase text-white px-3 py-2 rounded-lg bg-white/20 font-medium hover:ring-1 hover:ring-white/60"
                      >
                        Log out
                      </button>
                    </li>
                    <li>
                      <NavLink
                        to={getProfileUrl()}
                        className={({ isActive }) =>
                          `flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 ${
                            isActive ? 'ring-2 ring-white/60' : ''
                          }`
                        }
                        aria-label="Profile"
                        title="Profile"
                      >
                        <FaUser className="text-lg text-white" />
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="w-[22rem]"
            >
              <label htmlFor="site-search-desktop" className="sr-only">
                Search
              </label>
              <input
                id="site-search-desktop"
                placeholder="Search venues..."
                className="w-full rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="px-4 py-5 md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className="text-white"
          >
            <FaBars className="text-lg" />
          </button>

          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={Logo} alt="Holidaze logo" className="h-8" />
          </Link>

          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 ${
                  isActive ? 'ring-2 ring-white/60' : ''
                }`
              }
              aria-label="Login"
              title="Login"
              onClick={() => setMenuOpen(false)}
            >
              <FaUser className="text-md text-white" />
            </NavLink>
          ) : (
            <NavLink
              to={getProfileUrl()}
              className={({ isActive }) =>
                `flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 ${
                  isActive ? 'ring-2 ring-white/60' : ''
                }`
              }
              aria-label="Profile"
              title="Profile"
              onClick={() => setMenuOpen(false)}
            >
              <FaUser className="text-md text-white" />
            </NavLink>
          )}
        </div>

        {menuOpen && (
          <div id={menuId} className="mt-4 space-y-3">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block uppercase tracking-wide text-white pl-1"
                >
                  Join us!
                </NavLink>

                <form
                  role="search"
                  onSubmit={(event) => event.preventDefault()}
                  className="pt-1"
                >
                  <label htmlFor="site-search-mobile" className="sr-only">
                    Search
                  </label>
                  <input
                    id="site-search-mobile"
                    placeholder="Search"
                    className="w-full rounded-2xl bg-white px-4 py-1.5 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
                  />
                </form>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block text-left uppercase text-white"
                >
                  Log out
                </button>

                <form
                  role="search"
                  onSubmit={(event) => event.preventDefault()}
                  className="pt-1"
                >
                  <label htmlFor="site-search-mobile" className="sr-only">
                    Search
                  </label>
                  <input
                    id="site-search-mobile"
                    placeholder="Search"
                    className="w-full rounded-2xl bg-white px-4 py-1.5 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
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
