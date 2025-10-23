import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo_icon from "../../assets/Icon_Indowud.png";
import { X } from "lucide-react";

// ✅ Premium unified icon set (Lucide)
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Package,
  QrCode,
  MapPin,
  BookOpen,
  BadgePercent,
  Coins,
  Newspaper,
  TicketCheck,
  Megaphone,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    section: "MAIN",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
  },
  {
    section: "USERS",
    items: [
      { name: "Users", icon: Building2, path: "/users/factoryUsers" },
      { name: "Customers", icon: Users, path: "/users/customers" },
      { name: "Dealers", icon: Briefcase, path: "/users/dealers" },
    ],
  },
  {
    section: "SALES",
    items: [
      { name: "Products", icon: Package, path: "/sales/products" },
      { name: "QR Generation", icon: QrCode, path: "/sales/qr" },
      { name: "QR Track", icon: MapPin, path: "/sales/Track" },
      { name: "Catalogue", icon: BookOpen, path: "/sales/catalogue" },
      { name: "Promotions", icon: BadgePercent, path: "/sales/promotions" },
      { name: "Manage Redeemption", icon: Coins, path: "/sales/redeemption" },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { name: "Feed", icon: Newspaper, path: "/system/feed" },
      { name: "Manage Tickets", icon: TicketCheck, path: "/system/tickets" },
      { name: "Announcements", icon: Megaphone, path: "/system/announcements" },
      { name: "Settings", icon: Settings, path: "/system/settings" },
    ],
  },
];

const Sidebar = ({ onLogout, onClose }) => {
  return (
    <aside className="relative w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col h-full transition-all duration-300">
      {/* ===== Header (Logo) ===== */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-[#169698]/10 rounded-md flex items-center justify-center">
            <img src={logo_icon} alt="Logo" className="w-10 h-10 object-contain rounded-sm" />
          </div>
          <h2 className="text-md font-bold text-[#169698] tracking-wide">
            INDOWUD ADMIN
          </h2>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* ===== Scrollable Menu ===== */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        {menuItems.map((menu, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 pl-2 tracking-wider">
              {menu.section}
            </h3>
            <ul className="space-y-1">
              {menu.items.map((item, i) => (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-[#169698]/10 text-[#169698] border border-[#169698]/30 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#169698]"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 stroke-[1.5]" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ===== Logout Button ===== */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50 to-white">
        <button
          onClick={onLogout}
          className="group flex items-center justify-center gap-2.5 w-full py-2.5 rounded-md text-sm font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:text-red-600 hover:border-red-300 transition-all duration-300 active:scale-[0.98]"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-20 blur-md rounded-full transition-all duration-300"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 stroke-[1.6] transition-transform duration-300 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
              />
            </svg>
          </div>
          <span>Logout</span>
        </button>
      </div>


    </aside>
  );
};

export default Sidebar;