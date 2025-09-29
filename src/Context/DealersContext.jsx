import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getDealers,
  createDealer,
  deleteDealer,
} from "../Services/dealerService";

export const DealersContext = createContext();

export const DealersContextProvider = ({ children }) => {
  const { token } = useAuthContext();

  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDealers();
    } else {
      setDealers([]);
      setError(null);
    }
  }, [token]);

  const fetchDealers = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getDealers(token);
      setDealers(data.dealers || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch dealers";
      setError(errorMessage);
      console.error("Error fetching dealers:", err);
    } finally {
      setLoading(false);
    }
  };

  const addDealer = async (dealerData) => {
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    if (!dealerData || typeof dealerData !== "object") {
      return { success: false, error: "Invalid dealer data" };
    }

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
      setDealers((prev) => [normalizedDealer, ...prev]);

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

  const removeDealer = async (id) => {
    if (!token) {
      return { success: false, error: "Authentication required" };
    }

    if (!id) {
      return { success: false, error: "Dealer ID is required" };
    }

    setOperationLoading(true);

    try {
      await deleteDealer(token, id);

      setDealers((prev) =>
        prev.filter((dealer) => dealer.id !== id && dealer.dealersId !== id)
      );

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

  const clearError = () => {
    setError(null);
  };

  const refreshDealers = () => {
    fetchDealers();
  };

  const value = {
    dealers,
    loading,
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

  if (!context) {
    throw new Error(
      "useDealersContext must be used within a DealersContextProvider"
    );
  }

  return context;
};
