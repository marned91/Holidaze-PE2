import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';
import { useState } from 'react';
import { FaBars, FaUser } from 'react-icons/fa';
import { logout } from '../api/authApi';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  function handleLogout() {
    logout();
    alert('You have been logged out.');
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <header className="w-full bg-main-light">
      {/* DESKTOP */}
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
                          `uppercase text-white hover:border px-3 py-2 rounded-lg bg-white/20 font-medium ${
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
                          `flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:border text-white ${
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
                        className="uppercase text-white hover:border px-3 py-2 rounded-lg bg-white/20 font-medium"
                      >
                        Log out
                      </button>
                    </li>
                    <li>
                      <NavLink
                        to="/profile"
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
                placeholder="Search"
                className="w-full rounded-xl bg-white px-4 py-1.5 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
              />
            </form>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="px-4 py-5 md:hidden">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
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
              to="/profile"
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

        {/* dropdown under header when hamburger is open */}
        {menuOpen && (
          <div className="mt-4 space-y-3">
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
                  onSubmit={(e) => e.preventDefault()}
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
                  onSubmit={(e) => e.preventDefault()}
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
