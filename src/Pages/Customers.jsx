import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  ShieldCheck,
  Loader2,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  Locate,
  CircleStar,
  Users as UsersIcon,
  Lock,
  Unlock,
  IdCard,
  Search,
  RotateCcw,
} from "lucide-react";
import { CustomerContext } from "../Context/CustomerContext";

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState({ block: null, kyc: null });
  const [resetSpinning, setResetSpinning] = useState(false);

  const {
    customersList = [],
    loading,
    blockLoading,
    kycLoading,
    blockAppCustomer,
    kycVerification,
  } = useContext(CustomerContext);

  // Stats (based on full list)
  const totalCustomers = customersList.length;
  const kycVerified = customersList.filter((c) => c.isKYCVerified).length;
  const blockedUsers = customersList.filter((c) => c.isBlocked).length;
  const activeUsers = totalCustomers - blockedUsers;

  // Filtering logic
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return customersList.filter((c) => {
      const matchesSearch =
        !q ||
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.referralCode?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && !c.isBlocked) ||
        (statusFilter === "Blocked" && c.isBlocked) ||
        (statusFilter === "KYC Verified" && c.isKYCVerified) ||
        (statusFilter === "KYC Pending" && !c.isKYCVerified);

      return matchesSearch && matchesStatus;
    });
  }, [customersList, searchTerm, statusFilter]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30); // default 30 as requested

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / rowsPerPage));

  // Ensure currentPage is within bounds if filteredCustomers or rowsPerPage change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCustomers.slice(start, start + rowsPerPage);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleChangeRowsPerPage = (n) => {
    setRowsPerPage(n);
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setResetSpinning(true);
    setCurrentPage(1);
    setTimeout(() => setResetSpinning(false), 600);
  };

  // Select customer (only via View Details button)
  const handleCustomerClick = (customer) => setSelectedCustomer(customer);

  // Keep selectedCustomer in sync if customersList updates externally
  useEffect(() => {
    if (selectedCustomer) {
      const updated = customersList.find((c) => c.uid === selectedCustomer.uid);
      if (updated) setSelectedCustomer(updated);
    }
  }, [customersList, selectedCustomer?.uid]);

  const handleBackClick = () => setSelectedCustomer(null);

  // ✅ Optimistic Block/Unblock
  const handleBlockCustomer = async (customerId) => {
    // find the customer and current status
    const customer = customersList.find((c) => c.uid === customerId);
    if (!customer) return;

    const previousStatus = customer.isBlocked;
    const newStatus = !previousStatus;

    // 🚀 Optimistic update — immediately reflect new status in UI
    setSelectedCustomer((prev) => prev && prev.uid === customerId ? { ...prev, isBlocked: newStatus } : prev);

    // and update locally in list too
    customersList.forEach((c) => {
      if (c.uid === customerId) c.isBlocked = newStatus;
    });

    // set loading indicator
    setActionLoading((prev) => ({ ...prev, block: customerId }));

    try {
      await blockAppCustomer(customerId, newStatus);
    } catch (error) {
      console.error("Error blocking/unblocking customer:", error);
      // ❌ revert optimistic change if request fails
      setSelectedCustomer((prev) => prev && prev.uid === customerId ? { ...prev, isBlocked: previousStatus } : prev);
      customersList.forEach((c) => {
        if (c.uid === customerId) c.isBlocked = previousStatus;
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, block: null }));
    }
  };

  // ✅ Optimistic KYC Verify/Revoke
  const handleKYCAction = async (customerId) => {
    const customer = customersList.find((c) => c.uid === customerId);
    if (!customer) return;

    const previousStatus = customer.isKYCVerified;
    const newStatus = !previousStatus;

    // 🚀 Optimistic update
    setSelectedCustomer((prev) => prev && prev.uid === customerId ? { ...prev, isKYCVerified: newStatus } : prev);
    customersList.forEach((c) => {
      if (c.uid === customerId) c.isKYCVerified = newStatus;
    });

    // set loading indicator
    setActionLoading((prev) => ({ ...prev, kyc: customerId }));

    try {
      await kycVerification(customerId, newStatus);
    } catch (error) {
      console.error("Error verifying/revoking KYC:", error);
      // ❌ revert optimistic change
      setSelectedCustomer((prev) => prev && prev.uid === customerId ? { ...prev, isKYCVerified: previousStatus } : prev);
      customersList.forEach((c) => {
        if (c.uid === customerId) c.isKYCVerified = previousStatus;
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, kyc: null }));
    }
  };


  const handleDocumentView = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden w-full max-w-4xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </div>
          <div className="p-6 flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-500">Loading customers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCustomer) {
    return (
      <>
      <div className="min-h-screen  p-6 ">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 
               bg-blue-50 hover:bg-blue-100 rounded-md shadow-sm
               transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.97]
               focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </button>
        </div>


        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-4">
              <img
                src={selectedCustomer.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </h2>
                <p className="text-blue-100">{selectedCustomer.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="bg-blue-400 px-3 py-1 rounded-full text-sm">
                    {selectedCustomer.loyaltyPoint} Loyalty Points
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${selectedCustomer.isKYCVerified
                      ? "bg-green-400 text-green-900"
                      : "bg-yellow-400 text-yellow-900"
                      }`}
                  >
                    {selectedCustomer.isKYCVerified
                      ? "KYC Verified"
                      : "KYC Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${selectedCustomer.isBlocked
                      ? "bg-red-400 text-red-900"
                      : "bg-green-400 text-green-900"
                      }`}
                  >
                    {selectedCustomer.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-gray-700">
                      {selectedCustomer.phone}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-gray-700">
                      {selectedCustomer.email}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-gray-700">
                      {selectedCustomer.district}, {selectedCustomer.state} -{" "}
                      {selectedCustomer.pincode}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Referral Code</p>
                    <p className="font-mono font-bold text-blue-600">
                      {selectedCustomer.referralCode}
                    </p>
                  </div>

                  {selectedCustomer.referredBy && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Referred By</p>
                      <p className="font-semibold">
                        {selectedCustomer.referredBy}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    UPI Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI ID:</span>
                      <span className="font-medium">
                        {selectedCustomer.upiId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">UPI Number:</span>
                      <span className="font-medium">
                        {selectedCustomer.upiNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Bank Information
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Holder:</span>
                    <span className="font-medium">
                      {selectedCustomer.bankDetails.accountHolder}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-mono">
                      {selectedCustomer.bankDetails.accountNumber}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <span className="font-medium">
                      {selectedCustomer.bankDetails.accountType}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium">
                      {selectedCustomer.bankDetails.bankName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">IFSC Code:</span>
                    <span className="font-mono font-bold">
                      {selectedCustomer.bankDetails.ifscCode}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Document Status
                  </h4>
                  <div className="space-y-3">
                    {/* Aadhaar Card Front */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">
                        Aadhaar Card Front
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCustomer.aadhaarCardFrontImage
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedCustomer.aadhaarCardFrontImage
                            ? "Uploaded"
                            : "Not Uploaded"}
                        </span>
                        {selectedCustomer.aadhaarCardFrontImage && (
                          <button
                            onClick={() =>
                              handleDocumentView(
                                selectedCustomer.aadhaarCardFrontImage
                              )
                            }
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Aadhaar Card Back */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">
                        Aadhaar Card Back
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCustomer.aadhaarCardBackImage
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedCustomer.aadhaarCardBackImage
                            ? "Uploaded"
                            : "Not Uploaded"}
                        </span>
                        {selectedCustomer.aadhaarCardBackImage && (
                          <button
                            onClick={() =>
                              handleDocumentView(
                                selectedCustomer.aadhaarCardBackImage
                              )
                            }
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PAN Card */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">
                        PAN Card
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCustomer.panCardImage
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedCustomer.panCardImage
                            ? "Uploaded"
                            : "Not Uploaded"}
                        </span>
                        {selectedCustomer.panCardImage && (
                          <button
                            onClick={() =>
                              handleDocumentView(selectedCustomer.panCardImage)
                            }
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              {/* ✅ Block / Unblock Button */}
              <button
                onClick={() => handleBlockCustomer(selectedCustomer.uid)}
                disabled={
                  actionLoading.block === selectedCustomer.uid ||
                  blockLoading === selectedCustomer.uid
                }
                className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm 
                transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.97] 
                focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer
                ${selectedCustomer.isBlocked
                    ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                    : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                  }
                disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {actionLoading.block === selectedCustomer.uid ||
                  blockLoading === selectedCustomer.uid ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {actionLoading.block === selectedCustomer.uid || blockLoading === selectedCustomer.uid
                  ? "Processing..."
                  : selectedCustomer.isBlocked
                    ? "Unblock Customer"
                    : "Block Customer"}
              </button>

              {/* ✅ KYC Verify / Revoke Button */}
              <button
                onClick={() => handleKYCAction(selectedCustomer.uid)}
                disabled={
                  actionLoading.kyc === selectedCustomer.uid ||
                  kycLoading === selectedCustomer.uid
                }
                className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm 
                transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.97] 
                focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer
                ${selectedCustomer.isKYCVerified
                    ? "bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500"
                    : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                  }
                disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {actionLoading.kyc === selectedCustomer.uid || kycLoading === selectedCustomer.uid ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                {actionLoading.kyc === selectedCustomer.uid || kycLoading === selectedCustomer.uid
                  ? "Processing..."
                  : selectedCustomer.isKYCVerified
                    ? "Revoke KYC"
                    : "Verify KYC"}
              </button>
            </div>

          </div>
          </div>
        </div>
      </>
    );
  }
  // Table view
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customers, KYC, loyalty points and payouts.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          {[
            { title: "Total Customers", value: totalCustomers, icon: UsersIcon, color: "blue" },
            { title: "KYC Verified", value: kycVerified, icon: IdCard, color: "green" },
            { title: "Blocked Users", value: blockedUsers, icon: Lock, color: "red" },
            { title: "Active Users", value: activeUsers, icon: Unlock, color: "yellow" },
          ].map((stat, i) => {
            const colorMap = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              red: "bg-red-100 text-red-600",
              yellow: "bg-yellow-100 text-yellow-600",
            };
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex items-center gap-4"
              >
                <div className={`p-3 rounded-full ${colorMap[stat.color]}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>


        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or referral..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option>All</option>
            <option>Active</option>
            <option>Blocked</option>
            <option>KYC Verified</option>
            <option>KYC Pending</option>
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 
            text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 
            rounded-md transition-all duration-200 transform hover:scale-[1.05] 
            active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw className={`w-4 h-4 ${resetSpinning ? "animate-spin-reverse" : ""}`} />
            <span>Reset</span>
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No customers found.</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1"><User className="h-4 w-4" /> Customer</div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1"><Phone className="h-4 w-4" /> Contact</div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1"><Locate className="h-4 w-4" /> Location</div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1"><CircleStar className="h-4 w-4" /> Loyalty Points</div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Status</div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1"><MoreVertical className="h-4 w-4" /> Action</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer.uid} className="hover:bg-gray-50 transition-colors cursor-default">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full object-cover" src={customer.profileImage} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                            <div className="text-sm text-gray-500">{customer.referralCode}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email || "-"}</div>
                        <div className="text-sm text-gray-500">{customer.phone || "-"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.district || "-"}</div>
                        <div className="text-sm text-gray-500">{customer.state || "-"} - {customer.pincode || "-"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{customer.loyaltyPoint || 0}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.isKYCVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{customer.isKYCVerified ? "KYC Verified" : "KYC Pending"}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{customer.isBlocked ? "Blocked" : "Active"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerClick(customer);
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls (inside same card) */}
              <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-700 mb-2 sm:mb-0">
                  <span>Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => handleChangeRowsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {[30, 50, 100].map((num) => <option key={num} value={num}>{num}</option>)}
                  </select>

                  <span className="ml-4 text-sm text-gray-600">
                    Showing {(filteredCustomers.length === 0) ? 0 : (Math.min((currentPage - 1) * rowsPerPage + 1, filteredCustomers.length))} - {Math.min(currentPage * rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span>Page {currentPage} of {totalPages || 1}</span>
                  <div className="flex gap-2">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
