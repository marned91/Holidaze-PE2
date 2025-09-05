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
