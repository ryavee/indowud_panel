import React, { useState, useMemo } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Gift,
  Phone,
  IndianRupee,
  CalendarDays,
  Wallet,
  MoreVertical,
} from "lucide-react";
import { useRedemptionsContext } from "../Context/RedemptionContext";
import Pagination from "../Components/Reusable/Pagination";

const RedemptionManagement = () => {
  const { redemptions, loading, error, updateRedemptionStatus } =
    useRedemptionsContext();

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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

  // ✅ Filtering logic
  const filteredData = useMemo(() => {
    let filtered = redemptions;

    if (filter !== "All") {
      const statusCode =
        filter === "Pending" ? "P" : filter === "Approved" ? "A" : "R";
      filtered = filtered.filter((r) => r.status === statusCode);
    }

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

    if (selectedDate) {
      filtered = filtered.filter((r) => {
        const requestDate = new Date(r.requestedAt)
          .toISOString()
          .split("T")[0];
        return requestDate === selectedDate;
      });
    }

    return filtered;
  }, [redemptions, filter, searchQuery, selectedDate]);

  const stats = useMemo(() => {
    const total = redemptions.length;
    const pending = redemptions.filter((r) => r.status === "P").length;
    const approved = redemptions.filter((r) => r.status === "A").length;
    const rejected = redemptions.filter((r) => r.status === "R").length;
    return { total, pending, approved, rejected };
  }, [redemptions]);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusClasses = (status) => {
    switch (status) {
      case "P":
        return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium";
      case "A":
        return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium";
      case "R":
        return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium";
      default:
        return "";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading redemptions...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
    <div className="w-full max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white transition-all ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <h1 className="text-2xl font-bold mb-1 text-gray-900">
        Redemption Management
      </h1>
      <p className="text-gray-600 mb-6">
        Manage user redemption requests and update their statuses.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Redemptions",
            value: stats.total,
            icon: Users,
            color: "orange",
          },
          {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "yellow",
          },
          {
            title: "Approved",
            value: stats.approved,
            icon: CheckCircle,
            color: "green",
          },
          {
            title: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "red",
          },
        ].map((stat, i) => {
          const colorMap = {
            orange: "bg-orange-100 text-orange-600",
            yellow: "bg-yellow-100 text-yellow-600",
            green: "bg-green-100 text-green-600",
            red: "bg-red-100 text-red-600",
          };
          return (
            <div
              key={i}
              onClick={() =>
                setFilter(stat.title === "Total Redemptions" ? "All" : stat.title)
              }
              className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-4 cursor-pointer ${
                filter === stat.title ||
                (filter === "All" && stat.title === "Total Redemptions")
                  ? "ring-2 ring-orange-500"
                  : ""
              }`}
            >
              <div className={`p-3 rounded-full ${colorMap[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Search by name, phone, UPI ID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 flex-1 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No redemptions found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Gift className="h-4 w-4" /> User Name
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" /> Contact
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Wallet className="h-4 w-4" /> UPI Details
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" /> Amount
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" /> Date
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Status
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <MoreVertical className="h-4 w-4" /> Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((r) => (
                    <tr key={r.id} className="hover:bg-orange-50/40 transition-all">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {r.userName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{r.userPhone}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="text-sm">{r.upiId || "-"}</div>
                        <div className="text-xs text-gray-500">
                          {r.upiNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="font-medium">
                          {r.points} pts = ₹{r.totalValue}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ratio: {r.ratio || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(r.requestedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusClasses(r.status)}>
                          {getStatusDisplay(r.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {r.status === "P" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleStatusChange(r.id, r.uid, "A")
                              }
                              disabled={actionLoading === r.id}
                              className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                actionLoading === r.id
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(r.id, r.uid, "R")
                              }
                              disabled={actionLoading === r.id}
                              className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                actionLoading === r.id
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            {getStatusDisplay(r.status)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination Component */}
            <div className="bg-gray-50 border-t border-gray-100 ">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default RedemptionManagement;
