import type { TVenue } from '../types/venueTypes';
import type { TVenueFormValues } from '../types/formTypes';

export function venueToFormValues(venue: TVenue): TVenueFormValues {
  return {
    name: venue.name ?? '',
    description: venue.description ?? '',
    images: (venue.media ?? []).map((m) => ({ url: m.url || '' })) || [
      { url: '' },
      { url: '' },
    ],
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

export function formValuesToCreatePayload(values: TVenueFormValues) {
  const media = values.images
    .map((item, index) => ({
      url: item.url.trim(),
      alt: `${values.name} photo ${index + 1}`,
    }))
    .filter((m) => m.url.length > 0);

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
  } as const;
}
