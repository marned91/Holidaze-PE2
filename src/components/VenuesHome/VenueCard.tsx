import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import type { TVenue } from '../../types/venueTypes';
import {
  getLocationText,
  getVenueImage,
  getGuestsText,
} from '../../utils/venue';
import { formatCurrencyNOK } from '../../utils/currency';
import PlaceholderImage from '../../assets/placeholder.png';

type VenueCardProps = {
  venue: TVenue;
};

/**
 * Card displaying a single venue with image, location, capacity, and price.
 *
 * @remarks
 * - Uses a link wrapper for navigation to the venue details page.
 * - Decorative icons are marked `aria-hidden` to reduce screen reader noise.
 * - No functional or styling changes were made.
 */
export function VenueCard({ venue }: VenueCardProps) {
  const { url, alt } = getVenueImage(venue);
  const imageUrl = url || PlaceholderImage;
  const locationText = getLocationText(venue);
  const guestText = getGuestsText(venue.maxGuests);

  return (
    <Link
      to={`/venue/${encodeURIComponent(venue.id)}`}
      className="block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
      aria-label={`View ${venue.name || 'venue'}`}
    >
      <article className="h-full flex flex-col overflow-hidden rounded-lg bg-white shadow-xl transition duration-300 ease-out hover:scale-105">
        <div className="aspect-[16/10] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <div className="space-y-1 font-text">
            <h4 className="font-small-nav-footer font-medium text-lg">
              {venue.name || 'Untitled venue'}
            </h4>
            <div className="flex items-center text-sm text-gray-600 font-text">
              <FaMapMarkerAlt
                className="mr-1 text-main-light"
                aria-hidden="true"
              />
              <span>{locationText}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 font-text">
              <FaUser className="mr-1 text-main-light" aria-hidden="true" />
              <span>{guestText}</span>
            </div>
          </div>
          <div className="mt-auto pt-2 text-sm text-gray-800 font-text">
            <span className="font-semibold">
              Price {formatCurrencyNOK(venue.price)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
