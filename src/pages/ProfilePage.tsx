import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TProfile } from '../types/profilesType';
import { getProfile } from '../api/profilesApi';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePictureModal';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import AvatarPlaceholder from '../assets/avatar-placeholder.png';

import type { TVenue } from '../types/venueTypes';
import { getVenuesByOwner, deleteVenue } from '../api/venuesApi';

// Tabs type comes from ProfileTabs to keep it in sync with the VenueManager container
import type { ProfileTab } from '../components/Profile/ProfileTabs';

// Your container that now owns the tabs + page switching
import { VenueManager } from '../components/Profile/VenueManager/VenueManagerSection';

// Pages used by the manager container (modals still live here)
import { AddVenueModal } from '../components/Profile/VenueManager/AddVenueModal';
import { EditVenueModal } from '../components/Profile/VenueManager/EditVenueModal';

export function ProfilePage() {
  const { username = '' } = useParams<{ username: string }>();

  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [avatarOpen, setAvatarOpen] = useState(false);

  // Tabs are driven here so ProfilePage can control deep-linking later if you want
  const [activeTab, setActiveTab] = useState<ProfileTab>('myBookings');

  const [venues, setVenues] = useState<TVenue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  const [addVenueOpen, setAddVenueOpen] = useState(false);
  const [editVenueOpen, setEditVenueOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<TVenue | null>(null);

  // Load profile
  useEffect(() => {
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
  }, [username]);

  // Default tab per role
  useEffect(() => {
    if (!profile) return;
    setActiveTab(profile.venueManager ? 'addVenue' : 'myBookings');
  }, [profile]);

  function handleAvatarUpdated(url: string, alt?: string) {
    setProfile((prev) => (prev ? { ...prev, avatar: { url, alt } } : prev));
  }

  function handleVenueCreated(newVenue: TVenue) {
    setVenues((prev) => [newVenue, ...prev]);
    setAddVenueOpen(false);
  }

  // Load venues (manager only, with bookings)
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
    const ok = window.confirm(`Delete “${venue.name}”? This cannot be undone.`);
    if (!ok) return;

    try {
      await deleteVenue(venue.id);
      setVenues((prev) => prev.filter((v) => v.id !== venue.id));
      alert('Venue deleted');
    } catch (unknownError) {
      alert((unknownError as Error)?.message || 'Could not delete venue');
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
              <ProfileHeader
                profile={profile}
                onEditAvatar={() => setAvatarOpen(true)}
                placeholderSrc={AvatarPlaceholder}
              />

              {profile.venueManager ? (
                <VenueManager
                  activeTab={activeTab}
                  onChangeTab={setActiveTab}
                  venues={venues}
                  isLoadingVenues={venuesLoading}
                  venuesError={venuesError}
                  onCreateVenue={() => setAddVenueOpen(true)}
                  onEditVenue={(venue) => {
                    setSelectedVenue(venue);
                    setEditVenueOpen(true);
                  }}
                  onDeleteVenue={handleDeleteVenue}
                />
              ) : (
                // Customer view: no tabs, just "My Bookings" page (placeholder until implemented)
                <section className="mt-6" id="tab-myBookings">
                  <h2 className="mb-4 text-lg font-medium">Your Bookings</h2>
                  {/* TODO: replace with <MyBookingsSection /> */}
                </section>
              )}
            </>
          )}
        </div>

        {/* Modals live here */}
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
