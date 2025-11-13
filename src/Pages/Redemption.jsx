import React, { useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
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
  const {
    redemptions,
    loading,
    error,
    updateRedemptionStatus,
    bulkUpdateRedemptionStatus,
    fetchRedemptions,
  } = useRedemptionsContext();

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  /** ✅ Single Redemption Update **/
  const handleStatusChange = async (id, uid, newStatus) => {
    try {
      setActionLoading(id);
      const result = await updateRedemptionStatus(id, uid, newStatus);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  /** ✅ Bulk Status Update (using new API) **/
  const handleBulkAction = async (newStatus) => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one redemption");
      return;
    }

    const pendingIds = redemptions
      .filter((r) => selectedRows.includes(r.id) && r.status === "P")
      .map((r) => r.id);

    if (pendingIds.length === 0) {
      toast.error("No pending redemptions selected");
      return;
    }

    const actionText = newStatus === "A" ? "approve" : "reject";
    if (
      !window.confirm(
        `Are you sure you want to ${actionText} ${pendingIds.length} redemption(s)?`
      )
    )
      return;

    try {
      setBulkActionLoading(true);
      const result = await bulkUpdateRedemptionStatus(pendingIds, newStatus);
      if (result.success) {
        toast.success(result.message);
        await fetchRedemptions();
      } else {
        toast.error(result.message || "Bulk action failed");
      }
      setSelectedRows([]);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during bulk action");
    } finally {
      setBulkActionLoading(false);
    }
  };

  /** ✅ Filters and Pagination **/
  const filteredData = useMemo(() => {
    let filtered = redemptions;

    if (filter !== "All") {
      const statusCode = { Pending: "P", Approved: "A", Rejected: "R" }[filter];
      filtered = filtered.filter((r) => r.status === statusCode);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.userName?.toLowerCase().includes(q) ||
          r.userPhone?.includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.upiId?.toLowerCase().includes(q)
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((r) => {
        const requestDate = new Date(r.requestedAt).toISOString().split("T")[0];
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

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /** ✅ Selection Handlers **/
  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? paginatedData.map((r) => r.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedData.length > 0 && selectedRows.length === paginatedData.length;
  const isSomeSelected =
    selectedRows.length > 0 && selectedRows.length < paginatedData.length;

  /** ✅ Helper Functions **/
  const getStatusDisplay = (status) =>
    ({ P: "Pending", A: "Approved", R: "Rejected" }[status] || status);

  const getStatusClasses = (status) =>
    ({
      P: "bg-yellow-100 text-yellow-700",
      A: "bg-green-100 text-green-700",
      R: "bg-red-100 text-red-700",
    }[status] + " px-3 py-1 rounded-full text-xs font-medium");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  /** ✅ CSV Export **/
  const handleCustomExport = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one row to export");
      return;
    }

    const exportColumns = [
      { header: "ID", key: "id" },
      { header: "User Name", key: "userName" },
      { header: "Phone", key: "userPhone" },
      { header: "UPI ID", key: "upiId" },
      { header: "UPI Number", key: "upiNumber" },
      { header: "Points", key: "points" },
      { header: "Ratio", key: "ratio" },
      { header: "Total Value (₹)", key: "totalValue" },
      {
        header: "Status",
        key: "status",
        formatter: (v) => getStatusDisplay(v),
      },
      {
        header: "Requested Date",
        key: "requestedAt",
        formatter: (v) => new Date(v).toLocaleString(),
      },
    ];

    const dataToExport = redemptions.filter((r) => selectedRows.includes(r.id));
    const headers = exportColumns.map((col) => col.header);
    const csvRows = [headers.join(",")];

    dataToExport.forEach((item) => {
      const row = exportColumns.map((col) => {
        const val = item[col.key];
        return col.formatter ? col.formatter(val) : val || "";
      });
      csvRows.push(row.map((v) => `"${v}"`).join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `redemptions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success(`Exported ${selectedRows.length} redemptions`);
  };

  /** ✅ Loading & Error UI **/
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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

  /** ✅ Main UI **/
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Redemption Management
            </h1>
            <p className="text-sm text-gray-600">
              Manage user redemption requests and update their statuses.
            </p>
          </div>

          {selectedRows.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleBulkAction("A")}
                disabled={bulkActionLoading}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition ${
                  bulkActionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {bulkActionLoading
                  ? "Processing..."
                  : `Approve (${selectedRows.length})`}
              </button>

              <button
                onClick={() => handleBulkAction("R")}
                disabled={bulkActionLoading}
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition ${
                  bulkActionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {bulkActionLoading
                  ? "Processing..."
                  : `Reject (${selectedRows.length})`}
              </button>

              <button
                onClick={handleCustomExport}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Export ({selectedRows.length})
              </button>
            </div>
          )}
        </div>

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
          ].map((stat) => {
            const colorMap = {
              orange: "bg-orange-100 text-orange-600",
              yellow: "bg-yellow-100 text-yellow-600",
              green: "bg-green-100 text-green-600",
              red: "bg-red-100 text-red-600",
            };
            return (
              <div
                key={stat.title}
                onClick={() =>
                  setFilter(
                    stat.title === "Total Redemptions" ? "All" : stat.title
                  )
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
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
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
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="text"
            placeholder="Search by name, phone, UPI ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 flex-1 text-sm focus:ring-2 focus:ring-orange-500"
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
                      <th className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(input) =>
                            input && (input.indeterminate = isSomeSelected)
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <div className="flex items-center gap-1">
                          <Gift className="h-4 w-4" /> User
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <Phone className="h-4 w-4" /> Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <Wallet className="h-4 w-4" /> UPI Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <IndianRupee className="h-4 w-4" /> Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <CalendarDays className="h-4 w-4" /> Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <CheckCircle className="h-4 w-4" /> Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <MoreVertical className="h-4 w-4" /> Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((r) => (
                      <tr
                        key={r.id}
                        className={`hover:bg-orange-50 ${
                          selectedRows.includes(r.id) ? "bg-orange-50/70" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(r.id)}
                            onChange={() => handleSelectRow(r.id)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {r.userName}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {r.userPhone}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div>{r.upiId || "-"}</div>
                          <div className="text-xs text-gray-500">
                            {r.upiNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          ₹{r.totalValue} ({r.points} pts)
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
                                  handleStatusChange(r.id, r.userId, "A")
                                }
                                disabled={actionLoading === r.id}
                                className={`text-green-600 hover:text-green-800 text-sm ${
                                  actionLoading === r.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(r.id, r.userId, "R")
                                }
                                disabled={actionLoading === r.id}
                                className={`text-red-600 hover:text-red-800 text-sm ${
                                  actionLoading === r.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
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
