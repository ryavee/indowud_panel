import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  // ✅ Always show pagination UI, even for one page
  if (totalPages < 1) {
    return (
      <div className="flex justify-center items-center py-4 text-gray-500 text-sm">
        No records to display.
      </div>
    );
  }

  // Create an array of page numbers (up to 5 visible)
  const visiblePages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage < maxPagesToShow - 1)
    startPage = Math.max(1, endPage - maxPagesToShow + 1);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
      {/* Page size selector */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 sm:mb-0">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === 1
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-orange-600 bg-white border hover:bg-orange-50"
          }`}
        >
          Prev
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              page === currentPage
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border hover:bg-orange-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-orange-600 bg-white border hover:bg-orange-50"
          }`}
        >
          Next
        </button>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-600 mt-3 sm:mt-0">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </div>
    </div>
  );
};

export default Pagination;
