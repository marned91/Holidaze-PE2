import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchBoxProps = {
  inputId?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  placeholder?: string;
};

/**
 * SearchBox component that syncs its input value with the `q` query parameter in the URL.
 *
 * Behavior:
 * - Reads the initial search term from the URL on mount.
 * - Keeps the input value and URL in sync on change.
 * - Prevents form submission reload.
 *
 * @param inputId - Optional custom id for the input (default: "site-search").
 * @param wrapperClassName - Optional CSS classes applied to the form element.
 * @param inputClassName - Optional CSS classes applied to the input element.
 * @param placeholder - Input placeholder text (default: "Search venues...").
 * @returns A controlled search input field bound to the URL query.
 */
export function SearchBox({
  inputId = 'site-search',
  wrapperClassName,
  inputClassName,
  placeholder = 'Search venues...',
}: SearchBoxProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const initialValue = useMemo(
    () => new URLSearchParams(location.search).get('q') ?? '',
    [location.search]
  );

  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  useEffect(() => {
    const nextFromUrl = new URLSearchParams(location.search).get('q') ?? '';
    setSearchTerm(nextFromUrl);
  }, [location.search]);

  function pushSearchToHome(nextValue: string) {
    const queryParams = new URLSearchParams(location.search);
    const trimmed = nextValue.trim();

    if (trimmed) queryParams.set('q', trimmed);
    else queryParams.delete('q');

    navigate(
      {
        pathname: '/',
        search: queryParams.toString() ? `?${queryParams.toString()}` : '',
      },
      { replace: false }
    );
  }

  function handleInputChange(value: string) {
    setSearchTerm(value);
    pushSearchToHome(value);
  }

  return (
    <form
      role="search"
      action="#"
      onSubmit={(event) => event.preventDefault()}
      className={wrapperClassName}
    >
      <label htmlFor={inputId} className="sr-only">
        Search
      </label>
      <input
        id={inputId}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(event) => handleInputChange(event.target.value)}
        className={
          inputClassName ??
          'w-full rounded-xl text-sm bg-white px-4 py-2 font-text text-gray-800 shadow-sm outline-none placeholder:text-gray-500'
        }
      />
    </form>
  );
}
