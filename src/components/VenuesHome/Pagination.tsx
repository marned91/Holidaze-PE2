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
 * Behavior:
 * - Disables Previous on the first page and Next on the last page.
 * - Announces page changes via a polite live region ("Page X / Y").
 * - Exposes `onPrevious` / `onNext` callbacks for navigation.
 * - Uses `role="navigation"` with an accessible label.
 *
 * @param currentPage - 1-based current page index.
 * @param totalPages - Total number of pages.
 * @param onPrevious - Callback when the user requests the previous page.
 * @param onNext - Callback when the user requests the next page.
 * @param className - Optional wrapper classes.
 * @returns A navigation region with pagination controls.
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
