import { createContext, useState, useEffect } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncementFromAdmin,
} from "../Services/announcementService";

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      const announcements = data?.announcements || [];
      setAnnouncements(announcements);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const createNewAnnouncement = async (newAnnouncement) => {
    setCreateLoading(true);
    try {
      const data = await createAnnouncement(newAnnouncement);

      // Option 1: If API returns the created announcement object
      if (data?.announcement) {
        setAnnouncements((prev) => [data.announcement, ...prev]); // Add to beginning
        // or setAnnouncements(prev => [...prev, data.announcement]); // Add to end
      }

      // Option 2: If API returns the full updated list
      else if (data?.announcements) {
        setAnnouncements(data.announcements);
      }

      // Option 3: If API only confirms creation, add the original object
      else {
        // Assuming the API returns some ID or you want to add the original object
        const announcementWithId = {
          ...newAnnouncement,
          id: data?.id || Date.now(), // Use API ID or fallback
          createdAt: new Date().toISOString(), // Add timestamp if needed
        };
        setAnnouncements((prev) => [announcementWithId, ...prev]);
      }

      setCreateLoading(false);
    } catch (error) {
      setCreateLoading(false);
      console.error("Failed to create announcement:", error);
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    setDeleteLoading(true);
    try {
      await deleteAnnouncementFromAdmin(announcementId);
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
      console.error("Failed to delete announcement:", error);
    }
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        createNewAnnouncement,
        loading,
        createLoading,
        deleteLoading,
        deleteAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
