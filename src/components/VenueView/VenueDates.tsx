import type { TVenueBooking } from '../../types/venues';
import type { TDateRange } from '../../types/date';
import { RangeCalendar } from './RangeCalendar';

type VenueDatesProps = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  bookings?: TVenueBooking[];
};

export function VenueDates({ value, onChange, bookings }: VenueDatesProps) {
  return (
    <section>
      <h3 className="text-2xl font-medium font-small-nav-footer">
        Availability
      </h3>
      <p className="mt-3 text-sm text-gray-500 font-text">
        Click a start date, then an end date. Unavailable and past dates are
        disabled.
      </p>
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xl w-full">
        <RangeCalendar
          value={value}
          onChange={onChange}
          bookings={bookings ?? []}
          months={2}
        />
      </div>
    </section>
  );
}
