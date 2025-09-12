import { useId } from 'react';
import type { TDateRange } from '../../types/date';
import { todayYmd, parseDotToISO, formatDotFromISO } from '../../utils/date';

type DateRangeFieldsProps = {
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
}: DateRangeFieldsProps) {
  const startInputId = useId();
  const endInputId = useId();

  const today = todayYmd();
  const startMin = today;
  const endMin = value.startDate ?? today;
  const startMax = value.endDate ?? undefined;

  return (
    <div className={className ?? ''}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={startInputId}
            className="mb-1 block text-sm text-gray-700"
          >
            {labelFrom}
          </label>

          {variant === 'native' ? (
            <input
              id={startInputId}
              name="startDate"
              type="date"
              value={value.startDate ?? ''}
              min={startMin}
              max={startMax}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: event.target.value || undefined,
                })
              }
              className="w-full rounded-md border bg-gray-100 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={startInputId}
              name="startDate"
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDotFromISO(value.startDate)}
              onChange={(event) =>
                onChange({
                  ...value,
                  startDate: parseDotToISO(event.target.value),
                })
              }
              // Optional: let the browser show a hint for the expected format
              pattern="^\d{1,2}\.\d{1,2}\.\d{4}$"
              title="Use format dd.mm.yyyy"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          )}
        </div>

        <div>
          <label
            htmlFor={endInputId}
            className="mb-1 block text-sm text-gray-700"
          >
            {labelTo}
          </label>

          {variant === 'native' ? (
            <input
              id={endInputId}
              name="endDate"
              type="date"
              value={value.endDate ?? ''}
              min={endMin}
              onChange={(event) =>
                onChange({ ...value, endDate: event.target.value || undefined })
              }
              className="w-full rounded-md border bg-gray-100 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          ) : (
            <input
              id={endInputId}
              name="endDate"
              type="text"
              inputMode="numeric"
              placeholder="dd.mm.yyyy"
              value={formatDotFromISO(value.endDate)}
              onChange={(event) =>
                onChange({
                  ...value,
                  endDate: parseDotToISO(event.target.value),
                })
              }
              pattern="^\d{1,2}\.\d{1,2}\.\d{4}$"
              title="Use format dd.mm.yyyy"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-highlight"
            />
          )}
        </div>
      </div>
    </div>
  );
}
