import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/holidaze-logo-transparent.png';
import { useState } from 'react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <header className="bg-main-light">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-20 lg:h-25" />
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center">
            <ul className="flex items-center gap-4 m-0 p-0 list-none">
              {isLoggedIn ? (
                <>
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        `uppercase tracking-wide text-white hover:opacity-90 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white/50 ${
                          isActive ? 'underline underline-offset-4' : ''
                        }`
                      }
                    >
                      Sign up
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `rounded-2xl bg-white px-5 py-2 font-semibold text-gray-900 shadow-sm hover:opacity-95 ${
                          isActive ? 'ring-2 ring-white/60' : ''
                        }`
                      }
                      onClick={() => setIsLoggedIn(true)} // demo: toggler login
                    >
                      Log in
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 ${
                          isActive ? 'ring-2 ring-white/60' : ''
                        }`
                      }
                      aria-label="Profile"
                      title="Profile"
                    >
                      <span className="block h-5 w-5 rounded-full bg-white" />
                    </NavLink>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsLoggedIn(false)} // demo: toggler logout
                      className="rounded-2xl bg-white px-5 py-2 font-semibold text-gray-900 shadow-sm hover:opacity-95"
                    >
                      Log out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="w-[22rem]"
          >
            <label htmlFor="site-search" className="sr-only">
              Search
            </label>
            <input
              id="site-search"
              placeholder="Search"
              className="w-full rounded-2xl bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
