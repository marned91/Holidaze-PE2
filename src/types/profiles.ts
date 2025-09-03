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

  _count?: {
    venues?: number;
    bookings?: number;
  };
};
