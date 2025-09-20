export type TVenueBooking = {
  dateFrom: string;
  dateTo: string;
};

export type TVenue = {
  id: string;
  name: string;
  description?: string;
  media?: {
    url: string;
    alt?: string;
  }[];
  price: number;
  maxGuests: number;
  rating?: number;
  created: string;
  updated: string;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
    lat?: number;
    lng?: number;
  };
  bookings?: TVenueBooking[];
};

export type TCreateVenueInput = {
  name: string;
  description: string;
  media: { url: string; alt?: string }[];
  maxGuests: number;
  price: number;
  location: { city?: string; country: string };
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
};

export type TVenueBookingExtended = TVenueBooking & {
  id: string;
  guests?: number;
  customer?: { name?: string; username?: string };
  totalPrice?: number;
};
