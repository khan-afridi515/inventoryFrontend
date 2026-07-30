import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Builds a compact page-number list with ellipsis for large page counts,
 * e.g. [1, '…', 4, 5, 6, '…', 46] instead of listing all 46 pages.
 */
function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  let prev = null;
  for (const page of sorted) {
    if (prev !== null && page - prev > 1) result.push('…');
    result.push(page);
    prev = page;
  }
  return result;
}

/**
 * @param {{
 *   currentPage: number,
 *   totalPages: number,
 *   startIndex: number,
 *   endIndex: number,
 *   totalItems: number,
 *   pageSize: number,
 *   onPageChange: (page: number) => void,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   onPageSizeChange: (size: number) => void,
 * }} props
 */
export function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  pageSize,
  onPageChange,
  onPrevious,
  onNext,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span>
          Showing <span className="font-medium text-text">{startIndex + 1}</span>–
          <span className="font-medium text-text">{endIndex}</span> of{' '}
          <span className="font-medium text-text">{totalItems}</span>
        </span>

        <label className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} />
        </button>

        {pageNumbers.map((page, i) =>
          page === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-muted">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-bg'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={15} />
        </button>
      </nav>
    </div>
  );
}
