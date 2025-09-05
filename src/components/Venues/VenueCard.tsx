import { FaMapMarkerAlt } from 'react-icons/fa';
import type { TVenue } from '../../types/venues';
import PlaceholderImage from '../../assets/placeholder.png';

type VenueCardProps = {
  venue: TVenue;
};

export function VenueCard({ venue }: VenueCardProps) {
  const imageUrl = venue.media?.[0]?.url || PlaceholderImage;
  const imageAlt = venue.media?.[0]?.alt || venue.name || 'Venue image';

  const locationText =
    [venue.location?.city, venue.location?.country]
      .filter(Boolean)
      .join(', ') || 'Location';

  const guestText =
    typeof venue.maxGuests === 'number'
      ? `${venue.maxGuests} ${venue.maxGuests === 1 ? 'person' : 'people'}`
      : 'Guests';

  return (
    <article className="rounded-lg overflow-hidden bg-white shadow-lg transition duration-300 ease-out hover:scale-105 cursor-pointer">
      <img src={imageUrl} alt={imageAlt} className="h-40 w-full object-cover" />
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
          {typeof venue.price === 'number' ? venue.price : ''} NOK
        </p>
      </div>
    </article>
  );
}
