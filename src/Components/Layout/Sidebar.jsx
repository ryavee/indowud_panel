import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logo_icon from "../../assets/Icon_Indowud.png";
import { X, LogOut } from "lucide-react";
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
} from "lucide-react";

const Sidebar = ({ onLogout, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.user?.role || "Guest";

  // ==== MENU CONFIG ====
  const allMenuItems = [
    {
      section: "MAIN",
      items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
    },
    {
      section: "USERS",
      items: [
        { name: "Users", icon: Building2, path: "/factoryUsers" },
        { name: "Customers", icon: Users, path: "/customers" },
        { name: "Dealers", icon: Briefcase, path: "/dealers" },
      ],
    },
    {
      section: "PRODUCT ENDPOINTS",
      items: [
        { name: "Products", icon: Package, path: "/products" },
        { name: "QR Generation", icon: QrCode, path: "/qr" },
        { name: "QR Track", icon: MapPin, path: "/Track" },
        { name: "Catalogue", icon: BookOpen, path: "/catalogue" },
        { name: "Bonus Promotion", icon: BadgePercent, path: "/promotions" },
        { name: "Manage Redemption", icon: Coins, path: "/redemption" },
      ],
    },
    {
      section: "SYSTEM",
      items: [
        { name: "Feed", icon: Newspaper, path: "/feed" },
        { name: "Manage Tickets", icon: TicketCheck, path: "/tickets" },
        {name: "Announcements", icon: Megaphone, path: "/announcements",},
        { name: "Settings", icon: Settings, path: "/settings" },
      ],
    },
  ];

  // ==== ROLE PERMISSIONS ====
  const rolePermissions = {
    Admin: ["*"], // Full access
    "Super Admin": ["*"], // Full access
    "QR Generate": ["Dealers", "Products", "QR Generation"], // Restricted
  };

  const allowed = rolePermissions[role] || [];

  // ==== FILTER MENU BASED ON ROLE ====
  let filteredMenu = allMenuItems
    .map((menu) => ({
      ...menu,
      items: menu.items.filter(
        (item) => allowed.includes("*") || allowed.includes(item.name)
      ),
    }))
    .filter((menu) => menu.items.length > 0);

  // Fallback: Show all if misconfigured role
  if (filteredMenu.length === 0) {
    console.warn(`⚠️ No menu found for role: "${role}". Showing all menus.`);
    filteredMenu = allMenuItems;
  }

  // ==== AUTO-REDIRECT QR GENERATE USERS ====
  useEffect(() => {
    if (role === "QR Generate" && location.pathname === "/dashboard") {
      navigate("/qr", { replace: true }); // ✅ fixed route
    }
  }, [role, navigate, location.pathname]);

  return (
    <aside className="relative w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col h-full transition-all duration-300">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-[#169698]/10 rounded-md flex items-center justify-center">
            <img
              src={logo_icon}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-sm"
            />
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
        {filteredMenu.map((menu, idx) => (
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
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
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
          <LogOut className="w-5 h-5 stroke-[1.6]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
