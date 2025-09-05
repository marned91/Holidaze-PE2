import { useMemo, useState } from 'react';

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

type VenuesFiltersProps = {
  cities: string[];
  selectedCity: string | null;
  onCityChange: (nextCity: string | null) => void;

  minGuests: number | null;
  onMinGuestsChange: (nextMinGuests: number | null) => void;

  dateRange: DateRange;
  onDateRangeChange: (nextDateRange: DateRange) => void;
};

export function VenuesFilters({
  cities,
  selectedCity,
  onCityChange,
  minGuests,
  onMinGuestsChange,
  dateRange,
  onDateRangeChange,
}: VenuesFiltersProps) {
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isDatesOpen, setIsDatesOpen] = useState(false);

  const;
}
