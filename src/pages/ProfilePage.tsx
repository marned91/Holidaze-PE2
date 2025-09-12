import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TProfile } from '../types/profiles';
import { getProfile } from '../api/profiles';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePicture';
import { ProfileTabs } from '../components/Profile/ProfileTabs';

type ProfileTab = 'manage' | 'myBookings';

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
  const [activeTab, setActiveTab] = useState<ProfileTab>('manage');

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

  useEffect(() => {
    if (!profile) return;
    setActiveTab(profile.venueManager ? 'manage' : 'myBookings');
  }, [profile]);

  function handleAvatarUpdated(url: string, alt?: string) {
    setProfile((prev) => (prev ? { ...prev, avatar: { url, alt } } : prev));
  }

  return (
    <div className="bg-light min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          {loading && <p>Loading profile…</p>}
          {loadError && <p className="text-red-600">{loadError}</p>}

          {profile && (
            <>
              <div className="flex items-center gap-6 py-6">
                <div className="h-50 w-50 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
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

                <div className="flex-1 font-text">
                  <p className="text-lg font-bold">{profile.name}</p>
                  <p className="text-gray-600">{profile.email}</p>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setAvatarOpen(true)}
                      className="rounded-lg bg-main-dark px-4 py-2 text-white cursor-pointer hover:bg-dark-highlight font-medium-buttons"
                    >
                      Update profile picture
                    </button>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />
              {profile.venueManager ? (
                <>
                  <ProfileTabs active={activeTab} onChange={setActiveTab} />
                  <div className="mt-6">
                    {activeTab === 'manage' ? (
                      <section>
                        <div className="mb-4 flex items-center justify-between">
                          <h1 className="text-3xl font-medium font-large">
                            Your Venues
                          </h1>
                          <button
                            type="button"
                            className="rounded-xl border px-4 py-2 hover:bg-gray-50 font-medium-buttons"
                          >
                            + Create venue
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          TODO: list your venues here (image, title, price per
                          night, max guests, location).
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                          Empty state: “You have no venues yet — Create venue”.
                        </p>
                      </section>
                    ) : (
                      <section>
                        <h2 className="mb-4 text-lg font-medium">
                          Upcoming bookings for your venues
                        </h2>
                        <p className="text-sm text-gray-600">
                          TODO: show booking cards (image, title, total price,
                          nights, customer name).
                        </p>
                      </section>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-2">
                  <h2 className="mb-4 text-lg font-medium">Your Bookings</h2>
                </div>
              )}
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
    </div>
  );
}
