export type ProfileTab = 'addVenue' | 'managerBookings' | 'myBookings';

type ProfileTabsProps = {
  active: ProfileTab;
  onChange: (next: ProfileTab) => void;
  isManager: boolean;
};

/**
 * Tab strip for venue-manager sections (create/manage venues, venue bookings, own bookings).
 *
 * Behavior:
 * - Renders nothing when `isManager` is false.
 * - Applies WAI-ARIA roles (`tablist`, `tab`) and wires tabs to panels via `aria-controls`.
 * - Indicates the active tab with `aria-selected` and visual styles.
 * - Calls `onChange` with the selected tab key.
 *
 * @param active - Currently selected tab key.
 * @param onChange - Callback invoked with the next tab key when a tab is clicked.
 * @param isManager - Whether the current user is a venue manager (gates visibility).
 * @returns A tablist element with three tabs, or null if `isManager` is false.
 */
export function ProfileTabs({ active, onChange, isManager }: ProfileTabsProps) {
  if (!isManager) return null;

  const tabBaseClass =
    'font-medium-buttons font-medium cursor-pointer hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400';
  const tabActiveClass = 'text-gray-900 border-b-2 border-gray-600';
  const tabIdleClass = 'text-gray-600 hover:text-gray-800';

  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-2 py-1 font-medium-buttons"
      role="tablist"
      aria-label="Profile tabs"
    >
      <button
        id="tab-addVenue-button"
        type="button"
        role="tab"
        aria-selected={active === 'addVenue'}
        aria-controls="tab-addVenue"
        onClick={() => onChange('addVenue')}
        className={`${tabBaseClass} ${active === 'addVenue' ? tabActiveClass : tabIdleClass}`}
      >
        My Venues
      </button>

      <button
        id="tab-managerBookings-button"
        type="button"
        role="tab"
        aria-selected={active === 'managerBookings'}
        aria-controls="tab-managerBookings"
        onClick={() => onChange('managerBookings')}
        className={`${tabBaseClass} ${
          active === 'managerBookings' ? tabActiveClass : tabIdleClass
        }`}
      >
        Bookings for my venues
      </button>

      <button
        id="tab-myBookings-button"
        type="button"
        role="tab"
        aria-selected={active === 'myBookings'}
        aria-controls="tab-myBookings"
        onClick={() => onChange('myBookings')}
        className={`${tabBaseClass} ${active === 'myBookings' ? tabActiveClass : tabIdleClass}`}
      >
        My Bookings
      </button>
    </div>
  );
}
