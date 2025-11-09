import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getRedemptions,
  changeRedemptionStatus as changeRedemptionStatusAPI,
  bulkChangeRedemptionStatus as bulkChangeRedemptionStatusAPI,
} from "../Services/redemptionsService";

const RedemptionsContext = createContext();
export const CustomerContext = createContext();

export const RedemptionsContextProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all redemptions
  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRedemptions(token);

      if (response && response.success && Array.isArray(response.redemptions)) {
        setRedemptions(response.redemptions);
      } else {
        setError("Invalid response format from API");
        setRedemptions([]);
      }
    } catch (err) {
      console.error("Error fetching redemptions:", err);
      setError(err.message || "An error occurred while fetching redemptions");
      setRedemptions([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update single redemption status (instant UI update)
  const updateRedemptionStatus = async (id, uid, newStatus) => {
    try {
      const redemption = redemptions.find((r) => r.id === id);
      if (!redemption)
        return { success: false, message: "Redemption not found" };

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
            "Invalid status. Only 'A' (Approve) or 'R' (Reject) allowed.",
        };
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

      // ✅ Instantly update local state without rebuilding
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
      return {
        success: false,
        message: err.message || "An error occurred while updating status",
      };
    }
  };

  // ✅ Bulk update redemption statuses (instant UI update)
  const bulkUpdateRedemptionStatus = async (redemptionIds, newStatus) => {
    try {
      if (!Array.isArray(redemptionIds) || redemptionIds.length === 0) {
        throw new Error("No redemption IDs provided for bulk update.");
      }
      if (newStatus !== "A" && newStatus !== "R") {
        throw new Error("Invalid status. Only 'A' or 'R' allowed.");
      }

      const response = await bulkChangeRedemptionStatusAPI(
        token,
        redemptionIds,
        newStatus
      );
      if (!response || !response.success) {
        throw new Error(
          response?.message || "Failed to update bulk redemption statuses"
        );
      }

      // ✅ Update local state instantly (no page reload)
      setRedemptions((prev) =>
        prev.map((r) =>
          redemptionIds.includes(r.id) ? { ...r, status: newStatus } : r
        )
      );

      return {
        success: true,
        message: `Successfully ${newStatus === "A" ? "approved" : "rejected"} ${
          redemptionIds.length
        } redemptions.`,
      };
    } catch (err) {
      console.error("Error in bulk redemption update:", err);
      return {
        success: false,
        message: err.message || "An error occurred during bulk status update",
      };
    }
  };

  // Fetch redemptions when token changes
  useEffect(() => {
    if (token) {
      fetchRedemptions();
    }
  }, [token]);

  // Context value
  const value = {
    redemptions,
    loading,
    error,
    fetchRedemptions,
    updateRedemptionStatus,
    bulkUpdateRedemptionStatus, // ✅ new
  };

  return (
    <RedemptionsContext.Provider value={value}>
      {children}
    </RedemptionsContext.Provider>
  );
};

// ✅ Custom hook
export const useRedemptionsContext = () => {
  const context = useContext(RedemptionsContext);
  if (!context) {
    throw new Error(
      "useRedemptionsContext must be used within RedemptionsContextProvider"
    );
  }
  return context;
};
