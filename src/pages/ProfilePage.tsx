import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TProfile } from '../types/profiles';
import { getProfile } from '../api/profiles';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePicture';

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'U';
}

export function ProfilePage() {
  const { username = '' } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(
    function loadProfile() {
      let isActive = true;

      async function run(name: string) {
        try {
          setLoading(true);
          const data = await getProfile(name);
          if (!isActive) return;
          setProfile(data);
        } catch (error) {
          const message = (error as Error).message || 'Failed to load profile';
          setLoadError(message);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      if (!username) {
        setLoadError('Missing username in URL. Go to /profile/:username');
        setLoading(false);
        return () => {
          isActive = false;
        };
      }

      run(username);
      return () => {
        isActive = false;
      };
    },
    [username]
  );

  function handleAvatarUpdated(url: string, alt?: string) {
    setProfile((prev) => (prev ? { ...prev, avatar: { url, alt } } : prev));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow">
        {loading && <p>Loading profile…</p>}
        {loadError && <p className="text-red-600">{loadError}</p>}

        {profile && (
          <>
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                {profile.avatar?.url ? (
                  <img
                    src={profile.avatar.url}
                    alt={profile.avatar?.alt || profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-500">
                    {getInitials(profile.name)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-lg font-medium">{profile.name}</p>
                <p className="text-gray-600">{profile.email}</p>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setAvatarOpen(true)}
                    className="rounded-full bg-main-dark px-4 py-2 text-white"
                  >
                    Update profile picture
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />
            <p className="text-sm text-gray-600">
              Tabs come next (“Manage Venues” / “Your Bookings”).
            </p>
          </>
        )}
      </div>

      <UpdateProfilePicture
        username={username}
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        onUpdated={handleAvatarUpdated}
        initialUrl={profile?.avatar?.url}
        initialAlt={profile?.avatar?.alt}
      />
    </div>
  );
}
