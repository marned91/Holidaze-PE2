// components/SearchBox.tsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SearchBoxProps = {
  /** id for <input> for tilgjengelighet når du gjenbruker komponenten */
  inputId?: string;
  /** Klassenavn på wrapper (form) – f.eks. bredde */
  wrapperClassName?: string;
  /** Ekstra klasser direkte på <input> */
  inputClassName?: string;
  /** Placeholder-tekst */
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

  // Startverdi hentes én gang ved mount
  const initialValue = useMemo(
    () => new URLSearchParams(location.search).get('q') ?? '',
    // bevisst tom dep-liste: initial lesing ved mount
    []
  );

  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  // Hold feltet i synk hvis URL endres (tilbake/fram, eksterne lenker osv.)
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
    // Viktig: oppdater URL umiddelbart (samme oppførsel som før)
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
