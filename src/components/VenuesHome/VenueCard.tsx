import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
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

export function VenueCard({ venue }: VenueCardProps) {
  const { url, alt } = getVenueImage(venue);
  const imageUrl = url || PlaceholderImage;
  const locationText = getLocationText(venue);
  const guestText = getGuestsText(venue.maxGuests);

  return (
    <Link
      to={`/venue/${encodeURIComponent(venue.id)}`}
      className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight"
      aria-label={`View ${venue.name || 'venue'}`}
    >
      <article className="overflow-hidden rounded-lg bg-white shadow-xl transition duration-300 ease-out hover:scale-105">
        <img
          src={imageUrl}
          alt={alt}
          className="h-40 w-full object-cover"
          loading="lazy"
          decoding="async"
        />

        <div className="p-3">
          <h3 className="font-small-nav-footer font-medium">
            {venue.name || 'Untitled venue'}
          </h3>

          <div className="mt-1 flex items-center text-sm text-gray-600 font-text">
            <FaMapMarkerAlt className="mr-1 text-main-light" />
            <span>{locationText}</span>
          </div>

          <p className="mt-1 text-sm text-gray-600 font-text">
            {guestText}
            <br />
            <span className="font-text font-semibold">Price</span>{' '}
            {formatCurrencyNOK(venue.price)}
          </p>
        </div>
      </article>
    </Link>
  );
}
