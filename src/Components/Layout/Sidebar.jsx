import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { FaUsers, FaQrcode, FaBook, FaBullhorn, FaUser, FaBell, FaGift } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";


const menuItems = [
  {
    section: "MAIN",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
  },
  {
    section: "USERS",
    items: [
      { name: "Manage Admin Users", icon: MdAdminPanelSettings, path: "/users/admin" },
      { name: "Manage Factory Users", icon: FaUsers, path: "/users/factory" },
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
      { name: "Custom Notifications", icon: FaBell, path: "/customer/notifications" },
      { name: "Announcements", icon: FaBullhorn, path: "/customer/announcements" },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {menuItems.map((menu, idx) => (
          <div key={idx} className="mb-6">
            {/* Section Title */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              {menu.section}
            </h3>
            <ul className="space-y-1">
              {menu.items.map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
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
    </aside>
  );
};

export default Sidebar;
