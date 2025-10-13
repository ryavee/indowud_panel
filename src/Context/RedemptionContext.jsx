import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getRedemptions,
  changeRedemptionStatus as changeRedemptionStatusAPI,
} from "../Services/redemptionsService";

const RedemptionsContext = createContext();
export const CustomerContext = createContext();

export const RedemptionsContextProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRedemptions();
      if (response && response.success && Array.isArray(response.redemptions)) {
        setRedemptions(response.redemptions);
      } else {
        setError("Invalid response format from API");
        setRedemptions([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching redemptions");
      setRedemptions([]);
      console.error("Error fetching redemptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRedemptionStatus = async (id, uid, newStatus) => {
    try {
      const redemption = redemptions.find((r) => r.id === id);
      if (!redemption) {
        throw new Error("Redemption not found");
      }
      if (redemption.status !== "P") {
        return {
          success: false,
          message: "Cannot change status. Redemption already processed.",
        };
      }
      if (newStatus !== "A" && newStatus !== "R") {
        return {
          success: false,
          message:
            "Invalid status. Only 'A' (Approved) or 'R' (Rejected) allowed.",
        };
      }
      if (!uid) {
        throw new Error("User ID not found. Please login again.");
      }
      const response = await changeRedemptionStatusAPI(
        token,
        id,
        uid,
        newStatus
      );
      if (!response || !response.success) {
        throw new Error(
          response?.message || "Failed to update redemption status"
        );
      }
      setRedemptions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      return {
        success: true,
        message: `Redemption ${
          newStatus === "A" ? "approved" : "rejected"
        } successfully`,
      };
    } catch (err) {
      console.error("Error updating redemption status:", err);
      await fetchRedemptions();
      return {
        success: false,
        message: err.message || "An error occurred while updating status",
      };
    }
  };
  useEffect(() => {
    if (token) {
      fetchRedemptions();
    }
  }, [token]);
  const value = {
    redemptions,
    loading,
    error,
    fetchRedemptions,
    updateRedemptionStatus,
  };

  return (
    <RedemptionsContext.Provider value={value}>
      {children}
    </RedemptionsContext.Provider>
  );
};

export const useRedemptionsContext = () => {
  const context = useContext(RedemptionsContext);
  if (!context) {
    throw new Error(
      "useRedemptionsContext must be used within RedemptionsContextProvider"
    );
  }
  return context;
};
