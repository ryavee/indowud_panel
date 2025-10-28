import { createContext, useState, useEffect } from "react";
import { getDashboardData } from "../Services/dashboardService";

// Create the context
export const DashboardContext = createContext();

// Create the provider component
export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data when the provider mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDashboardData();
        if (response && response.success) {
          setDashboardData(response.dashboardData);
        } else {
          setError(response?.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, loading, error }}>
      {children}
    </DashboardContext.Provider>
  );
};
