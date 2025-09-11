// src/components/Booking/BookingConfirmedModal.tsx
import { FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { Modal } from '../common/Modal';

type BookingConfirmedModalProps = {
  open: boolean;
  onClose: () => void;
  onViewBooking: () => void;

  venueTitle: string;
  locationText: string;
  imageUrl?: string;
  dateRangeText: string;
  guestsText: string;
  totalText: string;
};

export function BookingConfirmedModal({
  open,
  onClose,
  onViewBooking,
  venueTitle,
  locationText,
  imageUrl,
  dateRangeText,
  guestsText,
  totalText,
}: BookingConfirmedModalProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="Booking confirmed">
      <div className="flex flex-col items-center text-center">
        <div
          className="mb-3 rounded-full bg-green-100 p-3 text-green-600"
          aria-hidden
        >
          <FaCheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold">You’re booked!</h3>
        <p className="mt-1 text-sm text-gray-600">
          You can view your booking in your profile.
        </p>
      </div>

      <div className="mt-6 grid w-full gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-[160px,1fr] sm:items-start">
          {/* Image */}
          <div className="overflow-hidden rounded-lg bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Booked venue"
                className="block w-full h-36 sm:h-44 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-36 sm:h-44" />
            )}
          </div>

          {/* Textual summary */}
          <div className="text-left">
            <h4 className="text-lg font-medium">{venueTitle}</h4>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-main-light" />
              <span>{locationText}</span>
            </div>

            <dl className="mt-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-gray-500">Dates</dt>
                <dd className="text-sm font-medium">{dateRangeText}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm text-gray-500">Guests</dt>
                <dd className="text-sm font-medium">{guestsText}</dd>
              </div>
              <div className="mt-2 border-t pt-3">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-gray-500">Total</dt>
                  <dd className="text-base font-semibold">{totalText}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onViewBooking}
          className="rounded-lg bg-main-dark px-4 py-2 text-sm font-medium text-white hover:bg-dark-highlight"
        >
          View booking
        </button>
      </div>

      {/* A11y: announce success politely */}
      <div className="sr-only" aria-live="polite">
        Booking confirmed for {dateRangeText}. Total {totalText}.
      </div>
    </Modal>
  );
}
