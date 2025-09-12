import { useId } from 'react';
import type { TDateRange } from '../../types/date';
import { todayYmd } from '../../utils/dateRange';
import { parseDotToISO, formatDotFromISO } from '../../utils/date';

type props = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  className?: string;
  variant?: 'native' | 'text';
  labelFrom?: string;
  labelTo?: string;
};

export function DateRangeFields({
  value,
  onChange,
  className,
  variant = 'native',
  labelFrom = 'From',
  labelTo = 'To',
}: props) {
  const startId = useId();
  const endId = useId();

  const today = todayYmd();
  const startMin = today;
  const endMin = value.startDate || today;

  return (
    <div className={className ?? ''}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={startId} className="mb-1 block text-sm text-gray-700">
            {labelFrom}
          </label>
          {variant === 'native' ? (
            <input
              id={startId}
              type="date"
              value={value.startDate ?? ''}
              min={startMin}
              onChange={(e) =>
                onChange({ ...value, startDate: e.target.value || undefined })
              }
              className="w-full rounded-md border bg-gray-100 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={startId}
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDotFromISO(value.startDate)}
              onChange={(e) =>
                onChange({ ...value, startDate: parseDotToISO(e.target.value) })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          )}
        </div>

        <div>
          <label htmlFor={endId} className="mb-1 block text-sm text-gray-700">
            {labelTo}
          </label>
          {variant === 'native' ? (
            <input
              id={endId}
              type="date"
              value={value.endDate ?? ''}
              min={endMin}
              onChange={(e) =>
                onChange({ ...value, endDate: e.target.value || undefined })
              }
              className="w-full rounded-md border bg-gray-100 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={endId}
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDotFromISO(value.endDate)}
              onChange={(e) =>
                onChange({ ...value, endDate: parseDotToISO(e.target.value) })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          )}
        </div>
      </div>
    </div>
  );
}
