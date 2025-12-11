// src/Routes/AppRoutes.jsx
import React from "react";
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
import RedemptionManagement from "../Pages/Redemption";
import PrivacyPolicy from "../Pages/PrivacyPolicy";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Protected/admin routes wrapped by AdminLayout */}
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
        <Route path="/redemption" element={<RedemptionManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tickets" element={<ManageTickets />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/announcements" element={<Announcements />} />
      </Route>

      {/* Default/root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<h1 className="p-8 text-center">404 — Page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
