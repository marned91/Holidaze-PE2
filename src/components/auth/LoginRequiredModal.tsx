import { Modal } from '../Common/Modal';

type LoginRequiredProps = {
  open: boolean;
  onClose: () => void;
  onGotoLogin: () => void;
  onGotoRegister: () => void;
};

export function LoginRequiredModal({
  open,
  onClose,
  onGotoLogin,
  onGotoRegister,
}: LoginRequiredProps) {
  return (
    <Modal open={open} title="Please sign in" onClose={onClose}>
      <p className="text-gray-700 text-sm font-text">
        You need to be logged in to book venues.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 font-medium-buttons">
        <button
          type="button"
          onClick={onGotoLogin}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium hover:bg-gray-50 font-medium-buttons"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onGotoRegister}
          className="w-full rounded-lg bg-main-dark px-4 py-3 font-medium text-white hover:bg-dark-highlight font-medium-buttons"
        >
          Create account
        </button>
      </div>
    </Modal>
  );
}
