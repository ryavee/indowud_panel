import React, { useState, useEffect, useRef, useContext } from "react";
import { CustomerContext } from "../Context/CustomerContext";
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
  Send,
  Bell,
  X,
  IdCard,
  Clock,
} from "lucide-react";

const CustomerDetails = ({
  customer,
  onBack,
  onBlockCustomer,
  onKYCAction,
  handleDocumentView,
  actionLoading,
}) => {
  const [customMessage, setCustomMessage] = useState("");
  const { notifyCustomer, notificationLoading } = useContext(CustomerContext);
  const [sending, setSending] = useState(false);
  const [kycCardHeight, setKycCardHeight] = useState(0);
  const kycCardRef = useRef(null);

  const presetReasons = [
    "Invalid PAN details",
    "Unclear Aadhaar image",
    "Incorrect bank details",
    "Invalid UPI ID",
    "Name mismatch between PAN and Bank",
  ];

  useEffect(() => {
    if (kycCardRef.current) {
      setKycCardHeight(kycCardRef.current.offsetHeight);
    }
  }, [customer]);

  if (!customer) return null;
  const handleSendNotification = async () => {
    if (!customMessage.trim()) return;
    setSending(true);
    try {
      await notifyCustomer(customer.uid, customMessage);
      setCustomMessage("");
    } catch (error) {
      console.error("Failed to send notification:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 shadow-md rounded-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
              title="Back to Customers"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <img
              src={customer.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
            />
            <div>
              <h1 className="text-2xl font-semibold">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-sm text-orange-100">{customer.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                  {customer.loyaltyPoint || 0} Points
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    customer.isKYCVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {customer.isKYCVerified ? "KYC Verified" : "KYC Pending"}
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    customer.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {customer.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onBlockCustomer(customer.uid)}
              disabled={actionLoading.block === customer.uid}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-all ${
                customer.isBlocked
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {actionLoading.block === customer.uid ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {customer.isBlocked ? "Unblock" : "Block"}
            </button>

            <button
              onClick={() => onKYCAction(customer.uid)}
              disabled={actionLoading.kyc === customer.uid}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-all ${
                customer.isKYCVerified
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {actionLoading.kyc === customer.uid ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {customer.isKYCVerified ? "Revoke KYC" : "Verify KYC"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Personal Information
              </h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <p>
                  <Phone className="inline w-4 h-4 mr-2 text-gray-400" />
                  {customer.phone || "Not Provided"}
                </p>
                <p>
                  <Mail className="inline w-4 h-4 mr-2 text-gray-400" />
                  {customer.email || "Not Provided"}
                </p>
                <p>
                  <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
                  {customer.district || "N/A"}, {customer.state || "N/A"} -{" "}
                  {customer.pincode || "N/A"}
                </p>
              </div>
            </div>

            {/* KYC Documents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-grow">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <IdCard className="w-5 h-5 mr-2 text-orange-500" />
                KYC Documents
              </h3>

              <p className="text-sm text-gray-700 mb-3">
                <b>Aadhaar Number:</b>{" "}
                {customer.aadhaarNumber || "Not Provided"}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {["Front", "Back"].map((side) => {
                  const key =
                    side === "Front"
                      ? "aadhaarCardFrontImage"
                      : "aadhaarCardBackImage";
                  const img = customer[key];
                  return (
                    <div
                      key={side}
                      className="rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-between"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Aadhaar ${side}`}
                          className="h-32 w-auto object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="h-32 flex items-center justify-center text-gray-400 text-xs">
                          No {side} Image
                        </div>
                      )}
                      <div className="text-xs py-2 text-gray-600">{side}</div>
                      {img && (
                        <button
                          onClick={() => handleDocumentView(img)}
                          className="text-orange-600 text-xs flex items-center gap-1 mb-3 hover:text-orange-700"
                        >
                          <ExternalLink className="w-3 h-3" /> View
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-gray-700 mb-3">
                <b>PAN Number:</b> {customer.panNumber || "Not Provided"}
              </p>

              <div className="rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-between">
                {customer.panCardImage ? (
                  <img
                    src={customer.panCardImage}
                    alt="PAN Card"
                    className="h-32 w-auto object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400 text-xs">
                    No PAN Image
                  </div>
                )}
                {customer.panCardImage && (
                  <button
                    onClick={() => handleDocumentView(customer.panCardImage)}
                    className="text-orange-600 text-xs flex items-center gap-1 mb-3 hover:text-orange-700"
                  >
                    <ExternalLink className="w-3 h-3" /> View
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Bank & UPI Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <CreditCard className="w-5 h-5 mr-2 text-orange-500" />
                Bank & UPI Information
              </h3>

              <div className="space-y-2 text-gray-700 text-sm leading-6">
                <p>
                  <b>Account Holder:</b>{" "}
                  {customer.bankDetails?.accountHolder || "Not Provided"}
                </p>
                <p>
                  <b>Account Type:</b>{" "}
                  {customer.bankDetails?.accountType || "Not Provided"}
                </p>
                <p>
                  <b>Account Number:</b>{" "}
                  {customer.bankDetails?.accountNumber || "Not Provided"}
                </p>
                <p>
                  <b>Bank Name:</b>{" "}
                  {customer.bankDetails?.bankName || "Not Provided"}
                </p>
                <p>
                  <b>IFSC Code:</b>{" "}
                  {customer.bankDetails?.ifscCode || "Not Provided"}
                </p>
                <p>
                  <b>UPI ID:</b> {customer.upiId || "Not Provided"}
                </p>
                <p>
                  <b>UPI Number:</b> {customer.upiNumber || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Send Notification Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Send Notification to {customer.firstName}
                </h3>

                <p className="text-sm text-gray-600 font-medium mb-2">
                  Quick Reasons:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetReasons.map((reason, i) => (
                    <button
                      key={i}
                      onClick={() => setCustomMessage(reason)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-orange-100 rounded-full border border-gray-200"
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <textarea
                  rows="3"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500"
                  placeholder="Write a custom message..."
                ></textarea>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSendNotification}
                  disabled={sending || notificationLoading === customer.uid}
                  className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm disabled:opacity-60"
                >
                  {sending || notificationLoading === customer.uid ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sending ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
