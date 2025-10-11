import React, { useState, useMemo } from "react";
import { useRedemptionsContext } from "../Context/RedemptionContext";

const RedemptionManagement = () => {
  const { redemptions, loading, error, updateRedemptionStatus } =
    useRedemptionsContext();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusChange = async (id, uid, newStatus) => {
    try {
      setActionLoading(id);
      const result = await updateRedemptionStatus(id, uid, newStatus);

      if (result.success) {
        showNotification(result.message, "success");
      } else {
        showNotification(result.message, "error");
      }
    } catch (err) {
      showNotification("An unexpected error occurred", "error");
      console.error("Error in handleStatusChange:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Format status for display
  const getStatusDisplay = (status) => {
    switch (status) {
      case "P":
        return "Pending";
      case "A":
        return "Approved";
      case "R":
        return "Rejected";
      default:
        return status;
    }
  };

  // Filter and search redemptions
  const filteredData = useMemo(() => {
    let filtered = redemptions;

    // Filter by status
    if (filter !== "All") {
      const statusCode =
        filter === "Pending" ? "P" : filter === "Approved" ? "A" : "R";
      filtered = filtered.filter((r) => r.status === statusCode);
    }

    // Search by user name, phone, or id
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.userName?.toLowerCase().includes(query) ||
          r.userPhone?.includes(query) ||
          r.id.toLowerCase().includes(query) ||
          r.upiId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [redemptions, filter, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = redemptions.length;
    const pending = redemptions.filter((r) => r.status === "P").length;
    const approved = redemptions.filter((r) => r.status === "A").length;
    const rejected = redemptions.filter((r) => r.status === "R").length;
    return { total, pending, approved, rejected };
  }, [redemptions]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "P":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold";
      case "A":
        return "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold";
      case "R":
        return "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold";
      default:
        return "";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading redemptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-1">Redemption Management</h1>
      <p className="text-gray-600 mb-6">
        Manage user redemptions, track status, and take action.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "All" ? "bg-blue-200" : "bg-blue-100 hover:bg-blue-200"
          }`}
          onClick={() => setFilter("All")}
        >
          <h2 className="text-xl font-bold text-blue-700">{stats.total}</h2>
          <p className="text-gray-600">Total Redemptions</p>
        </div>

        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "Pending"
              ? "bg-yellow-200"
              : "bg-yellow-100 hover:bg-yellow-200"
          }`}
          onClick={() => setFilter("Pending")}
        >
          <h2 className="text-xl font-bold text-yellow-700">{stats.pending}</h2>
          <p className="text-gray-600">Pending</p>
        </div>

        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "Approved"
              ? "bg-green-200"
              : "bg-green-100 hover:bg-green-200"
          }`}
          onClick={() => setFilter("Approved")}
        >
          <h2 className="text-xl font-bold text-green-700">{stats.approved}</h2>
          <p className="text-gray-600">Approved</p>
        </div>

        <div
          className={`p-6 rounded-lg shadow text-center cursor-pointer transition ${
            filter === "Rejected" ? "bg-red-200" : "bg-red-100 hover:bg-red-200"
          }`}
          onClick={() => setFilter("Rejected")}
        >
          <h2 className="text-xl font-bold text-red-700">{stats.rejected}</h2>
          <p className="text-gray-600">Rejected</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          placeholder="Search by name, phone, UPI ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No redemptions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">User Name</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">UPI ID</th>
                <th className="border p-3 text-left">UPI Number</th>
                <th className="border p-3 text-left">Points</th>
                <th className="border p-3 text-left">Ratio</th>
                <th className="border p-3 text-left">Total Value</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border p-3">{r.userName}</td>
                  <td className="border p-3">{r.userPhone}</td>
                  <td className="border p-3">{r.upiId}</td>
                  <td className="border p-3">{r.upiNumber}</td>
                  <td className="border p-3">{r.points}</td>
                  <td className="border p-3">{r.ratio}</td>
                  <td className="border p-3">₹{r.totalValue}</td>
                  <td className="border p-3">{formatDate(r.requestedAt)}</td>
                  <td className="border p-3">
                    <span className={getStatusClasses(r.status)}>
                      {getStatusDisplay(r.status)}
                    </span>
                  </td>
                  <td className="border p-3 text-center space-x-2">
                    {r.status === "P" ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(r.id, r.uid, "A")}
                          disabled={actionLoading === r.id}
                          className={`bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition ${
                            actionLoading === r.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {actionLoading === r.id ? (
                            <span className="flex items-center gap-1">
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            </span>
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusChange(r.id, r.uid, "R")}
                          disabled={actionLoading === r.id}
                          className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ${
                            actionLoading === r.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {actionLoading === r.id ? (
                            <span className="flex items-center gap-1">
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            </span>
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </>
                    ) : (
                      <button className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed">
                        {getStatusDisplay(r.status)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RedemptionManagement;
