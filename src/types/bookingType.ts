import { type TVenue } from './venueTypes';

export type TBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
};

export type TBookingWithVenue = TBooking & {
  venue: TVenue;
  totalPrice?: number;
};

export type TCreateBookingPayload = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type TCreateBookingResponse = { id: string };
