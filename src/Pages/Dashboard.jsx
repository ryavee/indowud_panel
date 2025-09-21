import { useContext, useEffect } from "react";
import { SettingsContext } from "../Context/SettingsContext";
const Dashboard = () => {
  const { fetchSettings } = useContext(SettingsContext);

  useEffect(() => {
    fetchSettings();
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
      <p>This is the main dashboard area.</p>
    </div>
  );
};

export default Dashboard;
