import {
  LayoutDashboard,
  ClipboardList,
  Lock,
  UserCog,
  UserCircle,
  UserCheck,
  MapPin,
  Tag,
  Gift,
} from "lucide-react";
import { BsBuilding } from "react-icons/bs";

import { FaUsers, 
   FaLock, 
   FaUserCircle, 
   FaUserCheck, 
   FaUserCog,
   FaMapMarkerAlt,
   FaTags,
   FaGift,
   FaUser,
  } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    section: "MAIN",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { name: "Pending Actions", icon: ClipboardList, path: "/pending" },
    ],
  },
  {
    section: "USERS",
    items: [
      { name: "Department", icon: BsBuilding, path: "/department" },
      { name: "Users", icon: FaUsers, path: "/users" },
      { name: "Permission/Role", icon: FaLock, path: "/roles" },
    ],
  },
  {
    section: "SALES USERS",
    items: [
      { name: "User type", icon: FaUserCog, path: "/user-type" },
      { name: "Owner User", icon: FaUserCircle, path: "/owner-user" },
      { name: "Sale User", icon: FaUserCheck, path: "/sale-user" },
      { name: "Tracking Management", icon: FaMapMarkerAlt, path: "/tracking" },
      { name: "Promotional Activity Type", icon: FaTags, path: "/promo-type" },
      { name: "Promotional Activity", icon: FaGift, path: "/promo" },
    ],
  },
  {
    section: "CUSTOMERS",
    items: [
      { name: "Customer Group", icon: FaUsers, path: "/customer-group" },
      { name: "Customers", icon: FaUser, path: "/customers" },
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
