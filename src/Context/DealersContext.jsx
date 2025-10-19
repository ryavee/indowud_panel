import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { getDealers, createDealer, deleteDealer } from "../Services/dealerService";

export const DealersContext = createContext();

export const DealersContextProvider = ({ children }) => {
  const { token } = useAuthContext();

  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // ✅ track first load
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    if (token) {
      initializeDealers();
    } else {
      setDealers([]);
      setError(null);
      setHasLoadedOnce(false);
    }
  }, [token]);

  // ✅ Load dealers either from cache or API
  const initializeDealers = async () => {
    try {
      const cached = sessionStorage.getItem("dealersCache");

      if (cached) {
        setDealers(JSON.parse(cached));
        setHasLoadedOnce(true);
        // Optionally refresh in background
        fetchDealers(false);
      } else {
        await fetchDealers(true);
      }
    } catch (err) {
      console.error("Error initializing dealers:", err);
      await fetchDealers(true);
    }
  };

  // ✅ Fetch dealers with optional loader control
  const fetchDealers = async (showLoader = true) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (showLoader) setLoading(true);
    setError(null);

    try {
      const data = await getDealers(token);
      const dealerList = data.dealers || [];
      setDealers(dealerList);
      sessionStorage.setItem("dealersCache", JSON.stringify(dealerList)); // ✅ Cache result
      setHasLoadedOnce(true);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch dealers";
      setError(errorMessage);
      console.error("Error fetching dealers:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // ✅ Add Dealer
  const addDealer = async (dealerData) => {
    if (!token) return { success: false, error: "Authentication required" };
    if (!dealerData || typeof dealerData !== "object")
      return { success: false, error: "Invalid dealer data" };

    setOperationLoading(true);
    try {
      const response = await createDealer(token, dealerData);
      const newDealer = response.dealers || response.dealer || response;

      const normalizedDealer = {
        id: newDealer.id || newDealer.dealersId,
        dealersId: newDealer.dealersId || newDealer.id,
        firstName: newDealer.firstName,
        lastName: newDealer.lastName,
        city: newDealer.city,
        state: newDealer.state,
      };

      setDealers((prev) => {
        const updated = [normalizedDealer, ...prev];
        sessionStorage.setItem("dealersCache", JSON.stringify(updated));
        return updated;
      });

      setError(null);
      return { success: true, data: normalizedDealer };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create dealer";
      console.error("Error creating dealer:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Delete Dealer
  const removeDealer = async (id) => {
    if (!token) return { success: false, error: "Authentication required" };
    if (!id) return { success: false, error: "Dealer ID is required" };

    setOperationLoading(true);
    try {
      await deleteDealer(token, id);
      setDealers((prev) => {
        const updated = prev.filter(
          (dealer) => dealer.id !== id && dealer.dealersId !== id
        );
        sessionStorage.setItem("dealersCache", JSON.stringify(updated));
        return updated;
      });

      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete dealer";
      console.error("Error deleting dealer:", err);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // ✅ Utility methods
  const clearError = () => setError(null);
  const refreshDealers = () => fetchDealers(false); // refresh without main loader

  const value = {
    dealers,
    loading,
    hasLoadedOnce, // 👈 new
    error,
    operationLoading,
    addDealer,
    removeDealer,
    refreshDealers,
    clearError,
  };

  return (
    <DealersContext.Provider value={value}>{children}</DealersContext.Provider>
  );
};

export const useDealersContext = () => {
  const context = useContext(DealersContext);
  if (!context)
    throw new Error("useDealersContext must be used within a DealersContextProvider");
  return context;
};
