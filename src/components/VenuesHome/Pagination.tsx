type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  className,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div
      className={`mt-6 flex items-center justify-center gap-3 ${
        className ?? ''
      }`}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstPage}
        className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50 font-medium-buttons"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700 font-text" aria-live="polite">
        Page {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={isLastPage}
        className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50 font-medium-buttons"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
