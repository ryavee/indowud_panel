import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import AdminUsers from "../Pages/AdminUsers";
import FactoryUsers from "../Pages/FactoryUsers";
import QRGeneration from "../Pages/QRGeneration";
import Catalogue from "../Pages/Catalogue";
import Promotions from "../Pages/Promotions";
import Customers from "../Pages/Customers";
import CustomNotifications from "../Pages/CustomNotifications";
import Announcements from "../Pages/Announcements";
import AdminLayout from "../Components/Layout/AdminLayout";
import Settings from "../Pages/Settings";
import { useAuth } from "../Hooks/useAuth";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      {user ? (
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/admin" element={<AdminUsers />} />
          <Route path="/users/factory" element={<FactoryUsers />} />
          <Route path="/sales/qr" element={<QRGeneration />} />
          <Route path="/sales/catalogue" element={<Catalogue />} />
          <Route path="/sales/promotions" element={<Promotions />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customer/notifications" element={<CustomNotifications />} />
          <Route path="/customer/announcements" element={<Announcements />} />
          <Route path="/system/settings" element={<Settings />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
