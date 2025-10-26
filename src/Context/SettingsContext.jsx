// Context/SettingsContext.js
import { createContext, useState, useCallback, useEffect } from "react";
import {
  loadSettings,
  updateRequestUsers,
  updateRatioRedemptionLimit,
  removeRequestUsers,
  updateRefferalPoint,
} from "../Services/settingsService";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    ratio: 0,
    redemptionLimit: 0,
    requestTo: [],
    referralPoints: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [updateRatioRedemptionLoading, setUpdateRatioRedemptionLoading] =
    useState(false);
  const [updateReferralLoading, setUpdateReferralLoading] = useState(false);
  const [removeUserLoading, setRemoveUserLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await loadSettings();

        if (response && response.success !== false) {
          setSettings({
            ratio: response.ratio || 0,
            redemptionLimit: response.redemptionLimit || 0,
            requestTo: response.requestTo || [],
            referralPoints: response.referralPoints || 0,
          });
        } else {
          const message =
            response?.message || response?.error || "Failed to load settings";
          setError(message);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError(err.message || "Error loading settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Local state updates
  const updateRatio = useCallback(
    (newRatio) => setSettings((prev) => ({ ...prev, ratio: newRatio })),
    []
  );

  const updateRedemptionLimit = useCallback(
    (newLimit) =>
      setSettings((prev) => ({ ...prev, redemptionLimit: newLimit })),
    []
  );

  // ✅ Update referral points
  const updateReferralPoints = useCallback(async (newPoints) => {
    try {
      setUpdateReferralLoading(true);
      setError(null);

      const response = await updateRefferalPoint(newPoints);

      if (response?.success) {
        // Use server value if returned (optional, here we keep newPoints)
        setSettings((prev) => ({ ...prev, referralPoints: newPoints }));
        return response;
      } else {
        const message =
          response?.message ||
          response?.error ||
          "Failed to update referral points";
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      console.error("Error updating referral points:", err);
      setError(err.message || "Error updating referral points");
      throw err;
    } finally {
      setUpdateReferralLoading(false);
    }
  }, []);

  // ✅ Update email recipients
  const updateRequestTo = useCallback(async (newRequestUsers) => {
    try {
      setUpdateUserLoading(true);
      setError(null);

      const response = await updateRequestUsers(newRequestUsers);
      if (response && response.success !== false) {
        setSettings((prev) => ({ ...prev, requestTo: newRequestUsers }));
        return response;
      } else {
        const message =
          response?.message ||
          response?.error ||
          "Failed to update request users";
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      console.error("Error updating request users:", err);
      setError(err.message || "Error updating request users");
      throw err;
    } finally {
      setUpdateUserLoading(false);
    }
  }, []);

  // ✅ Update ratio & redemption limit together
  const updateRatioAndRedemptionLimit = useCallback(
    async (ratio, redemptionLimit) => {
      try {
        setUpdateRatioRedemptionLoading(true);
        setError(null);

        const response = await updateRatioRedemptionLimit(
          ratio,
          redemptionLimit
        );
        if (response && response.success !== false) {
          setSettings((prev) => ({
            ...prev,
            ratio,
            redemptionLimit,
          }));
          return response;
        } else {
          const message =
            response?.message ||
            response?.error ||
            "Failed to update ratio and redemption limit";
          setError(message);
          return { success: false, error: message };
        }
      } catch (err) {
        console.error("Error updating ratio/redemption limit:", err);
        setError(err.message || "Error updating ratio and redemption limit");
        throw err;
      } finally {
        setUpdateRatioRedemptionLoading(false);
      }
    },
    []
  );

  // ✅ Remove email recipient
  const removeUserFromRequestList = useCallback(async (emailToRemove) => {
    try {
      setRemoveUserLoading(true);
      setError(null);

      const response = await removeRequestUsers(emailToRemove);
      if (response && response.success !== false) {
        setSettings((prev) => ({
          ...prev,
          requestTo: prev.requestTo.filter((email) => email !== emailToRemove),
        }));
        return response;
      } else {
        const message =
          response?.message || response?.error || "Failed to remove user";
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      console.error("Error removing user:", err);
      setError(err.message || "Error removing user");
      throw err;
    } finally {
      setRemoveUserLoading(false);
    }
  }, []);

  // ✅ Reload settings
  const reloadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await loadSettings();
      if (response && response.success !== false) {
        setSettings({
          ratio: response.ratio || 0,
          redemptionLimit: response.redemptionLimit || 0,
          requestTo: response.requestTo || [],
          referralPoints: response.referralPoints || 0,
        });
        return response;
      } else {
        const message =
          response?.message || response?.error || "Failed to reload settings";
        setError(message);
        return { success: false, error: message };
      }
    } catch (err) {
      console.error("Error reloading settings:", err);
      setError(err.message || "Error reloading settings");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Provide all context values
  const contextValue = {
    settings,
    loading,
    updateUserLoading,
    updateRatioRedemptionLoading,
    updateReferralLoading,
    removeUserLoading,
    error,
    updateRatio,
    updateRedemptionLimit,
    updateRequestTo,
    updateUserList: updateRequestTo,
    updateRatioAndRedemptionLimit,
    updateReferralPoints,
    removeUserFromRequestList,
    reloadSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
