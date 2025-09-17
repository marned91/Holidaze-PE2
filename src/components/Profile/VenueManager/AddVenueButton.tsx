import { FaPlus } from 'react-icons/fa';

type AddVenueCardProps = {
  onClick?: () => void;
};

export function AddVenueCard({ onClick }: AddVenueCardProps) {
  return (
    <article className=" rounded-xl bg-white">
      <button
        type="button"
        onClick={onClick}
        className="group grid w-full font-medium-buttons font-medium place-items-center p-6 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight rounded-xl border border-gray-300 aspect-[16/10] transition duration-300 ease-out hover:scale-105 cursor-pointer"
        aria-label="Add venue"
        title="Add venue"
      >
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 group-hover:ring-2 group-hover:ring-highlight">
            <FaPlus className="h-7 w-7 text-highlight" aria-hidden="true" />
          </span>
          <span className="font-medium-buttons text-dark">Add Venue</span>
        </div>
      </button>
    </article>
  );
}
