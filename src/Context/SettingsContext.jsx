import { createContext, useState, useEffect } from "react";
import { loadSettings, updateRequestUsers } from "../Api/settingsService";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  const fetchSettings = async () => {
    if (fetchedOnce) return; // ✅ already fetched, skip
    setLoading(true);
    try {
      const data = await loadSettings();
      setSettings(data);
      setFetchedOnce(true); // mark as fetched
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserList = async (updateUserList) => {
    setUpdateUserLoading(true);
    try {
      const data = await updateRequestUsers(updateUserList);
      if (data.success) {
        setSettings(updateUserList);
        setUpdateUserLoading(false);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      setUpdateUserLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateUserLoading,
        fetchSettings,
        updateUserList,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
