export type ProfileTab = 'addVenue' | 'managerBookings' | 'myBookings';

type ProfileTabsProps = {
  active: ProfileTab;
  onChange: (next: ProfileTab) => void;
  isManager: boolean;
};

export function ProfileTabs({ active, onChange, isManager }: ProfileTabsProps) {
  if (!isManager) return null;

  const base =
    'font-medium-buttons font-medium cursor-pointer hover:text-black';
  const activeCls = 'text-gray-900 border-b-2 border-gray-900';
  const idleCls = 'text-gray-600 hover:text-gray-800';

  return (
    <div
      className="flex flex-wrap items-end justify-center sm:justify-start gap-x-6 gap-y-2 py-1 font-medium-buttons"
      role="tablist"
      aria-label="Profile tabs"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === 'addVenue'}
        aria-controls="tab-addVenue"
        onClick={() => onChange('addVenue')}
        className={`${base} ${active === 'addVenue' ? activeCls : idleCls}`}
      >
        My Venues
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={active === 'managerBookings'}
        aria-controls="tab-managerBookings"
        onClick={() => onChange('managerBookings')}
        className={`${base} ${
          active === 'managerBookings' ? activeCls : idleCls
        }`}
      >
        Bookings for your venues
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={active === 'myBookings'}
        aria-controls="tab-myBookings"
        onClick={() => onChange('myBookings')}
        className={`${base} ${active === 'myBookings' ? activeCls : idleCls}`}
      >
        My Bookings
      </button>
    </div>
  );
}
