import React, { useState, useContext } from "react";
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
  FileText,
  Gift,
} from "lucide-react";

const presetReasons = [
  "Invalid PAN details",
  "Unclear Aadhaar image",
  "Incorrect bank details",
  "Invalid UPI ID",
  "Name mismatch between PAN and Bank",
];

const CustomerDetails = ({
  customer: initialCustomer,
  onBack,
  onBlockCustomer,
  onKYCAction,
  handleDocumentView,
  actionLoading,
}) => {
  const {
    notifyCustomer,
    notificationLoading,
    addPointsToSpecificCustomer,
    pointsLoading,
    customersList,
  } = useContext(CustomerContext);

  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [bonusAmount, setBonusAmount] = useState("");

  // Get the latest customer data from context
  const customer =
    customersList.find((c) => c.uid === initialCustomer?.uid) ||
    initialCustomer;

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

  const handleGrantBonus = async () => {
    const amount = Number(bonusAmount);

    if (!amount || amount <= 0) {
      return;
    }

    try {
      await addPointsToSpecificCustomer(customer.uid, amount);
      setBonusAmount("");
    } catch (err) {
      console.error("Failed to grant bonus:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-4">
      {/* Single width container for BOTH header and main */}
      <div className="max-w-7xl mx-auto">
        {/* ⭐ Sticky Header ⭐ */}
        <header className="sticky top-0 z-20 pb-3 bg-gradient-to-b from-white/95 to-transparent backdrop-blur">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 shadow-md rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center text-white gap-6">
              {/* Left: Back, Avatar, Name & Badges */}
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all cursor-pointer"
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
                        customer.isKYCverifed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {customer.isKYCverifed ? "KYC Verified" : "KYC Pending"}
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

              {/* Right: Header Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onBlockCustomer(customer.uid)}
                  disabled={actionLoading.block === customer.uid}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-all cursor-pointer ${
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
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-all cursor-pointer ${
                    customer.isKYCverifed
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {actionLoading.kyc === customer.uid ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {customer.isKYCverifed ? "Revoke KYC" : "Verify KYC"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ⭐ Main Content (same width as header, no extra max-w or side padding) ⭐ */}
        <main className="mt-4">
          <div className="space-y-6">
            {/* Row 1: Personal Info + Bank Info (2 cards) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Personal Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
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

              {/* Bank & UPI Info */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
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
            </section>

            {/* Row 2: KYC Documents (1 full-width card) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FileText className="w-5 h-5 mr-2 text-orange-500" />
                KYC Documents
              </h3>

              {/* Aadhaar */}
              <p className="text-sm text-gray-700 mb-3">
                <b>Aadhaar Card</b>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                          className="text-orange-600 text-xs flex items-center gap-1 mb-3 hover:text-orange-700 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" /> View
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* PAN */}
              <p className="text-sm text-gray-700 mb-3">
                <b>PAN Card</b>
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
                    className="text-orange-600 text-xs flex items-center gap-1 mb-3 hover:text-orange-700 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" /> View
                  </button>
                )}
              </div>
            </section>

            {/* Row 3: Bonus + Notification (2 cards) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Grant Bonus */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                  <Gift className="w-5 h-5 mr-2 text-orange-500" />
                  Grant Bonus / Adjust Points
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Bonus Points / Amount
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Enter bonus points (e.g., 100)"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleGrantBonus}
                      disabled={pointsLoading === customer.uid}
                      className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium disabled:opacity-60 cursor-pointer"
                    >
                      {pointsLoading === customer.uid ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Granting Bonus...</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4" />
                          <span>Grant Bonus</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Send Notification */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
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
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-orange-100 rounded-full border border-gray-200 cursor-pointer"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows="3"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Write a custom message..."
                  ></textarea>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSendNotification}
                    disabled={sending || notificationLoading === customer.uid}
                    className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm disabled:opacity-60 cursor-pointer"
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
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDetails;
