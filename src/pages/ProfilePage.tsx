import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../components/Profile/hooks/useProfile';
import { useVenueManagerVenues } from '../components/Profile/hooks/useVenueManagerVenues';
import { useMyBookings } from '../components/Profile/hooks/useMyBookings';
import { UpdateProfilePicture } from '../components/Profile/UpdateProfilePictureModal';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import AvatarPlaceholder from '../assets/avatar-placeholder.png';
import type { TVenue } from '../types/venueTypes';
import { deleteVenue } from '../api/venuesApi';
import type { ProfileTab } from '../components/Profile/VenueManager/VenueManagerProfileTabs';
import { VenueManager } from '../components/Profile/VenueManager/VenueManagerSection';
import { MyBookingsSection } from '../components/Profile/MyBookingsSection';
import { cancelBooking } from '../api/bookingsApi';
import type { TBooking } from '../types/bookingTypes';
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
 * Shows the Venue Manager UI when profile.venueManager is true; otherwise renders "My Bookings".
 */
function ProfilePageInner() {
  const { username = '' } = useParams<{ username: string }>();

  const {
    profile,
    loading,
    error,
    reload: reloadProfile,
  } = useProfile(username);

  const {
    venues,
    loading: venuesLoading,
    error: venuesError,
    reload: reloadVenues,
    removeVenueLocally,
    replaceVenueLocally,
  } = useVenueManagerVenues(profile?.name, profile?.venueManager === true);

  const {
    bookings: myBookings,
    loading: myBookingsLoading,
    error: myBookingsError,
    reload: reloadMyBookings,
    removeBookingLocally,
  } = useMyBookings(profile?.name);

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('myBookings');
  const [addVenueOpen, setAddVenueOpen] = useState(false);
  const [editVenueOpen, setEditVenueOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<TVenue | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<{
    url: string;
    alt?: string;
  } | null>(null);

  const displayProfile = profile
    ? avatarPreview
      ? {
          ...profile,
          avatar: { url: avatarPreview.url, alt: avatarPreview.alt },
        }
      : profile
    : null;

  const { showSuccessAlert, showErrorAlert, showInformationAlert } =
    useAlerts();
  const confirm = useConfirm();

  useEffect(() => {
    if (!profile) return;
    setActiveTab(profile.venueManager ? 'addVenue' : 'myBookings');
  }, [profile]);

  function handleAvatarUpdated(url: string, alt?: string) {
    setAvatarOpen(false);
    setAvatarPreview({ url, alt });
    reloadProfile();
  }

  function handleVenueCreated(_newVenue: TVenue) {
    setAddVenueOpen(false);
    reloadVenues();
  }

  /**
   * Asks for confirmation and deletes a venue. Shows success or error alerts.
   * Applies an optimistic local update and then refreshes from the server.
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
      removeVenueLocally(venue.id);
      await deleteVenue(venue.id);
      showSuccessAlert('Venue deleted');
      reloadVenues();
    } catch (error) {
      reloadVenues();
      const message = (error as Error)?.message || 'Could not delete venue';
      showErrorAlert(message);
    }
  }

  /**
   * Asks for confirmation and cancels a booking. Shows success or error alerts.
   * Applies an optimistic local update and then refreshes from the server.
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
      removeBookingLocally(booking.id);
      await cancelBooking(booking.id);
      showSuccessAlert('Booking cancelled');
      reloadMyBookings();
    } catch (error) {
      reloadMyBookings();
      const message = (error as Error)?.message || 'Could not cancel booking';
      showErrorAlert(message);
    }
  }

  return (
    <div className="bg-light min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-[85%] px-4 py-10">
        <div className="rounded-xl bg-white p-5 md:p-10 shadow-xl font-text">
          {loading && <p role="status">Loading profile…</p>}
          {error && (
            <p className="text-red-600" role="alert">
              {error}
            </p>
          )}
          {displayProfile && (
            <>
              <ProfileHeader
                profile={displayProfile}
                onEditAvatar={() => setAvatarOpen(true)}
                placeholderSrc={AvatarPlaceholder}
              />
              <hr className="my-6 border-gray-400" />
              {displayProfile.venueManager ? (
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
            onUpdated={(updatedVenue) => {
              replaceVenueLocally(updatedVenue);
              reloadVenues();
              setEditVenueOpen(false);
              setSelectedVenue(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
