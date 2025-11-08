import { useContext, useEffect, useState, useMemo } from "react";
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
import toast, { Toaster } from "react-hot-toast";

const Settings = () => {
  const contextValues = useContext(SettingsContext);

  const {
    settings = {},
    loading = false,
    updateUserLoading = false,
    updateRatioRedemptionLoading = false,
    removeUserLoading = false,
    updateReferralLoading = false,
    error = null,
    updateRequestTo,
    updateRatioAndRedemptionLimit,
    removeUserFromRequestList,
    reloadSettings,
    updateReferralPoints,
  } = contextValues || {};

  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [redemptionLimit, setRedemptionLimit] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [referralPoints, setReferralPoints] = useState("");
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState(null);

  const [savingLimits, setSavingLimits] = useState(false);

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

  const handleAddEmail = async () => {
    if (!newEmail.trim() || !updateRequestTo) return;

    if (emails.length >= 5) {
      toast.error("You can only add up to 5 emails.");
      return;
    }

    if (!isValidEmail(newEmail.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (isDemoEmail(newEmail.trim())) {
      toast.error("Demo/test emails are not allowed.");
      return;
    }

    if (emails.includes(newEmail.trim())) {
      toast.error("This email already exists.");
      return;
    }

    const updatedEmails = [...emails, newEmail.trim()];

    try {
      // Pass the array directly to updateRequestTo
      const response = await updateRequestTo(updatedEmails);

      if (response && response.success !== false) {
        setNewEmail("");
        toast.success("Email added successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to add email";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error adding email:", err);
      toast.error(err?.message || "Failed to add email. Please try again.");
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter" && !updateUserLoading) {
      handleAddEmail();
    }
  };

  const confirmRemoveEmail = (email) => {
    setConfirmDeleteEmail(email);
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteEmail || !removeUserFromRequestList) return;

    try {
      const response = await removeUserFromRequestList(confirmDeleteEmail);

      if (response && response.success !== false) {
        setConfirmDeleteEmail(null);
        toast.success("Email removed successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to remove email";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error removing email:", err);
      toast.error(err?.message || "Failed to remove email. Please try again.");
    } finally {
      setConfirmDeleteEmail(null);
    }
  };

  const handleSaveLimits = async () => {
    if (!updateRatioAndRedemptionLimit) return;

    if (redemptionLimit && isNaN(Number(redemptionLimit))) {
      toast.error("Redemption limit must be a valid number.");
      return;
    }
    if (coinValue && isNaN(Number(coinValue))) {
      toast.error("Coin value must be a valid number.");
      return;
    }

    setSavingLimits(true);
    try {
      const ratioValue = coinValue ? Number(coinValue) : 0;
      const limitValue = redemptionLimit ? Number(redemptionLimit) : 0;

      const response = await updateRatioAndRedemptionLimit(
        ratioValue,
        limitValue
      );

      if (response && response.success !== false) {
        toast.success("Limits & coin value saved successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to save limits";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error saving limits:", err);
      toast.error(err?.message || "Failed to save limits. Please try again.");
    } finally {
      setSavingLimits(false);
    }
  };

  const finalValue = useMemo(() => {
    const r = Number(redemptionLimit);
    const ratio = Number(coinValue);
    if (!isFinite(r) || !isFinite(ratio) || r <= 0 || ratio <= 0) return 0;
    return r * ratio;
  }, [redemptionLimit, coinValue]);

  const handleSaveReferral = async () => {
    if (!updateReferralPoints) return;

    if (referralPoints && isNaN(Number(referralPoints))) {
      toast.error("Referral points must be a valid number.");
      return;
    }

    try {
      const referralValue = referralPoints ? Number(referralPoints) : 0;
      const response = await updateReferralPoints(referralValue);

      if (response && response.success !== false) {
        toast.success("Referral points saved successfully!");
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to save referral points";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error saving referral points:", err);
      toast.error(
        err?.message || "Failed to save referral points. Please try again."
      );
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
    !updateRequestTo ||
    !updateRatioAndRedemptionLimit ||
    !removeUserFromRequestList ||
    !updateReferralPoints
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
    return <LoadingSpinner centered message="Loading Settings..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} showRetry={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Emails */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FaEnvelope />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Redemption Receipt Recipients</h2>
            </div>
          </div>

          <div className="flex gap-2 items-center mb-4">
            <input
              type="email"
              placeholder="user@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleEmailKeyDown}
              disabled={updateUserLoading || emails.length >= 5}
              className="flex-1 px-4 py-2 border border-[#00A9A3]/40 rounded-lg text-sm text-gray-800
                             focus:border-[#00A9A3] focus:ring-2 focus:ring-[#00A9A3]/50
                             focus:outline-none shadow-sm transition-all placeholder:text-gray-400
                             disabled:bg-gray-100 disabled:text-gray-500"
            />
            <button
              onClick={handleAddEmail}
              disabled={
                updateUserLoading || !newEmail.trim() || emails.length >= 5
              }
              className="px-4 py-2 bg-[#169698] hover:bg-[#128083] text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {updateUserLoading ? (
                <span className="inline-flex items-center gap-2">
                  <FaSpinner className="animate-spin" /> Adding
                </span>
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <FaCoins />
              </div>
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
                  onChange={(e) => setRedemptionLimit(e.target.value)}
                  placeholder="e.g., 1000"
                  disabled={updateRatioRedemptionLoading || savingLimits}
                  className="flex-1 px-4 py-2 border border-[#00A9A3]/40 rounded-lg text-sm text-gray-800
                             focus:border-[#00A9A3] focus:ring-2 focus:ring-[#00A9A3]/50
                             focus:outline-none shadow-sm transition-all placeholder:text-gray-400
                             disabled:bg-gray-100 disabled:text-gray-500 w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Limit for redemptions (admin-controlled).</p>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Coin Value (Ratio)</label>
                <input
                  type="number"
                  step="0.01"
                  value={coinValue}
                  onChange={(e) => setCoinValue(e.target.value)}
                  placeholder="e.g., 0.5"
                  disabled={updateRatioRedemptionLoading || savingLimits}
                  className="flex-1 px-4 py-2 border border-[#00A9A3]/40 rounded-lg text-sm text-gray-800
                             focus:border-[#00A9A3] focus:ring-2 focus:ring-[#00A9A3]/50
                             focus:outline-none shadow-sm transition-all placeholder:text-gray-400
                             disabled:bg-gray-100 disabled:text-gray-500 w-full"
                />
                <p className="text-xs text-gray-400 mt-1">How much 1 point equals in rupees (or other unit).</p>
              </div>
            </div>

            {/* computed final value preview */}
            <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-gray-400">Estimated value</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(finalValue)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {redemptionLimit && coinValue ? (
                    <>Based on {redemptionLimit} pts × {coinValue} ₹/pt</>
                  ) : (
                    <>Enter both fields to calculate</>
                  )}
                </p>
              </div>
            </div>


            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveLimits}
                disabled={updateRatioRedemptionLoading || savingLimits || finalValue <= 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#169698] rounded-lg hover:bg-[#128083] shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {(savingLimits || updateRatioRedemptionLoading) ? (
                  <span className="inline-flex items-center gap-2">
                    <FaSpinner className="animate-spin" /> Saving
                  </span>
                ) : finalValue <= 0 ? (
                  <span className="text-sm">Enter valid limit & ratio</span>
                ) : (
                  "Save Limits"
                )}

              </button>
            </div>
          </div>

          {/* Referral Points */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <FaGift />
              </div>
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
                  onChange={(e) => setReferralPoints(e.target.value)}
                  placeholder="e.g., 50"
                  disabled={updateReferralLoading}
                  className="flex-1 px-4 py-2 border border-[#00A9A3]/40 rounded-lg text-sm text-gray-800
                             focus:border-[#00A9A3] focus:ring-2 focus:ring-[#00A9A3]/50
                             focus:outline-none shadow-sm transition-all placeholder:text-gray-400
                             disabled:bg-gray-100 disabled:text-gray-500 w-full"
                />
                <p className="text-xs text-gray-400 mt-1">How many points to give per successful referral.</p>
              </div>
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  onClick={() => setReferralPoints("")}
                  disabled={updateReferralLoading}
                  className="px-4 py-2 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  onClick={handleSaveReferral}
                  disabled={updateReferralLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2 h-10 text-sm font-medium text-white bg-[#169698] rounded-lg hover:bg-[#128083] shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {updateReferralLoading ? (
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

      {/* Delete Confirmation Modal */}
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