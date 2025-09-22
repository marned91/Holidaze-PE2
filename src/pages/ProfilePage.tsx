import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { TProfile } from '../types/profileTypes';
import { getProfile } from '../api/profilesApi';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePictureModal';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import AvatarPlaceholder from '../assets/avatar-placeholder.png';
import type { TVenue } from '../types/venueTypes';
import { getVenuesByOwner, deleteVenue } from '../api/venuesApi';
import type { ProfileTab } from '../components/Profile/VenueManager/VenueManagerProfileTabs';
import { VenueManager } from '../components/Profile/VenueManager/VenueManagerSection';
import { MyBookingsSection } from '../components/Profile/MyBookingsSection';
import { getBookingsByProfile, cancelBooking } from '../api/bookingsApi';
import type { TBooking } from '../types/bookingTypes';
import type { TBookingWithVenue } from '../types/bookingTypes';
import { AddVenueModal } from '../components/Profile/VenueManager/AddVenueModal';
import { EditVenueModal } from '../components/Profile/VenueManager/EditVenueModal';
import { ConfirmProvider } from '../components/Common/ConfirmProvider';
import { useAlerts } from '../hooks/useAlerts';
import { useConfirm } from '../hooks/useConfirm';

/**
 * Route-level wrapper that provides confirm dialog context only for this page.
 */
export function ProfilePage() {
  return (
    <ConfirmProvider>
      <ProfilePageInner />
    </ConfirmProvider>
  );
}

/**
 * Profile page that loads and displays the user's profile, venues, and bookings.
 *
 * @remarks
 * - Shows the Venue Manager UI when `profile.venueManager` is true; otherwise renders "My Bookings".
 * - Adds `role="status"` for loading messages and `role="alert"` for error messages.
 * - No functional or styling changes were made.
 */
function ProfilePageInner() {
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
  const { showSuccessAlert, showErrorAlert, showInformationAlert } =
    useAlerts();
  const confirm = useConfirm();

  useEffect(() => {
    let isActive = true;

    async function loadProfile(name: string) {
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

    loadProfile(username);
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

    async function loadVenues() {
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

    loadVenues();
    return () => {
      isActive = false;
    };
  }, [profile, username]);

  useEffect(() => {
    let isActive = true;

    async function loadMyBookings() {
      if (!profile?.name) return;
      try {
        setMyBookingsLoading(true);
        setMyBookingsError(null);
        const bookings = await getBookingsByProfile(profile.name, {
          withVenue: true,
        });
        if (!isActive) return;
        setMyBookings(bookings);
      } catch (error) {
        if (isActive)
          setMyBookingsError(
            (error as Error).message || 'Failed to load bookings'
          );
      } finally {
        if (isActive) setMyBookingsLoading(false);
      }
    }

    loadMyBookings();
    return () => {
      isActive = false;
    };
  }, [profile?.name]);

  /**
   * Asks for confirmation and deletes a venue. Shows success or error alerts and updates local state.
   */
  async function handleDeleteVenue(venue: TVenue) {
    const userAccepted = await confirm({
      title: 'Delete venue?',
      message: `Delete “${venue.name}”? This action cannot be undone.`,
      confirmLabel: 'Delete venue',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });
    if (!userAccepted) {
      showInformationAlert('Cancelled');
      return;
    }

    try {
      await deleteVenue(venue.id);
      setVenues((previous) => previous.filter((item) => item.id !== venue.id));
      showSuccessAlert('Venue deleted');
    } catch (error) {
      const message = (error as Error)?.message || 'Could not delete venue';
      showErrorAlert(message);
    }
  }

  /**
   * Asks for confirmation and cancels a booking. Shows success or error alerts and updates local state.
   */
  async function handleCancelMyBooking(booking: TBooking, venue: TVenue) {
    const userAccepted = await confirm({
      title: 'Cancel booking?',
      message: `Cancel your booking at “${venue.name}”?`,
      confirmLabel: 'Cancel booking',
      cancelLabel: 'Keep booking',
      variant: 'danger',
    });
    if (!userAccepted) {
      showInformationAlert('Cancelled');
      return;
    }

    try {
      await cancelBooking(booking.id);
      setMyBookings((previous) =>
        previous.filter((item) => item.id !== booking.id)
      );
      showSuccessAlert('Booking cancelled');
    } catch (error) {
      const message = (error as Error)?.message || 'Could not cancel booking';
      showErrorAlert(message);
    }
  }

  return (
    <div className="bg-light min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-[85%] px-4 py-10">
        <div className="rounded-xl bg-white p-5 md:p-10 shadow-xl font-text">
          {loading && <p role="status">Loading profile…</p>}
          {loadError && (
            <p className="text-red-600" role="alert">
              {loadError}
            </p>
          )}
          {profile && (
            <>
              <ProfileHeader
                profile={profile}
                onEditAvatar={() => setAvatarOpen(true)}
                placeholderSrc={AvatarPlaceholder}
              />
              <hr className="my-6 border-gray-400" />
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
                  onCancelMyBooking={handleCancelMyBooking}
                />
              ) : (
                <section className="mt-6" id="tab-myBookings">
                  <MyBookingsSection
                    bookings={myBookings}
                    isLoading={myBookingsLoading}
                    errorMessage={myBookingsError}
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
