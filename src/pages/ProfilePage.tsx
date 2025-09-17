import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TProfile } from '../types/profilesType';
import { getProfile } from '../api/profilesApi';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePictureModal';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import AvatarPlaceholder from '../assets/avatar-placeholder.png';
import type { TVenue } from '../types/venueTypes';
import { getVenuesByOwner, deleteVenue } from '../api/venuesApi';
import type { ProfileTab } from '../components/Profile/ProfileTabs';
import { VenueManager } from '../components/Profile/VenueManager/VenueManagerSection';
import { MyBookingsSection } from '../components/Profile/MyBookingsSection';
import { getBookingsByProfile, cancelBooking } from '../api/bookingsApi';
import type { TBooking } from '../types/bookingType';
import type { TBookingWithVenue } from '../types/bookingType';
import { AddVenueModal } from '../components/Profile/VenueManager/AddVenueModal';
import { EditVenueModal } from '../components/Profile/VenueManager/EditVenueModal';

export function ProfilePage() {
  const { username = '' } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('myBookings');
  const [venues, setVenues] = useState<TVenue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  const [myBookings, setMyBookings] = useState<TBookingWithVenue[]>([]);
  const [myBookingsLoading, setMyBookingsLoading] = useState(false);
  const [myBookingsError, setMyBookingsError] = useState<string | null>(null);
  const [addVenueOpen, setAddVenueOpen] = useState(false);
  const [editVenueOpen, setEditVenueOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<TVenue | null>(null);

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

  useEffect(() => {
    let isActive = true;
    async function run() {
      if (!profile?.name) return;
      try {
        setMyBookingsLoading(true);
        setMyBookingsError(null);
        const rows = await getBookingsByProfile(profile.name, {
          withVenue: true,
        });
        if (!isActive) return;
        setMyBookings(rows);
      } catch (e) {
        if (isActive)
          setMyBookingsError((e as Error).message || 'Failed to load bookings');
      } finally {
        if (isActive) setMyBookingsLoading(false);
      }
    }
    run();
    return () => {
      isActive = false;
    };
  }, [profile?.name]);

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

  // (Valgfritt) koble actions for my bookings – her gjør vi bare simple alerts/oppdatering
  function handleEditMyBooking(booking: TBooking, venue: TVenue) {
    alert(`Edit booking ${booking.id} at ${venue.name}`);
  }

  async function handleCancelMyBooking(booking: TBooking, venue: TVenue) {
    const ok = window.confirm(`Cancel booking at “${venue.name}”?`);
    if (!ok) return;
    try {
      await cancelBooking(booking.id);
      setMyBookings((prev) => prev.filter((b) => b.id !== booking.id));
      alert('Booking cancelled');
    } catch (e) {
      alert((e as Error).message || 'Could not cancel booking');
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
                  myBookings={myBookings}
                  isLoadingMyBookings={myBookingsLoading}
                  myBookingsError={myBookingsError}
                  onEditMyBooking={handleEditMyBooking}
                  onCancelMyBooking={handleCancelMyBooking}
                />
              ) : (
                <section className="mt-6" id="tab-myBookings">
                  <MyBookingsSection
                    bookings={myBookings}
                    isLoading={myBookingsLoading}
                    errorMessage={myBookingsError}
                    onEditBooking={handleEditMyBooking}
                    onCancelBooking={handleCancelMyBooking}
                  />
                </section>
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
