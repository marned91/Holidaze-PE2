import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';
import { useState } from 'react';
import { FaBars, FaUser, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../api/authApi';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { getUsername } from '../utils/authStorage';
import { SearchBox } from '../components/Common/SearchBox';

/** Builds a profile URL from the stored username; falls back to `/login` if missing. */
function getProfileUrl(): string {
  const stored = getUsername();
  return stored ? `/profile/${encodeURIComponent(stored)}` : '/login';
}

/**
 * Site header with logo, primary navigation, auth actions, and search.
 *
 * @remarks
 * - Desktop and mobile layouts share the same routes; mobile menu is toggled via state.
 * - Icons are decorative and marked `aria-hidden` where the control already has an accessible name.
 * - No functional or styling changes were made.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStatus();

  function handleLogout() {
    logout();
    alert('You have been logged out.');
    setIsMobileMenuOpen(false);
    navigate('/');
  }

  const mobileMenuId = 'primary-mobile-menu';

  const pillButtonClassName =
    'uppercase text-white text-sm px-3 py-1.5 font-small-nav-footer rounded-lg bg-white/15 font-medium hover:ring-1 hover:ring-white/60';

  const roundIconButtonClassName = (isActiveRoute: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/20 ${
      isActiveRoute ? 'ring-2 ring-white/60' : ''
    }`;

  return (
    <header className="w-full bg-main-light">
      <div className="hidden md:block">
        <div className="flex max-w-[100%] items-center justify-between gap-12 px-6 py-3">
          <Link to="/" className="flex items-center" aria-label="Holidaze home">
            <img src={Logo} alt="Holidaze logo" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <nav aria-label="Primary">
              <ul className="flex list-none items-center gap-4 p-0 font-small-nav-footer">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      roundIconButtonClassName(isActive)
                    }
                    aria-label="Home"
                    title="Home"
                  >
                    <FaHome className="text-lg text-white" aria-hidden="true" />
                  </NavLink>
                </li>

                {!isLoggedIn ? (
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
                        <FaUser
                          className="text-lg text-white"
                          aria-hidden="true"
                        />
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
            <SearchBox
              inputId="site-search-desktop"
              wrapperClassName="w-[22rem] lg:w-[22rem] md:w-[18rem] sm:w-[16rem]"
              inputClassName="w-full rounded-xl text-sm font-text bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-5 md:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((wasOpen) => !wasOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            className="text-white -m-2 p-2 flex h-10 w-10 items-center justify-center"
          >
            <FaBars className="text-2xl" aria-hidden="true" />
          </button>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={Logo} alt="Holidaze logo" className="h-8" />
          </Link>
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
              <FaUser className="text-md text-white" aria-hidden="true" />
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
                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${pillButtonClassName} flex w-fit items-center gap-2`}
                >
                  <FaHome aria-hidden="true" className="text-base" />
                  <span>Home</span>
                </NavLink>
                <SearchBox
                  inputId="site-search-mobile"
                  wrapperClassName="pt-2"
                  inputClassName="w-[80%] rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
                />
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${pillButtonClassName} flex w-fit items-center gap-2`}
                >
                  <FaHome aria-hidden="true" className="text-base" />
                  <span>Home</span>
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${pillButtonClassName} flex w-fit items-center gap-2`}
                >
                  <FaSignOutAlt aria-hidden="true" className="text-base" />
                  <span>Log out</span>
                </button>
                <SearchBox
                  inputId="site-search-mobile"
                  wrapperClassName="pt-2"
                  inputClassName="w-[80%] rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
                />
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
