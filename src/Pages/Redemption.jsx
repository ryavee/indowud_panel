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
  Search,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useRedemptionsContext } from "../Context/RedemptionContext";
import Pagination from "../Components/Reusable/Pagination";
import ConfirmationModal from "../Components/ConfirmationModal";

const RedemptionManagement = () => {
  const { redemptions, loading, error, updateRedemptionStatus } =
    useRedemptionsContext();

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [resetSpin, setResetSpin] = useState(false);
  // per-row confirmation modal state
  const [confirmAction, setConfirmAction] = useState({
    open: false,
    id: null,
    uid: null,
    action: null, // "A" or "R"
    name: "",     // optional display name
  });
  const [actionProcessing, setActionProcessing] = useState(false);

  // open the confirmation modal for a single redemption
  const openConfirmAction = (id, uid, action, name = "") => {
    setConfirmAction({ open: true, id, uid, action, name });
  };

  // when user confirms in modal, call your existing handler
  const handleConfirmAction = async () => {
    if (!confirmAction.id || !confirmAction.action) return;
    try {
      setActionProcessing(true);
      // reuse existing function that already handles API + toasts
      await handleStatusChange(confirmAction.id, confirmAction.uid, confirmAction.action);
    } catch (err) {
      console.error("Confirm action error:", err);
    } finally {
      setActionProcessing(false);
      setConfirmAction({ open: false, id: null, uid: null, action: null, name: "" });
    }
  };

  // Bulk confirmation modal
  const [confirmBulk, setConfirmBulk] = useState({
    open: false,
    action: null, // "A" or "R"
    count: 0
  });
  const [bulkLoadingAction, setBulkLoadingAction] = useState(null);




  const handleStatusChange = async (id, uid, newStatus) => {
    try {
      setActionLoading(id);
      const result = await updateRedemptionStatus(id, uid, newStatus);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error in handleStatusChange:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      P: "Pending",
      A: "Approved",
      R: "Rejected",
    };
    return statusMap[status] || status;
  };

  const getStatusClasses = (status) => {
    const classMap = {
      P: "bg-yellow-100 text-yellow-700",
      A: "bg-green-100 text-green-700",
      R: "bg-red-100 text-red-700",
    };
    return `${classMap[status]} px-3 py-1 rounded-full text-xs font-medium`;
  };

  const filteredData = useMemo(() => {
    let filtered = redemptions;

    if (filter !== "All") {
      const statusCode = { Pending: "P", Approved: "A", Rejected: "R" }[filter];
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

  const handleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? paginatedData.map((r) => r.id) : []);
  };

  const handleBulkAction = async (newStatus) => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one redemption");
      return;
    }

    // Only pending redemptions
    const selectedRedemptions = redemptions.filter(
      (r) => selectedRows.includes(r.id) && r.status === "P"
    );

    if (selectedRedemptions.length === 0) {
      toast.error("No pending redemptions selected");
      return;
    }

    const actionText = newStatus === "A" ? "approve" : "reject";

    // close the bulk confirm modal
    setConfirmBulk({ open: false, action: null, count: 0 });

    try {
      setBulkActionLoading(true);
      setBulkLoadingAction(newStatus);        // 👈 mark which button is loading

      console.log("Bulk Action Data:", {
        redemptionIds: selectedRedemptions.map((r) => r.id),
        userIds: selectedRedemptions.map((r) => r.uid),
        status: newStatus,
        count: selectedRedemptions.length,
      });

      let successCount = 0;
      let failCount = 0;

      for (const redemption of selectedRedemptions) {
        try {
          const result = await updateRedemptionStatus(
            redemption.id,
            redemption.uid,
            newStatus
          );
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error(`Error updating ${redemption.id}:`, err);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully ${actionText}ed ${successCount} redemption(s)`
        );
      }
      if (failCount > 0) {
        toast.error(`Failed to ${actionText} ${failCount} redemption(s)`);
      }

      setSelectedRows([]);
    } catch (err) {
      toast.error("An unexpected error occurred during bulk action");
      console.error("Error in handleBulkAction:", err);
    } finally {
      setBulkActionLoading(false);
      setBulkLoadingAction(null);            // 👈 reset which button is loading
    }
  };



  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedData.length > 0 && selectedRows.length === paginatedData.length;
  const isSomeSelected =
    selectedRows.length > 0 && selectedRows.length < paginatedData.length;

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
      formatter: (value) => getStatusDisplay(value),
    },
    {
      header: "Requested Date",
      key: "requestedAt",
      formatter: (value) => new Date(value).toLocaleString(),
    },
    { header: "Account Holder", key: "accountHolder" },
    { header: "Account Number", key: "accountNumber" },
    { header: "Account Type", key: "accountType" },
    { header: "IFSC Code", key: "ifscCode" },
    { header: "Bank Name", key: "bankName" },
  ];

  const handleCustomExport = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one row to export");
      return;
    }

    const dataToExport = redemptions.filter((r) => selectedRows.includes(r.id));
    const headers = exportColumns.map((col) => col.header);
    const csvRows = [headers.join(",")];

    dataToExport.forEach((item) => {
      const row = exportColumns.map((col) => {
        const value = item[col.key];
        const formattedValue = col.formatter
          ? col.formatter(value, item)
          : value || "";
        return formattedValue;
      });
      csvRows.push(row.map((field) => `"${field}"`).join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `redemptions-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${selectedRows.length} redemptions`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleResetFilters = () => {
    setResetSpin(true);

    setFilter("All");
    setSelectedDate("");
    setSearchQuery("");
    setCurrentPage(1);

    setTimeout(() => setResetSpin(false), 600);
  };



  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#059669",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#059669",
            },
          },
          error: {
            style: {
              background: "#DC2626",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#DC2626",
            },
          },
        }}
      />

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              Redemption Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage user redemption requests and update their statuses.
            </p>
          </div>
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
                className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-4 cursor-pointer ${filter === stat.title ||
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

        {/* Filters + Bulk Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 mb-8 justify-between">

          {/* Left side: Filters */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative min-w-[260px] sm:min-w-[300px] md:w-72 lg:w-80 flex-1">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, UPI ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                   shadow-sm text-sm focus:ring-2 focus:ring-orange-500 
                   focus:outline-none transition-all"
              />
            </div>

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm 
                 focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
            />

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm 
                 focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>


            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2 
                         text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white 
                         rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <RotateCcw
                className={`w-4 h-4 transition-transform ${resetSpin ? "animate-spin-reverse" : ""
                  }`}
              />
              Reset
            </button>

          </div>

          {/* Right side – Bulk Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">

            {/* Approve */}
            <button
              onClick={() => {
                if (selectedRows.length > 0) {
                  const pendingCount = redemptions.filter(
                    (r) => selectedRows.includes(r.id) && r.status === "P"
                  ).length;

                  if (pendingCount === 0) {
                    toast.error("No pending redemptions selected");
                    return;
                  }

                  setConfirmBulk({
                    open: true,
                    action: "A",
                    count: pendingCount,
                  });
                }
              }}
              disabled={bulkActionLoading && bulkLoadingAction !== "A"}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition  
                  ${selectedRows.length > 0 && (!bulkActionLoading || bulkLoadingAction === "A")
                  ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              {bulkActionLoading && bulkLoadingAction === "A" ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Approving...
                </span>
              ) : (
                `Approve (${selectedRows.length})`
              )}
            </button>

            {/* Reject */}
            <button
              onClick={() => {
                if (selectedRows.length > 0) {
                  const pendingCount = redemptions.filter(
                    (r) => selectedRows.includes(r.id) && r.status === "P"
                  ).length;

                  if (pendingCount === 0) {
                    toast.error("No pending redemptions selected");
                    return;
                  }

                  setConfirmBulk({
                    open: true,
                    action: "R",
                    count: pendingCount,
                  });
                }
              }}
              disabled={bulkActionLoading && bulkLoadingAction !== "R"}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition  
                  ${selectedRows.length > 0 && (!bulkActionLoading || bulkLoadingAction === "R")
                  ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              {bulkActionLoading && bulkLoadingAction === "R" ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rejecting...
                </span>
              ) : (
                `Reject (${selectedRows.length})`
              )}
            </button>




            {/* Export */}
            <button
              onClick={() => selectedRows.length > 0 && handleCustomExport()}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition  
                  ${selectedRows.length > 0
                  ? "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              Export ({selectedRows.length})
            </button>
          </div>
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
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = isSomeSelected;
                            }
                          }}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </th>
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
                      <tr
                        key={r.id}
                        className={`hover:bg-orange-50/40 transition-all ${selectedRows.includes(r.id) ? "bg-orange-50/60" : ""
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
                                onClick={() => openConfirmAction(r.id, r.uid, "A", r.userName || r.id)}
                                disabled={actionLoading === r.id}
                                className={`bg-green-600 hover:bg-green-700 text-white px-3 
                                  py-1.5 rounded-md text-xs font-medium transition cursor-pointer
                                   ${actionLoading === r.id ? "opacity-60 cursor-not-allowed" : ""}`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openConfirmAction(r.id, r.uid, "R", r.userName || r.id)}
                                disabled={actionLoading === r.id}
                                className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 
                                  rounded-md text-xs font-medium transition cursor-pointer
                                   ${actionLoading === r.id ? "opacity-60 cursor-not-allowed" : ""}`}
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

              {/* Pagination Component */}
              <div className="bg-gray-50 border-t border-gray-100">
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
      <ConfirmationModal
        isOpen={confirmAction.open}
        title={confirmAction.action === "A" ? "Approve Redemption" : "Reject Redemption"}
        message={
          confirmAction.open
            ? `Are you sure you want to ${confirmAction.action === "A" ? "approve" : "reject"} the redemption for "${confirmAction.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmAction({ open: false, id: null, uid: null, action: null, name: "" })
        }
        isLoading={actionProcessing}
        confirmText={confirmAction.action === "A" ? "Approve" : "Reject"}
        loadingText={confirmAction.action === "A" ? "Approving..." : "Rejecting..."}   // 👈 ADDED
        cancelText="Cancel"
        type={confirmAction.action === "A" ? "success" : "danger"}
      />

      <ConfirmationModal
        isOpen={confirmBulk.open}
        title={confirmBulk.action === "A" ? "Approve Multiple Redemptions" : "Reject Multiple Redemptions"}
        message={
          confirmBulk.open
            ? `Are you sure you want to ${confirmBulk.action === "A" ? "approve" : "reject"} ${confirmBulk.count} pending redemption(s)?`
            : ""
        }
        onConfirm={() => handleBulkAction(confirmBulk.action)}
        onCancel={() => setConfirmBulk({ open: false, action: null, count: 0 })}
        isLoading={bulkActionLoading}
        confirmText={confirmBulk.action === "A" ? "Approve All" : "Reject All"}
        loadingText={confirmBulk.action === "A" ? "Approving..." : "Rejecting..."}   // 👈 ADDED
        cancelText="Cancel"
        type={confirmBulk.action === "A" ? "success" : "danger"}
      />
    </div>
  );
};

export default RedemptionManagement;
