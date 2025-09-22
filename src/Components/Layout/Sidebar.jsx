import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { LayoutDashboard } from "lucide-react";
import {
  FaUsers,
  FaQrcode,
  FaBook,
  FaBullhorn,
  FaUser,
  FaBell,
  FaGift,
  FaCog,
  FaSignOutAlt,
  FaClipboard,
} from "react-icons/fa";

const menuItems = [
  {
    section: "MAIN",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
  },
  {
    section: "USERS",
    items: [
      {
        name: "Factory Users",
        icon: FaUsers,
        path: "/users/factoryUsers",
      },
    ],
  },
  {
    section: "SALES",
    items: [
      { name: "QR Generation", icon: FaQrcode, path: "/sales/qr" },
      { name: "Catalogue", icon: FaBook, path: "/sales/catalogue" },
      { name: "Promotions", icon: FaGift, path: "/sales/promotions" },
    ],
  },
  {
    section: "CUSTOMERS",
    items: [
      { name: "Customers", icon: FaUser, path: "/customers" },
      {
        name: "Custom Notifications",
        icon: FaBell,
        path: "/customer/notifications",
      },
      {
        name: "Announcements",
        icon: FaBullhorn,
        path: "/customer/announcements",
      },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { name: "Settings", icon: FaCog, path: "system/settings" },
      { name: "Manage Tickets", icon: FaClipboard, path: "system/tickets" }],
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 shadow-md h-screen flex flex-col">
      {/* Scrollable menu */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {menuItems.map((menu, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              {menu.section}
            </h3>
            <ul className="space-y-1">
              {menu.items.map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-gray-200"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Fixed Logout button */}
      <div className="p-4 border-t">
        <button
          onClick={() => {}}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-600 w-full text-left"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
