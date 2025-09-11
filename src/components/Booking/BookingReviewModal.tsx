import { Modal } from '../common/Modal';
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="aspect-[4/3] w-full" />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-small-nav-footer">{venueTitle}</h3>

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
            className="mt-6 w-full rounded-2xl bg-main-dark px-4 py-3 text-lg font-medium font-medium-buttons text-white hover:bg-dark-highlight disabled:opacity-60"
          >
            {submitting ? 'Confirming…' : 'Confirm booking'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
