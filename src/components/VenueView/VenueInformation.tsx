import { useId } from 'react';
import { type TVenue } from '../../types/venueTypes';
import { getGuestsText } from '../../utils/venue';
import { FaMapMarkerAlt, FaStar, FaDog, FaWifi, FaParking, FaCoffee, FaUser } from 'react-icons/fa';

type VenueInformationProps = {
  title: string;
  locationText: string;
  rating?: number;
  maxGuests?: number;
  description?: string;
  facilities?: TVenue['meta'];
};

/**
 * Displays venue header information: title, location, rating, capacity, description, and facilities.
 *
 * Behavior:
 * - Associates the section to its main heading via `aria-labelledby`.
 * - Shows location, optional max guests (formatted with `getGuestsText`), and optional rating (1 decimal).
 * - Renders description (preserves line breaks) when provided.
 * - Lists facilities (Wi-Fi, Parking, Breakfast, Pets) with decorative icons marked `aria-hidden`.
 * - Falls back to “No facilities listed” when none are enabled.
 *
 * @param title - Venue title.
 * @param locationText - Human-readable location string.
 * @param rating - Average rating (number); displayed with one decimal when finite.
 * @param maxGuests - Maximum number of guests the venue supports.
 * @param description - Optional venue description (plain text; newlines preserved).
 * @param facilities - Feature flags from the venue’s `meta` (wifi, parking, breakfast, pets).
 * @returns A section element containing venue summary information.
 */
export function VenueInformation({
  title,
  locationText,
  rating,
  maxGuests,
  description,
  facilities,
}: VenueInformationProps) {
  const hasAnyFacility = !!(
    facilities?.wifi ||
    facilities?.parking ||
    facilities?.breakfast ||
    facilities?.pets
  );

  const ratingText =
    typeof rating === 'number' && Number.isFinite(rating) ? rating.toFixed(1) : null;

  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h1 id={headingId} className="text-3xl font-medium font-large text-dark">
        {title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-700">
        <span className="flex items-center font-text">
          <FaMapMarkerAlt aria-hidden="true" className="mr-2 text-main-light" />
          {locationText || 'Location'}
        </span>
        {typeof maxGuests === 'number' && Number.isFinite(maxGuests) && (
          <span className="flex items-center font-text">
            <FaUser aria-hidden="true" className="mr-2 text-main-light" />
            {getGuestsText(maxGuests)}
          </span>
        )}
        {ratingText && (
          <span className="flex items-center font-text">
            <FaStar aria-hidden="true" className="mr-2 text-main-light" />
            {ratingText}
          </span>
        )}
      </div>
      <div className="my-4 border-b border-gray-400" />
      {description && (
        <>
          <h3 className="text-xl font-medium font-small-nav-footer">Description</h3>
          <p className="mt-5 whitespace-pre-line text-gray-700 font-text">{description}</p>
          <div className="my-5 border-b border-gray-400" />
        </>
      )}
      <div className="my-5 border-b border-gray-400">
        <h3 className="text-xl font-medium font-small-nav-footer">Facilities</h3>
        {hasAnyFacility ? (
          <ul className="mt-5 grid grid-cols-2 gap-2 text-gray-800 sm:grid-cols-3 my-5">
            {facilities?.wifi && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaWifi aria-hidden="true" className="text-main-light" />
                Wi-Fi
              </li>
            )}
            {facilities?.parking && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaParking aria-hidden="true" className="text-main-light" />
                Parking
              </li>
            )}
            {facilities?.breakfast && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaCoffee aria-hidden="true" className="text-main-light" />
                Breakfast
              </li>
            )}
            {facilities?.pets && (
              <li className="inline-flex items-center gap-2 font-text">
                <FaDog aria-hidden="true" className="text-main-light" />
                Pets
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-2 my-5 text-gray-600 font-text italic">No facilities listed</p>
        )}
      </div>
    </section>
  );
}
