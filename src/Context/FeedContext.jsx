import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getFeed,
  createFeed,
  updateFeed,
  deleteFeed,
} from "../Services/feedService.js";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  const { token } = useAuthContext();

  // Fetch all feeds
  const fetchFeeds = async () => {
    if (!token) return;
    try {
      const data = await getFeed(token);
      const feeds = data?.feeds || [];
      setFeeds(feeds);
    } catch (error) {
      console.error("Failed to fetch feeds:", error);
      setFeeds([]);
    }
  };

  // Create a new feed
  const addFeed = async (feedData) => {
    if (!token) {
      console.error("Token is required to create a feed");
      return null;
    }

    try {
      const newFeed = await createFeed(feedData, token);

      // Instead of immediately adding to state, refresh the feeds to get complete data
      await fetchFeeds();

      return newFeed;
    } catch (error) {
      console.error("Failed to create feed:", error);
      return null;
    }
  };

  // Update an existing feed
  const editFeed = async (feedId, updatedData) => {
    if (!token) {
      console.error("Token is required to update a feed");
      return null;
    }

    try {
      // Get the original feed data for comparison
      const originalFeed = getFeedById(feedId);
      if (!originalFeed) {
        console.error("Feed not found for update");
        return null;
      }

      const updatedFeed = await updateFeed(feedId, updatedData, originalFeed, token);

      // Refresh feeds to ensure we have the latest data
      await fetchFeeds();

      return updatedFeed;
    } catch (error) {
      console.error("Failed to update feed:", error);
      return null;
    }
  };

  // Delete a feed
  const removeFeed = async (feedId) => {
    if (!token) {
      console.error("Token is required to delete a feed");
      return false;
    }

    try {
      await deleteFeed(feedId, token);
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== feedId));
      return true;
    } catch (error) {
      console.error("Failed to delete feed:", error);
      return false;
    }
  };

  // Get a single feed by ID
  const getFeedById = (feedId) => {
    return feeds.find((feed) => feed.id === feedId) || null;
  };

  // Clear all feeds (useful for logout)
  const clearFeeds = () => {
    setFeeds([]);
  };

  // Auto-fetch feeds when token changes
  useEffect(() => {
    if (token) {
      fetchFeeds();
    } else {
      clearFeeds();
    }
  }, [token]);

  const contextValue = {
    // State
    feeds,

    // Actions
    fetchFeeds,
    addFeed,
    editFeed,
    removeFeed,
    getFeedById,
    clearFeeds,
  };

  return (
    <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
  );
};

// Custom hook to use the FeedContext
export const useFeedContext = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeedContext must be used within a FeedProvider");
  }
  return context;
};