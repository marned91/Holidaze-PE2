import { FaPlus } from 'react-icons/fa';

type AddVenueCardProps = {
  onClick?: () => void;
};

export function AddVenueCard({ onClick }: AddVenueCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-300 bg-white">
      <button
        type="button"
        onClick={onClick}
        className="group grid w-full place-items-center p-6 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
        aria-label="Add venue"
        title="Add venue"
      >
        <div className="flex min-h-[180px] w-full flex-col items-center justify-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 group-hover:ring-2 group-hover:ring-highlight">
            <FaPlus className="h-7 w-7 text-highlight" aria-hidden="true" />
          </span>
          <span className="font-medium-buttons text-dark">Add Venue</span>
        </div>
      </button>
    </article>
  );
}
