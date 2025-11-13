import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import AdminUsers from "../Pages/AdminUsers";
import Products from "../Pages/Products";
import QRGeneration from "../Pages/QRGeneration";
import QRTrack from "../Pages/QRTrack";
import Customers from "../Pages/Customers";
import Catalogue from "../Pages/Catalogue";
import Promotions from "../Pages/Promotions";
import Feed from "../Pages/Feed";
import Announcements from "../Pages/Announcements";
import AdminLayout from "../Components/Layout/AdminLayout";
import Settings from "../Pages/Settings";
import ManageTickets from "../Pages/ManageTickets";
import Dealers from "../Pages/Dealers";
import Redeemption from "../Pages/Redemption";

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
        <Route path="/factoryUsers" element={<AdminUsers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/qr" element={<QRGeneration />} />
        <Route path="/track" element={<QRTrack />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/Redeemption" element={<Redeemption />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tickets" element={<ManageTickets />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/announcements" element={<Announcements />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
