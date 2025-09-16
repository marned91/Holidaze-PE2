import type { TVenue } from '../../../types/venues';
import { formatCurrencyNOK } from '../../../utils/currency';
import { getLocationText, getVenueImage } from '../../../utils/venue';

type ManageVenueCardProps = {
  venue: TVenue;
  onEdit?: (venue: TVenue) => void;
  onDelete?: (venue: TVenue) => void;
};

export function ManageVenueCard({
  venue,
  onEdit,
  onDelete,
}: ManageVenueCardProps) {
  const { url: imageUrl, alt: imageAlt } = getVenueImage(venue);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg p-4">
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium font-small-nav-footer">{venue.name}</h3>

        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>
            <span className="font-semibold">Price:</span>{' '}
            {formatCurrencyNOK(venue.price)} / night
          </li>
          <li>
            <span className="font-semibold">Max guests:</span> {venue.maxGuests}
          </li>
          <li>
            <span className="font-semibold">Location:</span>{' '}
            {getLocationText(venue)}
          </li>
        </ul>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => onEdit?.(venue)}
            className="rounded-full border px-4 py-1.5 text-sm transition duration-300 ease-out hover:scale-105 cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(venue)}
            className="rounded-full border px-4 py-1.5 text-sm transition duration-300 ease-out hover:scale-105 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
