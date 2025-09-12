type ProfileTab = 'manage' | 'myBookings';

type ProfileTabsProps = {
  active: ProfileTab;
  onChange: (next: ProfileTab) => void;
};

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200">
      <button
        type="button"
        onClick={() => onChange('manage')}
        className={`pb-2 text-md font-medium font-small-nav-footer ${
          active === 'manage'
            ? 'text-gray-900 border-b-2 border-gray-900'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        aria-current={active === 'manage' ? 'page' : undefined}
      >
        Manage Venues
      </button>

      <button
        type="button"
        onClick={() => onChange('myBookings')}
        className={`pb-2 text-md font-medium font-small-nav-footer ${
          active === 'myBookings'
            ? 'text-gray-900 border-b-2 border-gray-900'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        aria-current={active === 'myBookings' ? 'page' : undefined}
      >
        My Bookings
      </button>
    </div>
  );
}
