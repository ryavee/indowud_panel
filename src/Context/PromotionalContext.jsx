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
      console.log("Fetched promotions:", data);

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

      // Handle different possible response structures
      let newPromotion;
      if (response && response.data) {
        // If the API returns { data: promotionObject }
        newPromotion = response.data;
      } else if (response && response.promotion) {
        // If the API returns { promotion: promotionObject }
        newPromotion = response.promotion;
      } else if (response) {
        // If the API returns the promotion object directly
        newPromotion = response;
      } else {
        // If API doesn't return the created object, refetch all promotions
        console.warn(
          "API didn't return created promotion, refetching all promotions"
        );
        await fetchPromotions();
        return;
      }

      // Add the new promotion to the state
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

      console.log("Updating promotion:", id, "with data:", promotionData);
      const response = await updatePromotion(id, promotionData);
      console.log("Update promotion response:", response);

      // Handle different possible response structures
      let updatedPromotion;
      if (response && response.data) {
        updatedPromotion = response.data;
      } else if (response && response.promotion) {
        updatedPromotion = response.promotion;
      } else if (response) {
        updatedPromotion = response;
      }

      // Update the promotion in state, merging with existing data to preserve all fields
      setPromotions((prev) =>
        prev.map((promo) => {
          if (promo.id === id) {
            // If we have a complete updated promotion from API, use it
            if (updatedPromotion && Object.keys(updatedPromotion).length > 2) {
              return { ...promo, ...updatedPromotion };
            } else {
              // Otherwise, merge the original promotion data with the update data
              return { ...promo, ...promotionData };
            }
          }
          return promo;
        })
      );

      // Return the merged promotion data
      const originalPromotion = promotions.find((p) => p.id === id);
      const finalPromotion =
        updatedPromotion && Object.keys(updatedPromotion).length > 2
          ? { ...originalPromotion, ...updatedPromotion }
          : { ...originalPromotion, ...promotionData };

      return finalPromotion;
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

      console.log("Deleting promotion:", id);
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

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (token) {
      fetchPromotions();
    } else {
      setPromotions([]);
    }
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
