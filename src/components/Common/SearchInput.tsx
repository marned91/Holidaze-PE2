import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type GlobalSearchInputProps = {
  id: string;
  className?: string; // klasser på <form> wrapper (bredde, margin osv.)
  inputClassName?: string; // ev. ekstra klasser på <input>
  placeholder?: string;
};

/**
 * GlobalSearchInput
 * - Holder søket synkronisert med URL (?q=)
 * - Navigerer alltid til "/" så resultatlisten vises på Home
 */
export function GlobalSearchInput({
  id,
  className,
  inputClassName,
  placeholder = 'Search venues...',
}: GlobalSearchInputProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [value, setValue] = useState<string>(() => {
    return new URLSearchParams(location.search).get('q') ?? '';
  });

  // Reflekter endringer i URL (back/forward etc.)
  useEffect(() => {
    setValue(new URLSearchParams(location.search).get('q') ?? '');
  }, [location.search]);

  function pushToHome(term: string) {
    const trimmed = term.trim();
    const params = new URLSearchParams(location.search);
    if (trimmed) params.set('q', trimmed);
    else params.delete('q');

    navigate(
      {
        pathname: '/',
        search: params.toString() ? `?${params.toString()}` : '',
      },
      { replace: false }
    );
  }

  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className={className}
    >
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          pushToHome(next);
        }}
        className={
          inputClassName ??
          'w-full rounded-xl text-sm bg-white px-4 py-2 text-gray-800 shadow-sm outline-none placeholder:text-gray-500'
        }
      />
    </form>
  );
}
