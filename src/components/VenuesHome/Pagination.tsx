type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
};

/**
 * Pagination control with Previous/Next buttons and a live page status.
 *
 * @remarks
 * - Wrapper uses `role="navigation"` with an accessible label.
 * - The status text is a polite live region so screen readers announce page changes.
 * - No behavioral changes; only a11y attributes and JSDoc were added.
 */
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
      role="navigation"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstPage}
        aria-disabled={isFirstPage}
        className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50 font-medium-buttons focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
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
        aria-disabled={isLastPage}
        className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-50 font-medium-buttons focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
