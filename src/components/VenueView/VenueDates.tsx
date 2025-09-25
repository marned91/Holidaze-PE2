import { useId } from 'react';
import type { TVenueBooking } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateTypes';
import { RangeCalendar } from './RangeCalendar';

type VenueDatesProps = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  bookings?: TVenueBooking[];
};

/**
 * Availability section that renders a range calendar for picking start/end dates.
 *
 * Behavior:
 * - Labels the calendar group via `aria-labelledby`/`aria-describedby` for screen readers.
 * - Delegates date picking to <RangeCalendar>, which disables past and booked dates.
 * - Forwards `value`/`onChange` and optional `bookings`.
 *
 * @param value - Current date range (`{ startDate?: string; endDate?: string }` in ISO yyyy-mm-dd).
 * @param onChange - Called when the user selects a new range.
 * @param bookings - Optional venue bookings used to indicate availability.
 * @returns A titled section wrapping the availability calendar.
 */
export function VenueDates({ value, onChange, bookings = [] }: VenueDatesProps) {
  const sectionId = useId();
  const descriptionId = useId();

  return (
    <section aria-labelledby={`${sectionId}-title`}>
      <h3 id={`${sectionId}-title`} className="text-xl font-medium font-small-nav-footer">
        Availability
      </h3>
      <p id={descriptionId} className="mt-3 text-sm text-gray-500 font-text">
        Click a start date, then an end date. Unavailable and past dates are disabled.
      </p>
      <div
        className="mt-3 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
        role="group"
        aria-labelledby={`${sectionId}-title`}
        aria-describedby={descriptionId}
      >
        <RangeCalendar value={value} onChange={onChange} bookings={bookings} months={2} />
      </div>
    </section>
  );
}
