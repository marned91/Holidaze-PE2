import { useId } from 'react';
import type { TDateRange } from '../../types/date';
import { todayYmd } from '../../utils/dateRange';

type Props = {
  value: TDateRange;
  onChange: (next: TDateRange) => void;
  className?: string;
  variant?: 'native' | 'text';
  labelFrom?: string;
  labelTo?: string;
};

function parseDotToISO(v: string): string | undefined {
  // dd.mm.yyyy
  const m = v.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return undefined;
  const d = Number(m[1]),
    mo = Number(m[2]),
    y = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (isNaN(dt.getTime()) || dt.getDate() !== d || dt.getMonth() !== mo - 1)
    return undefined;
  const mm = String(mo).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}
function formatDot(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export function DateRangeFields({
  value,
  onChange,
  className,
  variant = 'native',
  labelFrom = 'From',
  labelTo = 'To',
}: Props) {
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
              className="w-full rounded-md border bg-white border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={startId}
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDot(value.startDate)}
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
              className="w-full rounded-md border bg-white border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={endId}
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDot(value.endDate)}
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
