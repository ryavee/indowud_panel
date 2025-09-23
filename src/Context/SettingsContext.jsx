import { createContext, useState, useCallback, useEffect } from "react";
import {
  loadSettings,
  updateRequestUsers,
  updateRatioRedemptionLimit,
  removeRequestUsers,
} from "../Services/settingsService";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    ratio: 0,
    redemptionLimit: 0,
    requestTo: [],
  });
  const [loading, setLoading] = useState(true);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [updateRatioRedemptionLoading, setUpdateRatioRedemptionLoading] =
    useState(false);
  const [removeUserLoading, setRemoveUserLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load settings when component mounts
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
          });
        } else {
          const errorMessage =
            response?.message || response?.error || "Failed to load settings";
          setError(errorMessage);
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

  // Update ratio
  const updateRatio = useCallback((newRatio) => {
    setSettings((prev) => ({ ...prev, ratio: newRatio }));
  }, []);

  // Update redemption limit
  const updateRedemptionLimit = useCallback((newLimit) => {
    setSettings((prev) => ({ ...prev, redemptionLimit: newLimit }));
  }, []);

  // Update request users (legacy method - kept for backward compatibility)
  const updateRequestTo = useCallback(async (newRequestUsers) => {
    try {
      setUpdateUserLoading(true);
      setError(null);
      const response = await updateRequestUsers(newRequestUsers);

      if (response && response.success !== false) {
        setSettings((prev) => ({ ...prev, requestTo: newRequestUsers }));
        return response;
      } else {
        const errorMessage =
          response?.message ||
          response?.error ||
          "Failed to update request users";
        setError(errorMessage);
        return response || { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Error updating request users:", err);
      const errorMessage = err.message || "Error updating request users";
      setError(errorMessage);
      throw err;
    } finally {
      setUpdateUserLoading(false);
    }
  }, []);

  // Update ratio and redemption limit with separate loading state
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
            ratio: ratio,
            redemptionLimit: redemptionLimit,
          }));
          return response;
        } else {
          const errorMessage =
            response?.message ||
            response?.error ||
            "Failed to update ratio and redemption limit";
          setError(errorMessage);
          return response || { success: false, error: errorMessage };
        }
      } catch (err) {
        console.error("Error updating ratio and redemption limit:", err);
        const errorMessage =
          err.message || "Error updating ratio and redemption limit";
        setError(errorMessage);
        throw err;
      } finally {
        setUpdateRatioRedemptionLoading(false);
      }
    },
    []
  );

  // Remove specific user with separate loading state
  const removeUserFromRequestList = useCallback(async (emailToRemove) => {
    try {
      setRemoveUserLoading(true);
      setError(null);

      const response = await removeRequestUsers(emailToRemove);

      if (response && response.success !== false) {
        // Update local state by removing the email
        setSettings((prev) => ({
          ...prev,
          requestTo: prev.requestTo.filter((email) => email !== emailToRemove),
        }));
        return response;
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to remove user";
        setError(errorMessage);
        return response || { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Error removing user:", err);
      const errorMessage = err.message || "Error removing user";
      setError(errorMessage);
      throw err;
    } finally {
      setRemoveUserLoading(false);
    }
  }, []);

  // Generic update method that can handle all settings updates
  const updateUserList = useCallback(
    async (updateData) => {
      try {
        setUpdateUserLoading(true);
        setError(null);

        let response;

        // If only updating requestTo emails
        if (updateData.requestTo && Object.keys(updateData).length === 1) {
          response = await updateRequestUsers(updateData.requestTo);
          if (response && response.success !== false) {
            setSettings((prev) => ({
              ...prev,
              requestTo: updateData.requestTo,
            }));
          }
        } else {
          // For comprehensive updates, we need a more comprehensive API call
          // For now, we'll update each field separately if needed
          if (updateData.requestTo) {
            response = await updateRequestUsers(updateData.requestTo);
            if (response && response.success !== false) {
              setSettings((prev) => ({
                ...prev,
                requestTo: updateData.requestTo,
              }));
            }
          }

          // Update other fields in local state (you may need additional API calls for these)
          if (
            updateData.redemptionLimit !== undefined ||
            updateData.ratio !== undefined
          ) {
            // Use the separate function for ratio and redemption limit updates
            const ratioResponse = await updateRatioRedemptionLimit(
              updateData.ratio !== undefined
                ? updateData.ratio
                : settings.ratio,
              updateData.redemptionLimit !== undefined
                ? updateData.redemptionLimit
                : settings.redemptionLimit
            );

            if (ratioResponse && ratioResponse.success !== false) {
              setSettings((prev) => ({
                ...prev,
                ratio:
                  updateData.ratio !== undefined
                    ? updateData.ratio
                    : prev.ratio,
                redemptionLimit:
                  updateData.redemptionLimit !== undefined
                    ? updateData.redemptionLimit
                    : prev.redemptionLimit,
              }));
            }

            response = ratioResponse;
          }

          // Return a successful response if we get here
          response = response || { success: true };
        }

        if (response && response.success !== false) {
          return response;
        } else {
          const errorMessage =
            response?.message || response?.error || "Failed to update settings";
          setError(errorMessage);
          return response || { success: false, error: errorMessage };
        }
      } catch (err) {
        console.error("Error updating settings:", err);
        const errorMessage = err.message || "Error updating settings";
        setError(errorMessage);
        throw err;
      } finally {
        setUpdateUserLoading(false);
      }
    },
    [settings.ratio, settings.redemptionLimit]
  );

  // Reload settings
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
        });
        return response;
      } else {
        const errorMessage =
          response?.message || response?.error || "Failed to reload settings";
        setError(errorMessage);
        return response || { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("Error reloading settings:", err);
      const errorMessage = err.message || "Error reloading settings";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    settings,
    loading,
    updateUserLoading,
    updateRatioRedemptionLoading,
    removeUserLoading,
    error,
    updateRatio,
    updateRedemptionLimit,
    updateRequestTo,
    updateUserList,
    updateRatioAndRedemptionLimit, // New function for ratio and redemption limit
    removeUserFromRequestList, // New function for removing individual users
    reloadSettings,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
