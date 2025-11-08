import { useState, useEffect, useContext } from "react";
import { MapPin, X, Loader2, EyeIcon, RefreshCw } from "lucide-react";
import { useTrackQRData } from "../Context/TrackQRDataContext";

const QRTrack = () => {
  const {
    qrData,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    setPage,
    fetchQRData,
    searchQRData,
    setSearchQuery: setContextSearchQuery,
  } = useTrackQRData();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      searchQRData(localSearchQuery.trim());
      setPage(1);
    } else {
      setContextSearchQuery("");
      fetchQRData(1);
      setPage(1);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    setContextSearchQuery("");
    fetchQRData(1);
    setPage(1);
  };

  const handleLocationClick = (location, qrId) => {
    setSelectedLocation({ ...location, qrId });
  };

  const closeModal = () => {
    setSelectedLocation(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scanned":
        return "bg-green-100 text-green-800";
      case "not_scanned":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "not_scanned":
        return "Not Scanned";
      case "scanned":
        return "Scanned";
      case "inactive":
        return "Inactive";
      default:
        return status || "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  // Calculate showing range
  const pageSize = 10;
  const showingStart = qrData.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const showingEnd = (page - 1) * pageSize + qrData.length;
  const displayTotal = totalItems || totalPages * pageSize;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Code Tracking</h1>
          <p className="text-gray-600 text-sm mt-1">
            Monitor and manage all generated QR codes — view their status, scan
            details, and locations in real-time.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <input
          type="text"
          placeholder="Search by Batch ID"
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
          {localSearchQuery && (
            <button
              onClick={handleClearSearch}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Data
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600 font-medium">Loading QR data...</p>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">
              {qrData.length > 0 ? (
                <span>
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {showingStart}-{showingEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {displayTotal}
                  </span>{" "}
                  QR codes
                </span>
              ) : (
                <span>No QR codes found</span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{page}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scanned By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qrData.length > 0 ? (
                    qrData.map((qr) => (
                      <tr
                        key={qr.qrId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {qr.qrId?.substring(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500">
                            {qr.qrId?.substring(qr.qrId.length - 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {qr.batchId || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {qr.companyName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              qr.status
                            )}`}
                          >
                            {getStatusLabel(qr.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {qr.scannedByName ? (
                            <span className="font-mono text-xs">
                              {qr.scannedByName.length > 15
                                ? `${qr.scannedByName.substring(0, 15)}...`
                                : qr.scannedByName}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(qr.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {qr.city ? (
                              <>
                                <span className="text-gray-700 text-sm">
                                  {qr.city}
                                  {qr.state ? `, ${qr.state}` : ""}
                                </span>
                                {qr.location && (
                                  <button
                                    onClick={() =>
                                      handleLocationClick(qr.location, qr.qrId)
                                    }
                                    className="inline-flex items-center p-1 text-blue-500 hover:text-blue-600 transition-colors"
                                    title="View location on map"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            ) : qr.location ? (
                              <button
                                onClick={() =>
                                  handleLocationClick(qr.location, qr.qrId)
                                }
                                className="inline-flex items-center gap-1 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                title="View location on map"
                              >
                                <MapPin className="w-4 h-4" />
                                <span className="text-xs">View Map</span>
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                No location
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          <p className="mt-2 text-gray-500 font-medium">
                            No QR codes available
                          </p>
                          <p className="text-sm text-gray-400">
                            {localSearchQuery
                              ? "Try a different search term"
                              : "Start by creating your first QR code"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  First
                </button>
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Previous
                </button>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (page <= 3) {
                    pageNum = idx + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = page - 2 + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                        page === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Next
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Map Modal */}
      {selectedLocation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  QR Location Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  QR ID: {selectedLocation.qrId?.substring(0, 13)}...
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Coordinates: {selectedLocation.lat?.toFixed(6)},{" "}
                  {selectedLocation.lng?.toFixed(6)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative" style={{ minHeight: "500px" }}>
              <iframe
                src={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&output=embed`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="QR Location Map"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <a
                href={`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRTrack;