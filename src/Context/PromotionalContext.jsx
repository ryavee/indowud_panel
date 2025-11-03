import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getAllPromotions,
  createNewPromotion,
  updatePromotion,
  deletePromotion,
} from "../Services/promotionalService.js";

export const PromotionalContext = createContext();

export const PromotionalProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPromotions();
      setPromotions(data.promotions || []);
    } catch (err) {
      setError(err.message || "Failed to fetch promotions");
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async (promotionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createNewPromotion(promotionData);

      let newPromotions = [];

      if (Array.isArray(response)) {
        newPromotions = response;
      } else if (response && response.data) {
        newPromotions = Array.isArray(response.data)
          ? response.data
          : [response.data];
      } else if (response && response.promotion) {
        newPromotions = [response.promotion];
      } else if (response) {
        newPromotions = [response];
      }

      if (!newPromotions.length) {
        console.warn("API didn't return created promotions, refetching all");
        await fetchPromotions();
        return;
      }

      setPromotions((prev) => [...prev, ...newPromotions]);
      return newPromotions;
    } catch (err) {
      console.error("Error creating promotion:", err);
      setError(err.message || "Failed to create promotion");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editPromotion = async (promotionData) => {
    try {
      setLoading(true);
      setError(null);

      if (!promotionData.id)
        throw new Error("Promotion ID is required for update");

      // Call API
      const response = await updatePromotion(promotionData);

      // The updated promotion is inside response.data.data
      const updatedPromotion = response?.data?.data;

      if (!updatedPromotion) {
        throw new Error("No updated promotion returned from API");
      }

      // Update local state
      setPromotions((prev) =>
        prev.map((promo) =>
          promo.id === updatedPromotion.id ? updatedPromotion : promo
        )
      );

      return updatedPromotion;
    } catch (err) {
      console.error("❌ Error updating promotion:", err);
      setError(err.message || "Failed to update promotion");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePromotion = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setPromotions((prev) => prev.filter((promo) => promo.id !== id));
      await deletePromotion(id);
    } catch (err) {
      console.error("Error deleting promotion:", err);
      setError(err.message || "Failed to delete promotion");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (token) fetchPromotions();
    else setPromotions([]);
  }, [token]);

  const contextValue = {
    promotions,
    loading,
    error,
    fetchPromotions,
    createPromotion,
    editPromotion,
    removePromotion,
    clearError,
  };

  return (
    <PromotionalContext.Provider value={contextValue}>
      {children}
    </PromotionalContext.Provider>
  );
};

export const usePromotionalContext = () => {
  const context = useContext(PromotionalContext);
  if (!context) {
    throw new Error(
      "usePromotionalContext must be used within a PromotionalProvider"
    );
  }
  return context;
};
