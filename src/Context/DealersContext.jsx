import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getDealers,
  createDealer,
  deleteDealer,
  generateDealerId,
  importDealersData,
} from "../Services/dealerService";

export const DealersContext = createContext();

export const DealersContextProvider = ({ children }) => {
  const { token } = useAuthContext();

  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDealers(true);
    } else {
      setDealers([]);
      setError(null);
      setHasLoadedOnce(false);
    }
  }, [token]);

  // Fetch dealers with optional loader
  const fetchDealers = async (showLoader = true) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (showLoader) setLoading(true);
    setError(null);

    try {
      const data = await getDealers(token);

      if (!data) {
        throw new Error("Failed to fetch dealers");
      }

      const dealerList = data.dealers || [];
      setDealers(dealerList);
      setHasLoadedOnce(true);
    } catch (err) {
      const errorMessage = err?.message || "Failed to fetch dealers";
      setError(errorMessage);
      console.error("Error fetching dealers:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Add a new dealer with optimistic update
  const addDealer = async (dealerData) => {
    if (!token) return { success: false, error: "Authentication required" };
    if (!dealerData || typeof dealerData !== "object")
      return { success: false, error: "Invalid dealer data" };

    setOperationLoading(true);
    setError(null);

    try {
      const response = await createDealer(token, dealerData);

      if (!response) {
        throw new Error("Failed to create dealer");
      }

      // Refresh dealers list after successful creation
      await fetchDealers(false);

      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.message || "Failed to create dealer";
      setError(errorMessage);
      console.error("Error creating dealer:", err);

      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete a dealer with immediate UI update
  const removeDealer = async (dealerId) => {
    if (!token) return { success: false, error: "Authentication required" };
    if (!dealerId) return { success: false, error: "Dealer ID is required" };

    setOperationLoading(true);
    setError(null);

    // Store original state for rollback
    const previousDealers = dealers;

    try {
      // Optimistic update: Remove immediately from UI
      setDealers((prev) =>
        prev.filter((dealer) => {
          // Handle both string and number comparisons
          return String(dealer.dealerId) !== String(dealerId);
        })
      );

      // Perform delete operation
      const response = await deleteDealer(token, dealerId);

      if (!response) {
        throw new Error("Failed to delete dealer");
      }

      // Confirm deletion with a background refresh
      setTimeout(() => fetchDealers(false), 500);

      return { success: true };
    } catch (err) {
      const errorMessage = err?.message || "Failed to delete dealer";
      setError(errorMessage);
      console.error("Error deleting dealer:", err);

      // Rollback: Restore previous state
      setDealers(previousDealers);

      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Generate a new Dealer ID only
  const generateNewDealerId = async () => {
    setOperationLoading(true);
    setError(null);

    try {
      const result = await generateDealerId();

      if (!result) {
        throw new Error("Failed to generate Dealer ID");
      }

      if (result.success && result.dealerID) {
        return { success: true, dealerID: result.dealerID };
      } else {
        const errorMsg = result.error || "Failed to generate Dealer ID";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err?.message || "Unknown error occurred";
      setError(errorMsg);
      console.error("Error generating dealer ID:", err);
      return { success: false, error: errorMsg };
    } finally {
      setOperationLoading(false);
    }
  };

  // Import dealers from file
  const importDealers = async (file) => {
    if (!token) return { success: false, error: "Authentication required" };
    if (!file) return { success: false, error: "No file provided" };

    setOperationLoading(true);
    setError(null);

    try {
      const result = await importDealersData(file);

      // Refresh dealer list after successful import
      await fetchDealers(false);

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.message || "Failed to import dealers";
      setError(errorMessage);
      console.error("Error importing dealers:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Utility functions
  const clearError = () => setError(null);
  const refreshDealers = () => fetchDealers(false);

  const value = {
    dealers,
    loading,
    hasLoadedOnce,
    error,
    operationLoading,
    addDealer,
    removeDealer,
    refreshDealers,
    clearError,
    generateNewDealerId,
    importDealers,
  };

  return (
    <DealersContext.Provider value={value}>{children}</DealersContext.Provider>
  );
};

export const useDealersContext = () => {
  const context = useContext(DealersContext);
  if (!context)
    throw new Error(
      "useDealersContext must be used within a DealersContextProvider"
    );
  return context;
};
