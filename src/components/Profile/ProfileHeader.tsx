import type { TProfile } from '../../types/profilesType';

type ProfileHeaderProps = {
  profile: TProfile;
  onEditAvatar: () => void;
  className?: string;
  placeholderSrc?: string;
};

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
      className={`flex flex-col md:flex-row md:items-center gap-6 p-6" ${
        className || ''
      }`}
    >
      <div className="h-60 w-full md:w-60 shrink-0 overflow-hidden rounded-lg md:rounded-full border border-gray-200 bg-gray-100">
        <img
          src={avatarUrl}
          alt={avatarAlt}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 font-text">
        <p className="text-lg font-bold">{profile.name}</p>
        <p className="text-gray-600">{profile.email}</p>

        <div className="mt-3">
          <button
            type="button"
            onClick={onEditAvatar}
            className="rounded-lg bg-highlight px-4 py-2 text-white cursor-pointer hover:bg-main-dark font-medium-buttons"
          >
            Update profile picture
          </button>
        </div>
      </div>
    </div>
  );
}
