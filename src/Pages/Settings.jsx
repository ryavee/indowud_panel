import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import {
  FaEnvelope,
  FaCoins,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const Settings = () => {
  // Get all context values
  const contextValues = useContext(SettingsContext);

  // Destructure with new loading states
  const {
    settings = {},
    loading = false,
    updateUserLoading = false,
    updateRatioRedemptionLoading = false,
    removeUserLoading = false,
    error = null,
    updateUserList,
    updateRatioAndRedemptionLimit,
    removeUserFromRequestList,
    reloadSettings,
  } = contextValues || {};

  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [redemptionLimit, setRedemptionLimit] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Sync API values into local state
  useEffect(() => {
    if (settings) {
      setEmails(Array.isArray(settings.requestTo) ? settings.requestTo : []);
      setRedemptionLimit(settings.redemptionLimit?.toString() || "");
      setCoinValue(settings.ratio?.toString() || "");
    }
  }, [settings]);

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // Check for demo/test emails
  const isDemoEmail = (email) => {
    const blockedDomains = ["example.com", "test.com", "demo.com"];
    return blockedDomains.some((domain) =>
      email.toLowerCase().endsWith(`@${domain}`)
    );
  };

  // Clear error messages
  const clearMessages = () => {
    setEmailError("");
    setSuccessMessage("");
  };

  // Handle adding new email
  const handleAddEmail = async () => {
    if (!newEmail.trim() || !updateUserList) return;

    clearMessages();

    // Validation checks
    if (emails.length >= 5) {
      setEmailError("You can only add up to 5 emails.");
      return;
    }

    if (!isValidEmail(newEmail.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (isDemoEmail(newEmail.trim())) {
      setEmailError("Demo/test emails are not allowed.");
      return;
    }

    if (emails.includes(newEmail.trim())) {
      setEmailError("This email already exists.");
      return;
    }

    const updatedEmails = [...emails, newEmail.trim()];

    try {
      const response = await updateUserList({ requestTo: updatedEmails });

      // Handle response - check if operation was successful
      if (response && response.success !== false) {
        setEmails(updatedEmails);
        setNewEmail("");
        setSuccessMessage("Email added successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to add email";
        setEmailError(errorMessage);
      }
    } catch (err) {
      console.error("Error adding email:", err);
      setEmailError(err?.message || "Failed to add email. Please try again.");
    }
  };

  // Confirm email removal
  const confirmRemoveEmail = (email) => {
    setConfirmDeleteEmail(email);
    clearMessages();
  };

  // Handle confirmed email deletion using the new separate function
  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteEmail || !removeUserFromRequestList) return;

    try {
      const response = await removeUserFromRequestList(confirmDeleteEmail);

      if (response && response.success !== false) {
        // Update local state - the context already handles this, but we'll sync it
        setEmails((prev) =>
          prev.filter((email) => email !== confirmDeleteEmail)
        );
        setConfirmDeleteEmail(null);
        setSuccessMessage("Email removed successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to remove email";
        setEmailError(errorMessage);
      }
    } catch (err) {
      console.error("Error removing email:", err);
      setEmailError(
        err?.message || "Failed to remove email. Please try again."
      );
    } finally {
      setConfirmDeleteEmail(null);
    }
  };

  // Handle saving ratio and redemption limit using the new separate function
  const handleSave = async () => {
    if (!updateRatioAndRedemptionLimit) return;

    clearMessages();

    // Validate inputs
    if (redemptionLimit && isNaN(Number(redemptionLimit))) {
      setEmailError("Redemption limit must be a valid number.");
      return;
    }

    if (coinValue && isNaN(Number(coinValue))) {
      setEmailError("Coin value must be a valid number.");
      return;
    }

    try {
      const ratioValue = coinValue ? Number(coinValue) : 0;
      const limitValue = redemptionLimit ? Number(redemptionLimit) : 0;

      const response = await updateRatioAndRedemptionLimit(
        ratioValue,
        limitValue
      );

      if (response && response.success !== false) {
        setSuccessMessage("Settings updated successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to save settings";
        setEmailError(errorMessage);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setEmailError(
        err?.message || "Failed to save settings. Please try again."
      );
    }
  };

  // Handle Enter key press in email input
  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && !updateUserLoading) {
      handleAddEmail();
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (reloadSettings) {
      reloadSettings();
    } else {
      window.location.reload();
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div
          className="absolute top-2 left-2 w-12 h-12 border-3 border-gray-100 border-b-purple-400 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm font-medium animate-pulse">
            Loading settings...
          </p>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, showRetry = false }) => (
    <div className="p-6 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start space-x-3">
        <FaExclamationCircle className="text-red-500 mt-0.5" size={20} />
        <div className="flex-1">
          <p className="text-red-600 text-sm font-medium mb-2">
            Error: {message}
          </p>
          {showRetry && (
            <button
              onClick={handleRetry}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Success message component
  const SuccessMessage = ({ message }) => (
    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-600 text-sm font-medium">{message}</p>
    </div>
  );

  // Context validation
  if (!contextValues) {
    return (
      <div className="p-4">
        <ErrorMessage
          message="Settings context not found. Please ensure the component is wrapped with SettingsProvider."
          showRetry={true}
        />
      </div>
    );
  }

  if (
    !updateUserList ||
    !updateRatioAndRedemptionLimit ||
    !removeUserFromRequestList
  ) {
    return (
      <div className="p-4">
        <ErrorMessage
          message="Settings context not properly initialized. Please refresh the page."
          showRetry={true}
        />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} showRetry={true} />
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto pt-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Redemption Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your redemption preferences and system values.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && <SuccessMessage message={successMessage} />}

        {/* Error Message */}
        {emailError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-medium">{emailError}</p>
          </div>
        )}

        {/* Emails Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
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

          <div className="flex items-center space-x-2 mb-4">
            <input
              type="email"
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onKeyDown={handleEmailKeyDown}
              disabled={updateUserLoading || emails.length >= 5}
              className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleAddEmail}
              disabled={
                updateUserLoading || !newEmail.trim() || emails.length >= 5
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {updateUserLoading ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  <span>Adding...</span>
                </>
              ) : (
                <span>+ Add</span>
              )}
            </button>
          </div>

          {emails.length >= 5 && (
            <p className="text-sm text-gray-500 mb-4">
              You have reached the maximum of 5 emails.
            </p>
          )}

          {emails.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-800 shadow-sm"
                >
                  <span className="truncate flex-1 mr-2">{email}</span>
                  <button
                    onClick={() => confirmRemoveEmail(email)}
                    disabled={removeUserLoading}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title={`Remove ${email}`}
                  >
                    {removeUserLoading && confirmDeleteEmail === email ? (
                      <FaSpinner className="animate-spin" size={12} />
                    ) : (
                      <FaTrash size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {emails.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FaEnvelope size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                No emails added yet. Add an email to get started.
              </p>
            </div>
          )}
        </div>

        {/* Limits Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Redemption Limit
              </label>
              <input
                type="number"
                value={redemptionLimit}
                onChange={(e) => {
                  setRedemptionLimit(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="Enter limit amount"
                disabled={updateRatioRedemptionLoading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coin Value (Ratio)
              </label>
              <input
                type="number"
                step="0.01"
                value={coinValue}
                onChange={(e) => {
                  setCoinValue(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="Enter coin value"
                disabled={updateRatioRedemptionLoading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={updateRatioRedemptionLoading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {updateRatioRedemptionLoading ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteEmail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"  style={{	 backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 mx-4" >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-medium text-gray-800">
                {confirmDeleteEmail}
              </span>
              ?
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                This action cannot be undone.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteEmail(null)}
                disabled={removeUserLoading}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={removeUserLoading}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 flex items-center space-x-1"
              >
                {removeUserLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={12} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
