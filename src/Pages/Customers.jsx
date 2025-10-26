import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  User,
  Phone,
  Locate,
  CheckCircle,
  CircleStar,
  MoreVertical,
  RotateCcw,
  Search,
  IdCard,
  Lock,
  Unlock,
  Users as UsersIcon,
  Loader2,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

import { CustomerContext } from "../Context/CustomerContext";
import CustomerDetails from "../Components/CustomerDetails";
import Pagination from "../Components/Reusable/Pagination";
import ExportButton from "../Components/export_button";
import ImportButton from "../Components/Import_button";

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [resetSpinning, setResetSpinning] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    block: null,
    kyc: null,
  });

  const {
    customersList = [],
    loading,
    blockLoading,
    kycLoading,
    blockAppCustomer,
    kycVerification,
    uploadCustomersData,
    importLoading,
  } = useContext(CustomerContext);

  const totalCustomers = customersList.length;
  const kycVerified = customersList.filter((c) => c.isKYCVerified).length;
  const blockedUsers = customersList.filter((c) => c.isBlocked).length;
  const activeUsers = totalCustomers - blockedUsers;

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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setResetSpinning(true);
    setCurrentPage(1);
    setTimeout(() => setResetSpinning(false), 600);
  };

  const handleCustomerClick = (customer) => setSelectedCustomer(customer);
  const handleBackClick = () => setSelectedCustomer(null);

  const handleBlockCustomer = async (customerId) => {
    const customer = customersList.find((c) => c.uid === customerId);
    if (!customer) return;

    const prevStatus = customer.isBlocked;
    const newStatus = !prevStatus;

    setSelectedCustomer((prev) =>
      prev && prev.uid === customerId ? { ...prev, isBlocked: newStatus } : prev
    );
    customersList.forEach((c) => {
      if (c.uid === customerId) c.isBlocked = newStatus;
    });

    setActionLoading((prev) => ({ ...prev, block: customerId }));
    try {
      await blockAppCustomer(customerId, newStatus);
    } catch {
      setSelectedCustomer((prev) =>
        prev && prev.uid === customerId
          ? { ...prev, isBlocked: prevStatus }
          : prev
      );
      customersList.forEach((c) => {
        if (c.uid === customerId) c.isBlocked = prevStatus;
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, block: null }));
    }
  };

  const handleKYCAction = async (customerId) => {
    const customer = customersList.find((c) => c.uid === customerId);
    if (!customer) return;

    const prevStatus = customer.isKYCVerified;
    const newStatus = !prevStatus;

    setSelectedCustomer((prev) =>
      prev && prev.uid === customerId
        ? { ...prev, isKYCVerified: newStatus }
        : prev
    );
    customersList.forEach((c) => {
      if (c.uid === customerId) c.isKYCVerified = newStatus;
    });

    setActionLoading((prev) => ({ ...prev, kyc: customerId }));
    try {
      await kycVerification(customerId, newStatus);
    } catch {
      setSelectedCustomer((prev) =>
        prev && prev.uid === customerId
          ? { ...prev, isKYCVerified: prevStatus }
          : prev
      );
      customersList.forEach((c) => {
        if (c.uid === customerId) c.isKYCVerified = prevStatus;
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, kyc: null }));
    }
  };

  const handleDocumentView = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (selectedCustomer) {
    return (
      <CustomerDetails
        customer={selectedCustomer}
        onBack={handleBackClick}
        onBlockCustomer={handleBlockCustomer}
        onKYCAction={handleKYCAction}
        handleDocumentView={handleDocumentView}
        actionLoading={actionLoading}
        blockLoading={blockLoading}
        kycLoading={kycLoading}
      />
    );
  }
  const exportColumns = [
    { key: "firstName", header: "First Name" },
    { key: "lastName", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "district", header: "District" },
    { key: "state", header: "State" },
    { key: "pincode", header: "Pincode" },
    { key: "loyaltyPoint", header: "Loyalty Points" },
    {
      key: "isKYCVerified",
      header: "KYC Status",
      formatter: (value) => (value ? "Verified" : "Pending"),
    },
    {
      key: "isBlocked",
      header: "Account Status",
      formatter: (value) => (value ? "Blocked" : "Active"),
    },
  ];
  const requiredHeaders = exportColumns
    .filter(
      (col) =>
        !["Account Status", "KYC Status", "Loyalty Points"].includes(col.header)
    )
    .map((col) => col.header);

  const handleCSVUpload = async (file) => {
    try {
      const response = await uploadCustomersData(file);
      const { summary, failed } = response.result;

      if (summary.uploaded > 0) {
        toast.success(`${summary.uploaded} customers imported successfully`);
      }

      if (failed.length > 0) {
        failed.forEach((f) => {
          toast.error(`Failed to import ${f.phone}: ${f.reason}`);
        });
      }

      if (summary.skipped > 0) {
        toast.info(`${summary.skipped} customers skipped`);
      }
    } catch (error) {
      toast.error("Unexpected error during import");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage users, verify KYC, and monitor loyalty activities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Customers",
              value: totalCustomers,
              icon: UsersIcon,
              color: "orange",
            },
            {
              title: "KYC Verified",
              value: kycVerified,
              icon: IdCard,
              color: "teal",
            },
            {
              title: "Blocked Users",
              value: blockedUsers,
              icon: Lock,
              color: "red",
            },
            {
              title: "Active Users",
              value: activeUsers,
              icon: Unlock,
              color: "green",
            },
          ].map((stat, i) => {
            const colorMap = {
              orange: "bg-orange-100 text-orange-600",
              teal: "bg-teal-100 text-teal-600",
              red: "bg-red-100 text-red-600",
              green: "bg-green-100 text-green-600",
            };
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center gap-4"
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
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or referral..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
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
            className="flex items-center justify-center gap-1.5 px-4 py-2 
            text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white 
            rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-orange-400 transition-transform hover:scale-[1.05]"
          >
            <RotateCcw
              className={`w-4 h-4 ${
                resetSpinning ? "animate-spin-reverse" : ""
              }`}
            />
            Reset
          </button>
          <ExportButton
            data={filteredCustomers}
            columns={exportColumns}
            filename="customers"
            disabled={filteredCustomers.length === 0}
          />

          <ImportButton
            requiredHeaders={requiredHeaders}
            onUpload={handleCSVUpload}
            label="Import CSV"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No customers found.
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" /> Customer
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" /> Contact
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Locate className="h-4 w-4" /> Location
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <CircleStar className="h-4 w-4" /> Loyalty Points
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
                  {paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.uid}
                      className="hover:bg-orange-50/40 transition-all"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={customer.profileImage}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.referralCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.email || "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.phone || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.district || "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.state || "-"} - {customer.pincode || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {customer.loyaltyPoint || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.isKYCVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {customer.isKYCVerified
                              ? "KYC Verified"
                              : "KYC Pending"}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.isBlocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {customer.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerClick(customer);
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
    </div>
  );
};

export default Customers;
