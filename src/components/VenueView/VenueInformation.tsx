import { type TVenue } from '../../types/venues';
import {
  FaMapMarkerAlt,
  FaStar,
  FaDog,
  FaWifi,
  FaParking,
  FaCoffee,
  FaUser,
} from 'react-icons/fa';

type VenueInformationProps = {
  title: string;
  locationText: string;
  rating?: number;
  maxGuests?: number;
  description?: string;
  facilities?: TVenue['meta'];
};

export function VenueInformation({
  title,
  locationText,
  rating,
  maxGuests,
  description,
  facilities,
}: VenueInformationProps) {
  const hasAnyFacility =
    !!facilities?.wifi ||
    !!facilities?.parking ||
    !!facilities?.breakfast ||
    !!facilities?.pets;

  return (
    <section>
      <h1 className="text-4xl font-medium font-large">{title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-700">
        <span className="flex items-center font-text">
          <FaMapMarkerAlt className="mr-2 text-main-light" />
          {locationText || 'Location'}
        </span>

        {typeof maxGuests === 'number' && (
          <span className="flex items-center font-text">
            <FaUser className="mr-2 text-main-light" />
            {maxGuests} {maxGuests === 1 ? 'guest' : 'guests'}
          </span>
        )}

        {typeof rating === 'number' && (
          <span className="flex items-center font-text">
            <FaStar className="mr-2 text-main-light" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="my-4 border-b border-gray-400" />

      {description && (
        <>
          <h3 className="text-2xl font-medium font-small-nav-footer">
            Description
          </h3>
          <p className="mt-5 whitespace-pre-line text-gray-700 font-text">
            {description}
          </p>
          <div className="my-5 border-b border-gray-400" />
        </>
      )}

      <div className="my-5 border-b border-gray-400">
        <h3 className="text-2xl font-medium font-small-nav-footer">
          Facilities
        </h3>
        {hasAnyFacility ? (
          <ul className="mt-5 grid grid-cols-2 gap-2 text-gray-800 sm:grid-cols-3 my-5">
            {facilities?.wifi && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaWifi className="text-main-light" />
                Wi-Fi
              </li>
            )}
            {facilities?.parking && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaParking className="text-main-light" />
                Parking
              </li>
            )}
            {facilities?.breakfast && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaCoffee className="text-main-light" />
                Breakfast
              </li>
            )}
            {facilities?.pets && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaDog className="text-main-light" />
                Pets
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-2 text-gray-600 font-text italic my-5">
            No facilities listed
          </p>
        )}
      </div>
    </section>
  );
}
