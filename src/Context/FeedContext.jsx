import { createContext, useState, useEffect, useContext } from "react";
import {
  getFeed,
  createFeed,
  updateFeed,
  deleteFeed,
} from "../Services/feedService.js";

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  // Fetch all feeds
  const fetchFeeds = async () => {
    try {
      const data = await getFeed();
      const feeds = data?.feeds || [];
      setFeeds(feeds);
    } catch (error) {
      console.error("Failed to fetch feeds:", error);
      setFeeds([]);
    }
  };

  // Create a new feed
  const addFeed = async (feedData) => {
    try {
      const newFeed = await createFeed(feedData);

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
    try {
      // Get the original feed data for comparison
      const originalFeed = getFeedById(feedId);
      if (!originalFeed) {
        console.error("Feed not found for update");
        return null;
      }

      const updatedFeed = await updateFeed(feedId, updatedData, originalFeed);

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
    try {
      await deleteFeed(feedId);
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

  useEffect(() => {
    fetchFeeds();
  }, []);

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
