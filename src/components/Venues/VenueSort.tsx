type SortOrder = 'newest' | 'oldest' | 'priceLow' | 'priceHigh';

type VenuesSortProps = {
  sortOrder: SortOrder;
  onChange: (nextSortOrder: SortOrder) => void;
  disabled?: boolean;
};

export function VenueSort({
  sortOrder,
  onChange,
  disabled = false,
}: VenuesSortProps) {
  return (
    <label className="text-sm text-gray-700 inline-flex items-center gap-2">
      Sort by:
      <select
        value={sortOrder}
        onChange={(event) => onChange(event.target.value as SortOrder)}
        disabled={disabled}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm disabled:opacity-50"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priceLow">Price: low to high</option>
        <option value="priceHigh">Price: high to low</option>
      </select>
    </label>
  );
}
