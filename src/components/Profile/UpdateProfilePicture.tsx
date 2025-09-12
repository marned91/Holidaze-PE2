import { useEffect, useState } from 'react';
import { Modal } from '../Common/Modal';
import { setProfilePicture } from '../../api/profiles';

type UpdateProfilePictureProps = {
  username: string;
  open: boolean;
  onClose: () => void;
  onUpdated: (url: string, alt?: string) => void;
  initialUrl?: string;
  initialAlt?: string;
};

export function UpdateProfilePicture({
  username,
  open,
  onClose,
  onUpdated,
  initialUrl,
  initialAlt,
}: UpdateProfilePictureProps) {
  const [url, setUrl] = useState(initialUrl || '');
  const [alt, setAlt] = useState(initialAlt || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    function syncDefaults() {
      if (open) {
        setUrl(initialUrl || '');
        setAlt(initialAlt || '');
        setError(null);
      }
    },
    [open, initialUrl, initialAlt]
  );

  function handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
  }

  function handleAltChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAlt(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    const trimmedAlt = alt.trim();

    if (!trimmedUrl) {
      setError('URL is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await setProfilePicture(
        username,
        trimmedUrl,
        trimmedAlt || undefined
      );

      const nextUrl = data.avatar?.url || trimmedUrl;
      const nextAlt = data.avatar?.alt || trimmedAlt || undefined;

      onUpdated(nextUrl, nextAlt);
      alert('Profile picture updated');
      onClose();
    } catch (error) {
      const message = (error as Error)?.message || 'Something went wrong';
      setError(message);
      alert('Could not update profile picture, please try again');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Update profile picture"
      ariaLabel="Update profile picture"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium font-text">
            Image URL
          </label>
          <input
            type="url"
            inputMode="url"
            placeholder="https://..."
            value={url}
            onChange={handleUrlChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight font-text"
            aria-invalid={!!error && !url.trim()}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium font-text">
            Alt text (optional)
          </label>
          <input
            type="text"
            value={alt}
            onChange={handleAltChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight font-text"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium-buttons"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-main-dark px-5 py-2 text-white disabled:opacity-60 hover:bg-dark-highlight cursor-pointer font-medium-buttons"
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
