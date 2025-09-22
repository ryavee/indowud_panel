import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import { FaEnvelope, FaCoins, FaTrash } from "react-icons/fa";

const Settings = () => {
  const {
    settings,
    loading,
    updateUserLoading,
    error,
    updateUserList,
    fetchSettings,
    fetchedOnce,
  } = useContext(SettingsContext);

  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [redemptionLimit, setRedemptionLimit] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState(null);

  // Fixed useEffect - only fetch if not already fetched
  useEffect(() => {
    if (!fetchedOnce && !loading) {
      fetchSettings();
    }
  }, [fetchSettings, fetchedOnce, loading]);

  // Update local state when settings change
  useEffect(() => {
    if (settings && settings.data) {
      setEmails(settings.data.requestTo || []);
      setRedemptionLimit(settings.data.redemptionLimit || "");
      setCoinValue(settings.data.ratio || "");
    }
  }, [settings]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const isDemoEmail = (email) => {
    const blockedDomains = ["example.com", "test.com", "demo.com"];
    return blockedDomains.some((domain) =>
      email.toLowerCase().endsWith(`@${domain}`)
    );
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) return;

    if (emails.length >= 5) {
      setEmailError("You can only add up to 5 emails.");
      return;
    }

    if (!isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (isDemoEmail(newEmail)) {
      setEmailError("Demo/test emails are not allowed.");
      return;
    }

    if (emails.includes(newEmail)) {
      setEmailError("This email already exists.");
      return;
    }

    const updatedEmails = [...emails, newEmail];

    try {
      await updateUserList({ requestTo: updatedEmails });
      setEmails(updatedEmails);
      setNewEmail("");
      setEmailError("");
    } catch (err) {
      setEmailError("Failed to add email. Please try again.");
    }
  };

  const confirmRemoveEmail = (email) => {
    setConfirmDeleteEmail(email);
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteEmail) return;

    const updatedEmails = emails.filter(
      (email) => email !== confirmDeleteEmail
    );

    try {
      await updateUserList({ requestTo: updatedEmails });
      setEmails(updatedEmails);
      setConfirmDeleteEmail(null);
    } catch (err) {
      setEmailError("Failed to remove email. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        requestTo: emails,
        redemptionLimit,
        ratio: coinValue,
      };
      await updateUserList(updateData);
      // Show success message or handle success
    } catch (err) {
      console.error("Error saving settings:", err);
      setEmailError("Failed to save settings. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>

          {/* Middle rotating ring - opposite direction */}
          <div
            className="absolute top-2 left-2 w-12 h-12 border-3 border-gray-100 border-b-purple-400 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>

          {/* Floating dots around the spinner */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
          </div>
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2">
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <div className="absolute top-1/2 -left-1 transform -translate-y-1/2">
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>

          {/* Loading text with subtle animation */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm font-medium animate-pulse">
              Loading settings...
            </p>
            <div className="flex justify-center mt-2 space-x-1">
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="px-6 pb-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto pt-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Redemption Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your redemption preferences and system values.
        </p>

        {/* Emails Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FaEnvelope className="text-blue-600" size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Redemption Receipt Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Add or remove users who receive redemption request emails.
              </p>
            </div>
          </div>

          <div className="flex items-center mt-4 space-x-2">
            <input
              type="email"
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
              disabled={updateUserLoading || emails.length >= 5}
              className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleAddEmail}
              disabled={
                updateUserLoading || !newEmail.trim() || emails.length >= 5
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateUserLoading ? "Adding..." : "+ Add"}
            </button>
          </div>

          {emailError && (
            <p className="mt-2 text-sm text-red-500">{emailError}</p>
          )}
          {emails.length >= 5 && !emailError && (
            <p className="mt-2 text-sm text-gray-500">
              You have reached the maximum of 5 emails.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-800 shadow-sm"
              >
                <span>{email}</span>
                <button
                  onClick={() => confirmRemoveEmail(email)}
                  disabled={updateUserLoading}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Limits Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <FaCoins className="text-green-600" size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Redemption Limit & Coin Value
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage the limits and value for coin redemptions.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Redemption Limit
              </label>
              <input
                type="text"
                value={redemptionLimit}
                onChange={(e) => setRedemptionLimit(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coin Value
              </label>
              <input
                type="text"
                value={coinValue}
                onChange={(e) => setCoinValue(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={updateUserLoading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateUserLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteEmail && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to remove{" "}
              <span className="font-medium">{confirmDeleteEmail}</span>?
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setConfirmDeleteEmail(null)}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={updateUserLoading}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateUserLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
