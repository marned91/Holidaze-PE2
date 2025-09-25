import type { TProfile } from '../../types/profileTypes';

type ProfileHeaderProps = {
  profile: TProfile;
  onEditAvatar: () => void;
  className?: string;
  placeholderSrc?: string;
};

/**
 * Displays the profile's avatar, name, and email with a button to update the picture.
 *
 * @param profile - Profile object with name, email, and optional avatar.
 * @param onEditAvatar - Callback when the user clicks "Update profile picture".
 * @param className - Additional classes for the wrapper.
 * @param placeholderSrc - Fallback image when the profile has no avatar.
 */

export function ProfileHeader({
  profile,
  onEditAvatar,
  className,
  placeholderSrc = '/images/avatar-placeholder.png',
}: ProfileHeaderProps) {
  const avatarUrl = profile.avatar?.url || placeholderSrc;
  const avatarAlt = profile.avatar?.alt || profile.name || 'User avatar';

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center gap-6 mb-3  py-5 md:py-10 px-5 ${
        className ?? ''
      }`}
    >
      <div className="h-70 w-full md:w-70 shrink-0 overflow-hidden rounded-lg md:rounded-full border border-gray-400 bg-gray-100">
        <img
          src={avatarUrl}
          alt={avatarAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 font-text">
        <p className="text-lg font-bold">{profile.name}</p>
        <p className="text-gray-600">{profile.email}</p>
        <div className="mt-3">
          <button
            type="button"
            onClick={onEditAvatar}
            className="rounded-lg bg-main-dark px-4 py-2 text-white cursor-pointer hover:bg-dark-highlight font-medium-buttons mt-2"
          >
            Update profile picture
          </button>
        </div>
      </div>
    </div>
  );
}
