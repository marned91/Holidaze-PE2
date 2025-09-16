import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TProfile } from '../types/profiles';
import { getProfile } from '../api/profilesApi';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePictureModal';
import { ProfileTabs } from '../components/Profile/ProfileTabs';
import type { TVenue } from '../types/venues';
import { getVenuesByOwner, deleteVenue } from '../api/venuesApi';
import { VenueManagerSection } from '../components/Profile/VenueManager/VenueManagerSection';
import { ManagerUpcomingBookingsSection } from '../components/Profile/VenueManager/ManageUpcomingBookingsSection';
import { AddVenueModal } from '../components/Profile/VenueManager/AddVenueModal';
import { EditVenueModal } from '../components/Profile/VenueManager/EditVenueModal';

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

  const [editVenueOpen, setEditVenueOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<TVenue | null>(null);

  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);

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

  const [addVenueOpen, setAddVenueOpen] = useState(false);

  function handleVenueCreated(newVenue: TVenue) {
    setVenues((prev) => [newVenue, ...prev]);
    setAddVenueOpen(false);
  }

  const [venues, setVenues] = useState<TVenue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    async function run() {
      if (!profile?.venueManager || !profile?.name) return;
      try {
        setVenuesLoading(true);
        setVenuesError(null);
        const list = await getVenuesByOwner(username, { withBookings: true });
        if (isActive) setVenues(list);
      } catch (error) {
        if (isActive)
          setVenuesError((error as Error)?.message || 'Failed to load venues');
      } finally {
        if (isActive) setVenuesLoading(false);
      }
    }
    run();
    return () => {
      isActive = false;
    };
  }, [profile, username]);

  async function handleDeleteVenue(venue: TVenue) {
    if (deletingVenueId) return;
    const ok = window.confirm(`Delete “${venue.name}”? This cannot be undone.`);
    if (!ok) return;

    try {
      setDeletingVenueId(venue.id);
      await deleteVenue(venue.id);
      setVenues((prev) => prev.filter((v) => v.id !== venue.id));
      alert('Venue deleted');
    } catch (unknownError) {
      alert((unknownError as Error)?.message || 'Could not delete venue');
    } finally {
      setDeletingVenueId(null);
    }
  }

  return (
    <div className="bg-light min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-[85%] px-4 py-10">
        <div className="rounded-2xl bg-white p-10 shadow-xl">
          {loading && <p>Loading profile…</p>}
          {loadError && <p className="text-red-600">{loadError}</p>}

          {profile && (
            <>
              <div className="flex items-center gap-6 p-6">
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
                      className="rounded-lg bg-highlight px-4 py-2 text-white cursor-pointer hover:bg-main-dark font-medium-buttons"
                    >
                      Update profile picture
                    </button>
                  </div>
                </div>
              </div>
              <ProfileTabs active={activeTab} onChange={setActiveTab} />
              <hr className="my-6 border-gray-200" />
              {activeTab === 'manage' ? (
                <>
                  <VenueManagerSection
                    venues={venues}
                    isLoading={venuesLoading}
                    errorMessage={venuesError}
                    onCreateVenue={() => setAddVenueOpen(true)}
                    onEditVenue={(venue) => {
                      setSelectedVenue(venue);
                      setEditVenueOpen(true);
                    }}
                    onDeleteVenue={handleDeleteVenue}
                  />
                  <hr className="my-8 border-gray-200" />
                  <ManagerUpcomingBookingsSection
                    venues={venues}
                    isLoading={venuesLoading}
                    errorMessage={venuesError}
                  />
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

        <AddVenueModal
          open={addVenueOpen}
          onClose={() => setAddVenueOpen(false)}
          onCreated={handleVenueCreated}
        />
        {selectedVenue && (
          <EditVenueModal
            open={editVenueOpen}
            onClose={() => {
              setEditVenueOpen(false);
              setSelectedVenue(null);
            }}
            venue={selectedVenue}
            profileName={profile?.name || username}
            onUpdated={(updated) => {
              setVenues((prev) =>
                prev.map((v) => (v.id === updated.id ? updated : v))
              );
              setEditVenueOpen(false);
              setSelectedVenue(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
