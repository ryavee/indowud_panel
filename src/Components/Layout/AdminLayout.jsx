import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true); // trigger fade-out

    setTimeout(() => {
      localStorage.removeItem("authToken");
      navigate("/login");
    }, 300); // match the sidebar fade
  };

  return (
    <div
      className={`flex h-screen bg-gray-100 transition-opacity duration-300 ${
        isLoggingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
