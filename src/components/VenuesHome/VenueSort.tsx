export type SortOrder = 'newest' | 'oldest' | 'priceLow' | 'priceHigh';

type VenueSortProps = {
  sortOrder: SortOrder;
  onChange: (nextSortOrder: SortOrder) => void;
  disabled?: boolean;
};

/**
 * Sort selector for venues.
 *
 * Behavior:
 * - Binds a labeled `<select>` to control the current sort order.
 * - Calls `onChange` with the chosen sort key.
 * - Reflects the disabled state both visually and via `aria-disabled`.
 *
 * @param sortOrder - Current sort order key.
 * @param onChange - Callback with the next sort order.
 * @param disabled - Whether the control is disabled (default false).
 * @returns A labeled select element for choosing venue sort order.
 */
export function VenueSort({ sortOrder, onChange, disabled = false }: VenueSortProps) {
  const selectId = 'venue-sort';

  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-700 pt-5 md:pt-0">
      <label htmlFor={selectId}>Sort by:</label>
      <select
        id={selectId}
        value={sortOrder}
        onChange={(event) => onChange(event.target.value as SortOrder)}
        disabled={disabled}
        aria-disabled={disabled}
        className="rounded-md border border-gray-400 bg-white px-2 py-1 text-sm"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priceLow">Price: low to high</option>
        <option value="priceHigh">Price: high to low</option>
      </select>
    </div>
  );
}
