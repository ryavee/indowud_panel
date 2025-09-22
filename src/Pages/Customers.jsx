import React, { useState, useContext, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Shield,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { CustomerContext } from "../Context/CustomerContext";

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    block: null,
    kyc: null,
  });
  const {
    customersList,
    loading,
    blockLoading,
    kycLoading,
    blockAppCustomer,
    kycVerification,
  } = useContext(CustomerContext);

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  useEffect(() => {
    if (selectedCustomer) {
      const updatedCustomer = customersList.find(
        (c) => c.uid === selectedCustomer.uid
      );
      if (updatedCustomer) {
        setSelectedCustomer(updatedCustomer);
      }
    }
  }, [customersList, selectedCustomer?.uid]);

  const handleBackClick = () => {
    setSelectedCustomer(null);
  };

  const handleBlockCustomer = async (customerId) => {
    setActionLoading((prev) => ({ ...prev, block: customerId }));
    try {
      const customer = customersList.find((c) => c.uid === customerId);
      const currentBlockStatus = customer?.isBlocked || false;

      await blockAppCustomer(customerId, !currentBlockStatus);
    } catch (error) {
      console.error("Error blocking/unblocking customer:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, block: null }));
    }
  };

  const handleKYCAction = async (customerId) => {
    setActionLoading((prev) => ({ ...prev, kyc: customerId }));
    try {
      const customer = customersList.find((c) => c.uid === customerId);
      const currentKYCStatus = customer?.isKYCVerified || false;

      await kycVerification(customerId, !currentKYCStatus);
    } catch (error) {
      console.error("Error with KYC verification:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, kyc: null }));
    }
  };

  // Function to handle document URL opening
  const handleDocumentView = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading customers...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCustomer) {
    return (
      <>
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
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
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCustomer.isKYCVerified
                        ? "bg-green-400 text-green-900"
                        : "bg-yellow-400 text-yellow-900"
                    }`}
                  >
                    {selectedCustomer.isKYCVerified
                      ? "KYC Verified"
                      : "KYC Pending"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCustomer.isBlocked
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
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedCustomer.aadhaarCardFrontImage
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
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedCustomer.aadhaarCardBackImage
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
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedCustomer.panCardImage
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
              <button
                onClick={() => handleBlockCustomer(selectedCustomer.uid)}
                disabled={
                  actionLoading.block === selectedCustomer.uid ||
                  blockLoading === selectedCustomer.uid
                }
                className={`px-6 py-2 rounded-lg font-medium flex items-center transition-all ${
                  selectedCustomer.isBlocked
                    ? "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400"
                    : "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {actionLoading.block === selectedCustomer.uid ||
                blockLoading === selectedCustomer.uid ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {actionLoading.block === selectedCustomer.uid ||
                blockLoading === selectedCustomer.uid
                  ? "Processing..."
                  : selectedCustomer.isBlocked
                  ? "Unblock Customer"
                  : "Block Customer"}
              </button>

              <button
                onClick={() => handleKYCAction(selectedCustomer.uid)}
                disabled={
                  actionLoading.kyc === selectedCustomer.uid ||
                  kycLoading === selectedCustomer.uid
                }
                className={`px-6 py-2 rounded-lg font-medium flex items-center transition-all ${
                  selectedCustomer.isKYCVerified
                    ? "bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {actionLoading.kyc === selectedCustomer.uid ||
                kycLoading === selectedCustomer.uid ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 mr-2" />
                )}
                {actionLoading.kyc === selectedCustomer.uid ||
                kycLoading === selectedCustomer.uid
                  ? "Processing..."
                  : selectedCustomer.isKYCVerified
                  ? "Revoke KYC"
                  : "Verify KYC"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Customers ({customersList.length})
          </h3>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          {customersList.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No customers found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loyalty Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customersList.map((customer) => (
                  <tr
                    key={customer.uid}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleCustomerClick(customer)}
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
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
