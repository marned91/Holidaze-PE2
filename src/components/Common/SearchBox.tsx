import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchBoxProps = {
  inputId?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  placeholder?: string;
};

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
    []
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
          'w-full rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500'
        }
      />
    </form>
  );
}
