// Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems = null, // optional (for "Showing x-y of z")
  compact = false, // optional, smaller UI when true
}) => {
  if (totalPages < 1) {
    return (
      <div className="flex justify-center items-center py-4 text-gray-500 text-sm">
        No records to display.
      </div>
    );
  }

  // builds pages array with ellipses
  const buildPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("start-ellipsis");
    }
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("end-ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = buildPages();

  const firstItemIndex = (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(totalItems ?? currentPage * pageSize, (currentPage - 1) * pageSize + pageSize);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white border border-gray-100 rounded-md`}>
      {/* left: rows per page + range */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {[5, 10, 20, 30, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {totalItems != null && (
          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-700">{firstItemIndex}</strong>–<strong className="text-gray-700">{lastItemIndex}</strong> of <strong className="text-gray-700">{totalItems}</strong>
          </div>
        )}
      </div>

      {/* center: page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          className={`p-1 rounded-md ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          <ChevronsLeft className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={`p-1 rounded-md ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {pages.map((p, i) =>
          p === "start-ellipsis" || p === "end-ellipsis" ? (
            <span key={p + i} className="px-3 py-1 text-sm text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${p === currentPage ? "bg-orange-600 text-white" : "bg-white text-gray-700 border hover:bg-orange-50"}`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={`p-1 rounded-md ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          className={`p-1 rounded-md ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          <ChevronsRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* right: compact page info */}
      <div className="text-sm text-gray-600">
        Page <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
      </div>
    </div>
  );
};

export default Pagination;
