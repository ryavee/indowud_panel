import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import {
  FaEnvelope,
  FaCoins,
  FaSpinner,
  FaExclamationCircle,
  FaGift,
} from "react-icons/fa";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import ConfirmationModal from "../Components/ConfirmationModal";

const Settings = () => {
  const contextValues = useContext(SettingsContext);

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
  const [referralPoints, setReferralPoints] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // NEW: local UI loaders so each button shows its own loader
  const [savingLimits, setSavingLimits] = useState(false);
  const [savingReferral, setSavingReferral] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (settings) {
      setEmails(Array.isArray(settings.requestTo) ? settings.requestTo : []);
      setRedemptionLimit(settings.redemptionLimit?.toString() || "");
      setCoinValue(settings.ratio?.toString() || "");
      setReferralPoints(
        settings.referralPoints !== undefined && settings.referralPoints !== null
          ? String(settings.referralPoints)
          : ""
      );
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

  const clearMessages = () => {
    setEmailError("");
    setSuccessMessage("");
  };

  // Add email — immediately saves via updateUserList
  const handleAddEmail = async () => {
    if (!newEmail.trim() || !updateUserList) return;

    clearMessages();

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

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && !updateUserLoading) {
      handleAddEmail();
    }
  };

  const confirmRemoveEmail = (email) => {
    setConfirmDeleteEmail(email);
    clearMessages();
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteEmail || !removeUserFromRequestList) return;

    try {
      const response = await removeUserFromRequestList(confirmDeleteEmail);

      if (response && response.success !== false) {
        setEmails((prev) => prev.filter((email) => email !== confirmDeleteEmail));
        setConfirmDeleteEmail(null);
        setSuccessMessage("Email removed successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to remove email";
        setEmailError(errorMessage);
      }
    } catch (err) {
      console.error("Error removing email:", err);
      setEmailError(err?.message || "Failed to remove email. Please try again.");
    } finally {
      setConfirmDeleteEmail(null);
    }
  };

  // Save limits (coinValue + redemptionLimit). We preserve referralPoints by passing current referral value.
  const handleSaveLimits = async () => {
    if (!updateRatioAndRedemptionLimit) return;

    clearMessages();

    if (redemptionLimit && isNaN(Number(redemptionLimit))) {
      setEmailError("Redemption limit must be a valid number.");
      return;
    }
    if (coinValue && isNaN(Number(coinValue))) {
      setEmailError("Coin value must be a valid number.");
      return;
    }

    setSavingLimits(true);
    try {
      const ratioValue = coinValue ? Number(coinValue) : 0;
      const limitValue = redemptionLimit ? Number(redemptionLimit) : 0;
      const referralValue = referralPoints ? Number(referralPoints) : 0;

      const response = await updateRatioAndRedemptionLimit(
        ratioValue,
        limitValue,
        referralValue
      );

      if (response && response.success !== false) {
        setSuccessMessage("Limits & coin value saved.");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to save limits";
        setEmailError(errorMessage);
      }
    } catch (err) {
      console.error("Error saving limits:", err);
      setEmailError(err?.message || "Failed to save limits. Please try again.");
    } finally {
      setSavingLimits(false);
    }
  };

  // Save only referral points: preserve ratio & limit by passing current values.
  const handleSaveReferral = async () => {
    if (!updateRatioAndRedemptionLimit) return;

    clearMessages();

    if (referralPoints && isNaN(Number(referralPoints))) {
      setEmailError("Referral points must be a valid number.");
      return;
    }

    setSavingReferral(true);
    try {
      const ratioValue =
        coinValue !== "" ? Number(coinValue) : Number(settings.ratio || 0);
      const limitValue =
        redemptionLimit !== ""
          ? Number(redemptionLimit)
          : Number(settings.redemptionLimit || 0);
      const referralValue = referralPoints ? Number(referralPoints) : 0;

      const response = await updateRatioAndRedemptionLimit(
        ratioValue,
        limitValue,
        referralValue
      );

      if (response && response.success !== false) {
        setSuccessMessage("Referral points saved.");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to save referral points";
        setEmailError(errorMessage);
      }
    } catch (err) {
      console.error("Error saving referral points:", err);
      setEmailError(
        err?.message || "Failed to save referral points. Please try again."
      );
    } finally {
      setSavingReferral(false);
    }
  };

  const handleRetry = () => {
    if (reloadSettings) {
      reloadSettings();
    } else {
      window.location.reload();
    }
  };

  const ErrorMessage = ({ message, showRetry = false }) => (
    <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm max-w-2xl mx-auto">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <FaExclamationCircle className="text-red-500" size={28} />
        </div>
        <div className="flex-1">
          <h4 className="text-red-800 font-semibold mb-1">Something went wrong</h4>
          <p className="text-sm text-red-700 mb-4">{message}</p>
          {showRetry && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const SuccessMessage = ({ message }) => (
    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md max-w-3xl mx-auto">
      <p className="text-green-600 text-sm font-medium">{message}</p>
    </div>
  );

  if (!contextValues) {
    return (
      <div className="p-6">
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
      <div className="p-6">
        <ErrorMessage
          message="Settings context not properly initialized. Please refresh the page."
          showRetry={true}
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner centered message="Loading settings..." />;
  }


  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} showRetry={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            Redemption Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage email recipients, redemption limits, coin value, and referral points.
          </p>
        </div>
      </div>

      {successMessage && <SuccessMessage message={successMessage} />}
      {emailError && (
        <div className="max-w-3xl mx-auto">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm font-medium">{emailError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Emails */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FaEnvelope />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Redemption Receipt Recipients</h2>
              <p className="text-sm text-gray-500">Add up to 5 emails — saved immediately when you add.</p>
            </div>
          </div>

          <div className="flex gap-2 items-center mb-4">
            <input
              type="email"
              placeholder="user@gmail.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onKeyDown={handleEmailKeyDown}
              disabled={updateUserLoading || emails.length >= 5}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm transition-all"
            />
            <button
              onClick={handleAddEmail}
              disabled={
                updateUserLoading || !newEmail.trim() || emails.length >= 5
              }
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {updateUserLoading ? (
                <span className="inline-flex items-center gap-2"><FaSpinner className="animate-spin" /> Adding</span>
              ) : (
                "+ Add"
              )}
            </button>
          </div>

          {emails.length >= 5 && (
            <p className="text-xs text-gray-500 mb-3">Maximum of 5 emails reached.</p>
          )}

          <div className="space-y-2">
            {emails.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <FaEnvelope className="mx-auto mb-2 text-2xl opacity-60" />
                <div className="text-sm">No emails added yet</div>
              </div>
            ) : (
              emails.map((email, idx) => (
                <div
                  key={email}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-400">#{idx + 1}</div>
                    <div className="text-sm font-medium text-gray-800">{email}</div>
                  </div>

                  <button
                    onClick={() => confirmRemoveEmail(email)}
                    disabled={removeUserLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-md transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    title={`Remove ${email}`}
                    style={{ lineHeight: 1 }}
                  >
                    {removeUserLoading && confirmDeleteEmail === email ? (
                      <FaSpinner className="animate-spin text-sm" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>

                </div>
              ))
            )}
          </div>
        </div>

        {/* Limits & Referral */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-50 text-green-600"><FaCoins /></div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Redemption Limits & Coin Value</h2>
                <p className="text-sm text-gray-500">Control redemption limit and coin-to-rupee ratio.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Redemption Limit</label>
                <input
                  type="number"
                  value={redemptionLimit}
                  onChange={(e) => {
                    setRedemptionLimit(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="e.g., 1000"
                  disabled={updateRatioRedemptionLoading || savingLimits}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Limit for redemptions (admin-controlled).</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Coin Value (Ratio)</label>
                <input
                  type="number"
                  step="0.01"
                  value={coinValue}
                  onChange={(e) => {
                    setCoinValue(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="e.g., 0.5"
                  disabled={updateRatioRedemptionLoading || savingLimits}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">How much 1 point equals in rupees (or other unit).</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveLimits}
                disabled={updateRatioRedemptionLoading || savingLimits}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#169698] rounded-lg hover:bg-[#128083] shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {(savingLimits || updateRatioRedemptionLoading) ? (
                  <span className="inline-flex items-center gap-2"><FaSpinner className="animate-spin" /> Saving</span>
                ) : (
                  "Save Limits"
                )}
              </button>
            </div>
          </div>
          {/* referral points */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><FaGift /></div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Referral Points</h2>
                <p className="text-sm text-gray-500">Points awarded to a referrer when a customer uses a referral code.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Referral Points</label>
                <input
                  type="number"
                  value={referralPoints}
                  onChange={(e) => {
                    setReferralPoints(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="e.g., 50"
                  disabled={updateRatioRedemptionLoading || savingReferral}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">How many points to give per successful referral.</p>
              </div>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setReferralPoints("")}
                  className="px-4 py-2 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center justify-center cursor-pointer"
                >
                  Reset
                </button>

                <button
                  onClick={handleSaveReferral}
                  disabled={updateRatioRedemptionLoading || savingReferral}
                  className="flex items-center justify-center gap-2 px-5 py-2 h-10 text-sm font-medium text-white bg-[#169698] rounded-lg hover:bg-[#128083] shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  {savingReferral ? (
                    <span className="inline-flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Saving
                    </span>
                  ) : (
                    "Save Referral"
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal component */}
      <ConfirmationModal
        isOpen={!!confirmDeleteEmail}
        title="Confirm Removal"
        message={
          confirmDeleteEmail ? (
            <span>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-[#169698]">{confirmDeleteEmail}</span>{" "}
              from the recipients?
              <br />
              <span className="text-gray-600">This action cannot be undone.</span>
            </span>
          ) : (
            ""
          )
        }
        onCancel={() => setConfirmDeleteEmail(null)}
        onConfirm={handleDeleteConfirmed}
        isLoading={removeUserLoading}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />

    </div>
  );
};

export default Settings;
