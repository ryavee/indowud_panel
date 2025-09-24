import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Calendar,
  Hash,
  Loader2,
  RefreshCw,
  AlertCircle,
  Eye,
  Paperclip,
} from "lucide-react";
import { useTicketContext } from "../Context/TicketsContext";

const ManageTickets = () => {
  const [activeFilter, setActiveFilter] = useState("P"); // Default to Pending

  const {
    tickets,
    loading,
    error,
    updating,
    updateTicketStatus,
    retry,
    getTicketsByStatus,
    getStatusCounts,
  } = useTicketContext();

  // Get status counts using context helper
  const statusCounts = getStatusCounts();

  // Get filtered tickets using context helper
  const filteredTickets = getTicketsByStatus(activeFilter);

  const getStatusInfo = (status) => {
    switch (status) {
      case "P":
        return {
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
          bgColor: "bg-yellow-50",
          ringColor: "ring-yellow-500 border-yellow-300",
          count: statusCounts.pending,
        };
      case "C":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          bgColor: "bg-green-50",
          ringColor: "ring-green-500 border-green-300",
          count: statusCounts.completed,
        };
      case "R":
        return {
          label: "Rejected",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
          bgColor: "bg-red-50",
          ringColor: "ring-red-500 border-red-300",
          count: statusCounts.rejected,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Clock,
          bgColor: "bg-gray-50",
          ringColor: "ring-gray-500 border-gray-300",
          count: 0,
        };
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    if (newStatus === tickets.find((t) => t.ticketId === ticketId)?.status) {
      return; // No change needed
    }

    const result = await updateTicketStatus(ticketId, newStatus);

    if (!result.success) {
      // Error handling is managed by the context
      console.error("Failed to update ticket status:", result.error);
    }
  };

  const handleViewAttachment = (attachement) => {
    if (attachement) {
      // If attachment is a URL, open it in a new tab
      if (typeof attachement === "string" && attachement.startsWith("http")) {
        window.open(attachement, "_blank");
      } else {
        // Handle other attachment types (base64, blob, etc.)
        // This is a placeholder - implement based on your attachment format
        console.log("Viewing attachment:", attachement);
        // You might want to show a modal or download the file
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRetry = async () => {
    await retry();
  };

  // Loading Component
  const LoadingState = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-lg text-gray-600">Loading tickets...</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorState = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-red-700 font-medium">
                  Failed to load tickets
                </p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Page Header Component
  const PageHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tickets</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage customer support tickets
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {statusCounts.total} tickets
        </div>
      </div>
    </div>
  );

  // Status Card Component
  const StatusCard = ({ status, isActive, onClick }) => {
    const statusInfo = getStatusInfo(status);
    const StatusIcon = statusInfo.icon;

    return (
      <div
        onClick={onClick}
        className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isActive ? `ring-2 ${statusInfo.ringColor}` : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {statusInfo.label}
            </p>
            <p
              className={`text-3xl font-bold ${
                status === "P"
                  ? "text-yellow-600"
                  : status === "C"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {statusInfo.count}
            </p>
          </div>
          <div
            className={`p-3 rounded-full ${
              status === "P"
                ? "bg-yellow-100"
                : status === "C"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <StatusIcon
              className={`h-6 w-6 ${
                status === "P"
                  ? "text-yellow-600"
                  : status === "C"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            />
          </div>
        </div>
      </div>
    );
  };

  // Ticket Item Component
  const TicketItem = ({ ticket }) => {
    const statusInfo = getStatusInfo(ticket.status);
    const StatusIcon = statusInfo.icon;
    const isUpdating = updating === ticket.ticketId;
    const hasAttachment = ticket.attachement != null;

    return (
      <div
        className={`p-6 hover:${
          statusInfo.bgColor
        } transition-colors duration-150 ${isUpdating ? "opacity-75" : ""}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-center gap-4 mb-3">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}
              >
                <StatusIcon className="h-4 w-4 mr-1" />
                {statusInfo.label}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Hash className="h-4 w-4 mr-1" />
                {ticket.ticketId}
              </div>
              {hasAttachment && (
                <div className="flex items-center text-sm text-blue-600">
                  <Paperclip className="h-4 w-4 mr-1" />
                  <button
                    onClick={() => handleViewAttachment(ticket.attachement)}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Attachment
                  </button>
                </div>
              )}
            </div>

            {/* Ticket Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {ticket.subject}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-3">
                {ticket.message}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{ticket.userName}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{ticket.userPhone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="ml-6 flex-shrink-0 space-y-3">
            {/* Status Change Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Status
              </label>
              <div className="relative">
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleStatusChange(ticket.ticketId, e.target.value)
                  }
                  disabled={isUpdating}
                  className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="P">Pending</option>
                  <option value="C">Completed</option>
                  <option value="R">Rejected</option>
                </select>
                {isUpdating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Empty State Component
  const EmptyState = () => {
    const statusLabel =
      activeFilter === "P"
        ? "pending"
        : activeFilter === "C"
        ? "completed"
        : "rejected";

    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="mb-4">
            {activeFilter === "P" && (
              <Clock className="h-12 w-12 text-gray-400 mx-auto" />
            )}
            {activeFilter === "C" && (
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto" />
            )}
            {activeFilter === "R" && (
              <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {statusLabel} tickets
          </h3>
          <p className="text-gray-500">
            There are currently no {statusLabel} tickets to display.
          </p>
        </div>
      </div>
    );
  };

  // Main render logic
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageHeader />

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatusCard
            status="P"
            isActive={activeFilter === "P"}
            onClick={() => setActiveFilter("P")}
          />
          <StatusCard
            status="C"
            isActive={activeFilter === "C"}
            onClick={() => setActiveFilter("C")}
          />
          <StatusCard
            status="R"
            isActive={activeFilter === "R"}
            onClick={() => setActiveFilter("R")}
          />
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeFilter === "P" && "Pending Tickets"}
                {activeFilter === "C" && "Completed Tickets"}
                {activeFilter === "R" && "Rejected Tickets"}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredTickets.length})
                </span>
              </h2>
              {error && (
                <button
                  onClick={handleRetry}
                  className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </button>
              )}
            </div>
          </div>

          {filteredTickets.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <TicketItem key={ticket.ticketId} ticket={ticket} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTickets;
