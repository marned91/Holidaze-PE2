import { Modal } from '../Common/Modal';
import { FaMapMarkerAlt } from 'react-icons/fa';

type BookingReviewProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  venueTitle: string;
  locationText: string;
  imageUrl?: string;
  dateRangeText: string;
  guestsText: string;
  totalText: string;
  submitting?: boolean;
  error?: string | null;
};

/**
 * Modal to review a booking before confirmation.
 *
 * Behavior:
 * - Controlled by `open`; purely presentational.
 * - Displays booking summary, optional error, and a confirm action.
 * - Disables the confirm button while `submitting` is truthy.
 *
 * @param props - Visibility, callbacks, summary texts, and submit state.
 * @returns A controlled modal with booking details and confirm action.
 */
export function BookingReviewModal({
  open,
  onClose,
  onConfirm,
  venueTitle,
  locationText,
  imageUrl,
  dateRangeText,
  guestsText,
  totalText,
  submitting,
  error,
}: BookingReviewProps) {
  return (
    <Modal open={open} title="Review your stay" onClose={onClose}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-md bg-gray-100 h-[300px] md:h-[340px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={venueTitle}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              sizes="(min-width: 768px) 280px, 100vw"
            />
          ) : (
            <div className="absolute inset-0" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-small-nav-footer">{venueTitle}</h3>
          <div className="mt-3 flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-main-light" />
            <span className="font-text">{locationText}</span>
          </div>
          <div className="mt-4 text-gray-800 font-text">{dateRangeText}</div>
          <div className="mt-1 text-gray-800 font-text">{guestsText}</div>
          <div className="mt-4 text-xl font-bold font-text">{totalText}</div>
          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 font-text">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={!!submitting}
            className="mt-6 w-full rounded-lg bg-main-dark px-4 py-2 text-lg font-medium font-medium-buttons text-white hover:bg-dark-highlight disabled:opacity-60"
          >
            {submitting ? 'Confirming…' : 'Confirm booking'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
