import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getAllPromotions,
  createNewPromotion,
  updatePromotion,
  deletePromotion,
  importpromotional,
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

      let newPromotion;
      if (response && response.data) newPromotion = response.data;
      else if (response && response.promotion)
        newPromotion = response.promotion;
      else newPromotion = response;

      if (!newPromotion) {
        console.warn("API didn't return created promotion, refetching all");
        await fetchPromotions();
        return;
      }

      setPromotions((prev) => [...prev, newPromotion]);
      return newPromotion;
    } catch (err) {
      console.error("Error creating promotion:", err);
      setError(err.message || "Failed to create promotion");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editPromotion = async (id, promotionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updatePromotion(id, promotionData);

      let updatedPromotion;
      if (response && response.data) updatedPromotion = response.data;
      else if (response && response.promotion)
        updatedPromotion = response.promotion;
      else updatedPromotion = response;

      setPromotions((prev) =>
        prev.map((promo) =>
          promo.id === id
            ? { ...promo, ...(updatedPromotion || promotionData) }
            : promo
        )
      );

      return updatedPromotion || promotionData;
    } catch (err) {
      console.error("Error updating promotion:", err);
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

  const importPromotions = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const result = await importpromotional(file);

      if (result && result.promotions) {
        setPromotions(result.promotions);
      } else {
        await fetchPromotions();
      }

      return result;
    } catch (err) {
      console.error("Error importing promotions:", err);
      setError(err.message || "Failed to import promotional data");
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
    importPromotions,
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
