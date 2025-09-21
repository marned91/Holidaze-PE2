import type { TVenue, TCreateVenueInput } from '../types/venueTypes';
import type { TVenueFormValues } from '../types/formTypes';

/** Map a `TVenue` (API shape) to `TVenueFormValues` (form shape). */
export function venueToFormValues(venue: TVenue): TVenueFormValues {
  return {
    name: venue.name ?? '',
    description: venue.description ?? '',
    images: (venue.media ?? []).map((mediaItem) => ({
      url: mediaItem.url || '',
    })),
    maxGuests: typeof venue.maxGuests === 'number' ? venue.maxGuests : 0,
    price: typeof venue.price === 'number' ? venue.price : 0,
    city: venue.location?.city ?? '',
    meta: {
      wifi: !!venue.meta?.wifi,
      parking: !!venue.meta?.parking,
      breakfast: !!venue.meta?.breakfast,
      pets: !!venue.meta?.pets,
    },
  };
}

/** Map `TVenueFormValues` back to a `TCreateVenueInput` payload for the API. */
export function formValuesToCreatePayload(
  values: TVenueFormValues
): TCreateVenueInput {
  const media = values.images
    .map((imageItem, index) => ({
      url: imageItem.url.trim(),
      alt: `${values.name || 'Venue'} photo ${index + 1}`,
    }))
    .filter((mediaItem) => mediaItem.url.length > 0);

  return {
    name: values.name.trim(),
    description: values.description.trim(),
    media,
    maxGuests: values.maxGuests,
    price: values.price,
    location: { country: 'Norway', city: values.city.trim() },
    meta: {
      wifi: !!values.meta.wifi,
      parking: !!values.meta.parking,
      breakfast: !!values.meta.breakfast,
      pets: !!values.meta.pets,
    },
  };
}
