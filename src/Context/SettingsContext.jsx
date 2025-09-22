import { createContext, useState, useCallback } from "react";
import { loadSettings, updateRequestUsers } from "../Services/settingsService";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  // Fixed fetchSettings - removed loading dependency that was causing issues
  const fetchSettings = useCallback(async () => {
    if (loading || fetchedOnce) return; // Prevent multiple requests and refetching

    setLoading(true);
    setError(null);

    try {
      const data = await loadSettings();
      console.log("Fetched settings:", data);
      setSettings(data);
      setFetchedOnce(true);
    } catch (err) {
      console.error("Error loading settings:", err);
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [loading, fetchedOnce]); // Keep these dependencies but add fetchedOnce check

  // Force refresh function for when you need to reload settings
  const refreshSettings = useCallback(async () => {
    setFetchedOnce(false); // Reset the flag
    setLoading(true);
    setError(null);

    try {
      const data = await loadSettings();
      console.log("Refreshed settings:", data);
      setSettings(data);
      setFetchedOnce(true);
    } catch (err) {
      console.error("Error refreshing settings:", err);
      setError(err.message || "Failed to refresh settings");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserList = useCallback(async (updateData) => {
    setUpdateUserLoading(true);
    setError(null);

    try {
      const data = await updateRequestUsers(updateData);
      console.log("Update response:", data);

      if (data && data.success) {
        // Update the settings with the new data
        setSettings((prevSettings) => ({
          ...prevSettings,
          data: {
            ...prevSettings?.data,
            ...updateData,
          },
        }));
        return data;
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setError(error.message || "Failed to update settings");
      throw error;
    } finally {
      setUpdateUserLoading(false);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateUserLoading,
        error,
        fetchSettings,
        refreshSettings,
        updateUserList,
        fetchedOnce,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}