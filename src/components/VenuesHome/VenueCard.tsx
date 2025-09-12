import { FaMapMarkerAlt } from 'react-icons/fa';
import type { TVenue } from '../../types/venues';
import { Link } from 'react-router-dom';
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
  const guestText = getGuestsText(venue.maxGuests, 'person', 'people');

  return (
    <Link
      to={`/venue/${venue.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-highlight rounded-lg"
      aria-label={`View ${venue.name}`}
    >
      <article className="rounded-lg overflow-hidden bg-white shadow-xl transition duration-300 ease-out hover:scale-105">
        <img
          src={imageUrl}
          alt={alt}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
        <div className="p-3">
          <h3 className="font-medium font-small-nav-footer">{venue.name}</h3>

          <div className="mt-1 text-sm text-gray-600 flex items-center font-text">
            <FaMapMarkerAlt className="mr-1 text-main-light" />
            <span>{locationText}</span>
          </div>

          <p className="text-sm text-gray-600 mt-1 font-text">
            {guestText}
            <br />
            <span className="font-semibold font-text">Price</span>{' '}
            {formatCurrencyNOK(venue.price)}
          </p>
        </div>
      </article>
    </Link>
  );
}
