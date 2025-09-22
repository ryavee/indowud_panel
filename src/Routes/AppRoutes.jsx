import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import AdminUsers from "../Pages/AdminUsers";
import QRGeneration from "../Pages/QRGeneration";
import Customers from "../Pages/Customers";
import Catalogue from "../Pages/Catalogue";
import Promotions from "../Pages/Promotions";
import CustomNotifications from "../Pages/CustomNotifications";
import Announcements from "../Pages/Announcements";
import AdminLayout from "../Components/Layout/AdminLayout";
import Settings from "../Pages/Settings";
import ManageTickets from "../Pages/ManageTickets";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users/factoryUsers" element={<AdminUsers />} />
        <Route path="users/customers" element={<Customers />} />
        <Route path="/sales/qr" element={<QRGeneration />} />
        <Route path="/sales/catalogue" element={<Catalogue />} />
        <Route path="/sales/promotions" element={<Promotions />} />
        <Route path="/system/settings" element={<Settings />} />
        <Route path="/system/tickets" element={<ManageTickets />} />
        <Route path="/system/notifications" element={<CustomNotifications />} />
        <Route path="/system/announcements" element={<Announcements />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
