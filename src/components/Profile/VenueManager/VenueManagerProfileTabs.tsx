export type ProfileTab = 'addVenue' | 'managerBookings' | 'myBookings';

type ProfileTabsProps = {
  active: ProfileTab;
  onChange: (next: ProfileTab) => void;
  isManager: boolean;
};

/**
 * Tab strip for venue manager actions (create venue, view venue bookings, own bookings).
 *
 * @remarks
 * - Exposes WAI-ARIA roles: `tablist` and `tab`.
 * - Each tab has an `id` so corresponding tabpanels can reference it via `aria-labelledby`.
 * - No behavioral changes (click handlers and selected logic are unchanged).
 */
export function ProfileTabs({ active, onChange, isManager }: ProfileTabsProps) {
  if (!isManager) return null;

  const tabBaseClass =
    'font-medium-buttons font-medium cursor-pointer hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400';
  const tabActiveClass = 'text-gray-900 border-b-2 border-gray-400';
  const tabIdleClass = 'text-gray-600 hover:text-gray-800';

  return (
    <div
      className="flex flex-wrap items-end justify-center md:justify-start gap-x-6 gap-y-2 py-1 font-medium-buttons"
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
        className={`${tabBaseClass} ${
          active === 'addVenue' ? tabActiveClass : tabIdleClass
        }`}
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
        className={`${tabBaseClass} ${
          active === 'myBookings' ? tabActiveClass : tabIdleClass
        }`}
      >
        My Bookings
      </button>
    </div>
  );
}
