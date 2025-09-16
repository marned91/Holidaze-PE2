import type { TVenue } from './venueTypes';
import type { TBooking } from './bookingType';

export type TProfile = {
  name: string;
  email: string;
  bio?: string;

  avatar?: {
    url: string;
    alt?: string;
  };

  banner?: {
    url: string;
    alt?: string;
  };

  venueManager?: boolean;

  venues?: TVenue[];

  bookings?: TBooking[];

  _count?: {
    venues?: number;
    bookings?: number;
  };
};
