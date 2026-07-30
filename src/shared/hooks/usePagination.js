import { useMemo, useState } from 'react';

/**
 * Generic client-side pagination over an already-filtered/sorted array.
 * Deliberately knows nothing about "sales" or any specific feature —
 * any table or list in the app can use this the same way.
 *
 * Callers are responsible for resetting to page 1 when the underlying
 * item set changes for reasons other than pagination itself (e.g. a
 * new search term) — this hook only clamps the page if it's now out
 * of range, it doesn't guess when a "fresh" reset is warranted.
 *
 * @param {Array} items - the full, already-filtered list
 * @param {number} initialPageSize
 */
export function usePagination(items, initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  // Clamp rather than let currentPage point past the end (e.g. right
  // after a search shrinks the result set while on page 5).
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages));
  const nextPage = () => goToPage(safePage + 1);
  const prevPage = () => goToPage(safePage - 1);
  const resetToFirstPage = () => setCurrentPage(1);

  const changePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1); // a different page size invalidates the old page position
  };

  return {
    currentPage: safePage,
    totalPages,
    pageSize,
    totalItems,
    startIndex,
    endIndex,
    pageItems,
    goToPage,
    nextPage,
    prevPage,
    resetToFirstPage,
    changePageSize,
  };
}
