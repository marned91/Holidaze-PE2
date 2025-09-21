import type { TVenue } from './venueTypes';
import type { TBooking } from './bookingType';

/**
 * Types for the Profiles domain.
 * Mirrors the public API; no client-derived fields added here.
 */

/**
 * A user profile as returned by the API.
 * @remarks
 * - `venues` / `bookings` are only present when explicitly expanded by the API (e.g., via query params).
 * - `_count` contains server-provided counts for related entities.
 */
export type TProfile = {
  /** Display name (unique per API rules). */
  name: string;

  /** Account email (unique identifier for login and ownership). */
  email: string;

  /** Optional short biography shown on the user's public profile. */
  bio?: string;

  /** Optional avatar image for the profile. */
  avatar?: {
    /** Public URL to the avatar image. */
    url: string;
    /** Alternative text for accessibility; recommended. */
    alt?: string;
  };

  /** Optional banner/cover image shown on the profile page. */
  banner?: {
    /** Public URL to the banner image. */
    url: string;
    /** Alternative text for accessibility; recommended. */
    alt?: string;
  };

  /**
   * Whether the user can create and manage venues.
   * When true, the UI may expose venue management features.
   */
  venueManager?: boolean;

  /**
   * Venues owned by this profile.
   * Present only when the API includes/expands venues.
   */
  venues?: TVenue[];

  /**
   * Bookings made by this profile.
   * Present only when the API includes/expands bookings.
   */
  bookings?: TBooking[];

  /**
   * Server-provided aggregate counts for related entities.
   * Present only when the API includes/expands counts.
   */
  _count?: {
    venues?: number;
    bookings?: number;
  };
};
