import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../Common/Modal';
import type { TBooking, TUpdateBookingPayload } from '../../types/bookingTypes';
import type { TVenue } from '../../types/venueTypes';
import type { TDateRange } from '../../types/dateTypes';
import { getVenue } from '../../api/venuesApi';
import { updateBooking } from '../../api/bookingsApi';
import { DateRangeFields } from '../Common/DateRangeFields';
import {
  normalizeDateRange,
  isVenueAvailableForRange,
} from '../../utils/dateRange';
import { nightsBetween } from '../../utils/date';

function toDateOnly(input?: string) {
  return (input || '').slice(0, 10);
}
function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}
function dateRangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
) {
  const startTimeA = parseDate(startA).getTime();
  const endTimeA = parseDate(endA).getTime();
  const startTimeB = parseDate(startB).getTime();
  const endTimeB = parseDate(endB).getTime();
  return startTimeA < endTimeB && endTimeA > startTimeB;
}

type BookingLike = { id?: string; dateFrom: string; dateTo: string };

type EditBookingModalProps = {
  open: boolean;
  onClose: () => void;
  booking: TBooking;
  venue: TVenue;
  onUpdated?: (updated: TBooking) => void;
};

type FormValues = {
  dateFrom: string;
  dateTo: string;
  guests: number;
};

/**
 * Edit booking modal with form for updating dates and guests.
 *
 * @param open - Whether modal is visible.
 * @param onClose - Callback when modal should close.
 * @param booking - The booking being edited.
 * @param venue - Venue data for availability.
 * @param onUpdated - Callback with updated booking after save.
 */
export function EditBookingModal({
  open,
  onClose,
  booking,
  venue,
  onUpdated,
}: EditBookingModalProps) {
  const [isVenueLoading, setIsVenueLoading] = useState(false);
  const [venueLoadError, setVenueLoadError] = useState<string | null>(null);
  const [loadedVenue, setLoadedVenue] = useState<TVenue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      dateFrom: toDateOnly(booking.dateFrom),
      dateTo: toDateOnly(booking.dateTo),
      guests: booking.guests,
    },
  });

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    async function loadVenueWithBookings() {
      try {
        setIsVenueLoading(true);
        setVenueLoadError(null);
        const data = await getVenue(venue.id);
        if (!isMounted) return;
        setLoadedVenue(data);
      } catch (error) {
        if (!isMounted) return;
        setVenueLoadError((error as Error).message || 'Failed to load venue');
      } finally {
        if (isMounted) setIsVenueLoading(false);
      }
    }
    setLoadedVenue(null);
    loadVenueWithBookings();
    return () => {
      isMounted = false;
    };
  }, [open, venue.id]);

  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');
  const guests = watch('guests') ?? 0;

  const dateRangeValue: TDateRange = useMemo(
    () => ({ startDate: dateFrom || undefined, endDate: dateTo || undefined }),
    [dateFrom, dateTo]
  );

  const normalizedRange = useMemo(
    () => normalizeDateRange(dateRangeValue),
    [dateRangeValue]
  );

  const unavailableRaw: BookingLike[] = (loadedVenue?.bookings ??
    []) as unknown as BookingLike[];

  const unavailableFiltered = useMemo(() => {
    return unavailableRaw.filter((existing) => {
      const sameId = existing.id === booking.id;
      const sameRange =
        toDateOnly(existing.dateFrom) === toDateOnly(booking.dateFrom) &&
        toDateOnly(existing.dateTo) === toDateOnly(booking.dateTo);
      return !sameId && !sameRange;
    });
  }, [unavailableRaw, booking.id, booking.dateFrom, booking.dateTo]);

  const isSameAsOriginal =
    toDateOnly(dateFrom || '') === toDateOnly(booking.dateFrom) &&
    toDateOnly(dateTo || '') === toDateOnly(booking.dateTo);

  const venueForAvailability: TVenue = useMemo(() => {
    const src = (loadedVenue || venue) as TVenue;
    return {
      ...src,
      bookings: unavailableFiltered as unknown as TVenue['bookings'],
    };
  }, [loadedVenue, venue, unavailableFiltered]);

  const availability = useMemo(() => {
    if (!normalizedRange) return null;
    if (isSameAsOriginal) return null;
    return isVenueAvailableForRange(venueForAvailability, normalizedRange);
  }, [normalizedRange, isSameAsOriginal, venueForAvailability]);

  const numberOfNights = useMemo(() => {
    if (!normalizedRange) return 0;
    return nightsBetween(normalizedRange.from, normalizedRange.to);
  }, [normalizedRange]);

  const maxGuests = loadedVenue?.maxGuests ?? venue.maxGuests;

  const hasDateOrderError =
    !!dateFrom &&
    !!dateTo &&
    parseDate(dateFrom).getTime() >= parseDate(dateTo).getTime();

  const hasOverlapWithUnavailableDates =
    !!dateFrom &&
    !!dateTo &&
    unavailableFiltered.some((existing) =>
      dateRangesOverlap(
        toDateOnly(dateFrom),
        toDateOnly(dateTo),
        toDateOnly(existing.dateFrom),
        toDateOnly(existing.dateTo)
      )
    );

  const guestsValidationMessage =
    guests < 1
      ? 'Must be at least 1 guest'
      : guests > maxGuests
      ? `Max ${maxGuests} guests for this venue`
      : '';

  async function onSubmit(formValues: FormValues) {
    if (
      hasDateOrderError ||
      hasOverlapWithUnavailableDates ||
      guestsValidationMessage
    ) {
      return;
    }

    const payload: TUpdateBookingPayload = {
      dateFrom: toDateOnly(formValues.dateFrom),
      dateTo: toDateOnly(formValues.dateTo),
      guests: Number(formValues.guests),
    };

    try {
      setIsSubmitting(true);
      const updatedBooking = await updateBooking(booking.id, payload);
      onUpdated?.(updatedBooking);
      onClose();
    } catch (error) {
      alert((error as Error)?.message || 'Could not update booking');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit booking"
      ariaLabel="Edit booking"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 font-text"
        noValidate
      >
        {isVenueLoading && (
          <p className="text-sm text-gray-600">Loading availability…</p>
        )}
        {venueLoadError && (
          <p className="text-sm text-red-600 font-text">{venueLoadError}</p>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium font-text">
            Guests
          </label>
          <select
            {...register('guests', { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 bg-white text-sm outline-none font-text ${
              guestsValidationMessage
                ? 'border-red-400 focus:ring-2 focus:ring-red-300'
                : 'border-gray-300 focus:ring-2 focus:ring-highlight'
            }`}
            aria-invalid={!!guestsValidationMessage || undefined}
          >
            {Array.from(
              { length: Math.max(maxGuests, 1) },
              (_, index) => index + 1
            ).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          {guestsValidationMessage && (
            <p className="mt-1 text-sm text-red-600 font-text" role="alert">
              {guestsValidationMessage}
            </p>
          )}
        </div>
        <div className="font-text">
          <DateRangeFields
            value={dateRangeValue}
            onChange={(next) => {
              setValue('dateFrom', next.startDate || '');
              setValue('dateTo', next.endDate || '');
            }}
            variant="calendar"
            labelFrom="Start"
            labelTo="End"
            bookings={unavailableFiltered}
            months={1}
          />
          {normalizedRange && availability === true && (
            <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
              Available for the selected dates!
            </p>
          )}
          {normalizedRange && availability === false && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Not available for the selected dates.
            </p>
          )}
        </div>
        {!!dateFrom &&
          !!dateTo &&
          (hasDateOrderError || hasOverlapWithUnavailableDates) && (
            <div className="rounded-md border border-red-200 font-text bg-red-50 px-3 py-2 text-sm text-red-700">
              {hasDateOrderError
                ? 'The end date must be after the start date.'
                : 'Those dates are not available. Please choose another range.'}
            </div>
          )}
        {normalizedRange && availability === true && (
          <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 font-text text-sm text-gray-800">
            <div className="flex items-center justify-between">
              <span>
                {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}
              </span>
              <span>
                {venue.price.toLocaleString('no-NO')}{' '}
                <span className="text-gray-500">/ night</span>
              </span>
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 font-medium-buttons"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              isVenueLoading ||
              !!venueLoadError ||
              hasDateOrderError ||
              hasOverlapWithUnavailableDates ||
              !!guestsValidationMessage
            }
            className="cursor-pointer rounded-lg bg-main-dark px-5 py-2 text-white hover:bg-dark-highlight disabled:opacity-70 font-medium-buttons"
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
