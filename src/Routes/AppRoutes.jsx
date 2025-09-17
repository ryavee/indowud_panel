import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import Users from "../Pages/Users";
import OwnerUser from "../Pages/OwnerUser";
import SaleUser from "../Pages/SaleUser";
import Roles from "../Pages/Roles";
import Department from "../Pages/Department";
import CustomerGroup from "../Pages/CustomerGroup";
import Notifications from "../Pages/Notifications";
import Settings from "../Pages/Settings";
import AdminLayout from "../Components/Layout/AdminLayout";
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
          <Route path="/users" element={<Users />} />
          <Route path="/owner-user" element={<OwnerUser />} />
          <Route path="/sale-user" element={<SaleUser />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/department" element={<Department />} />
          <Route path="/customer-group" element={<CustomerGroup />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
