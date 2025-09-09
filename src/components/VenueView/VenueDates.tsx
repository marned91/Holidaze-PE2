import type { TVenueBooking } from '../../types/venues';
import type { TDateRange } from '../../types/date';
import { RangeCalendarRC as RangeCalendar } from './RangeCalendarRC';

export type DateRangeValue = TDateRange;

type VenueDatesProps = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  bookings?: TVenueBooking[];
  className?: string;
};

export function VenueDates({
  value,
  onChange,
  bookings,
  className,
}: VenueDatesProps) {
  return (
    <section className={className ?? ''}>
      <h3 className="text-2xl font-medium font-small-nav-footer">
        Availability
      </h3>
      <p className="mt-3 text-sm text-gray-500 font-text">
        Click a start date, then an end date. Unavailable and past dates are
        disabled.
      </p>
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
        <RangeCalendar
          value={value}
          onChange={onChange}
          bookings={bookings ?? []}
          months={2}
          className="w-full"
        />
      </div>
    </section>
  );
}
