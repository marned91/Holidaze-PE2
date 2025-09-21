import type { TVenue } from '../../../types/venueTypes';
import { formatCurrencyNOK } from '../../../utils/currency';
import { getLocationText, getVenueImage } from '../../../utils/venue';

type ManageVenuesProps = {
  venue: TVenue;
  onEdit?: (venue: TVenue) => void;
  onDelete?: (venue: TVenue) => void;
};

/**
 * Card displaying a single venue with key details and Edit/Delete actions.
 *
 * @remarks
 * - Keeps visual structure and behavior unchanged.
 * - Adds ARIA semantics by linking the article to its heading and
 *   giving the buttons screen-reader-friendly labels.
 */
export function ManageVenues({ venue, onEdit, onDelete }: ManageVenuesProps) {
  const { url: imageUrl, alt: imageAlt } = getVenueImage(venue);
  const titleId = `venue-${venue.id}-title`;

  return (
    <article
      className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl p-2 md:p-4"
      aria-labelledby={titleId}
    >
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
        <h4 id={titleId} className="text-lg font-medium font-small-nav-footer">
          {venue.name}
        </h4>

        <ul className="mt-2 space-y-1 text-sm text-gray-600 font-text">
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
            className="rounded-xl border px-3 py-1.5 text-sm transition duration-300 ease-out hover:scale-105 font-medium-buttons hover:bg-gray-50 cursor-pointer"
            aria-label={`Edit venue ${venue.name}`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(venue)}
            className="rounded-xl border px-3 py-1.5 text-sm transition duration-300 ease-out hover:scale-105 font-medium-buttons text-red-700 hover:bg-red-50 cursor-pointer"
            aria-label={`Delete venue ${venue.name}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
