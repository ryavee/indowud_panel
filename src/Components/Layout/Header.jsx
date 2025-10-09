import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import logo from "../../assets/logo_Indowud.png";
import { useAuthContext } from "../../Context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { userData } = useAuthContext();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getInitials = (firstName, lastName) => {
    return (
      `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() ||
      "U"
    );
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Logo + Company Name */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#169698]/10 rounded-lg flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="hidden sm:block text-lg font-bold text-[#169698] leading-tight tracking-tight">
              INDOWUD NFC PRIVATE LIMITED
            </h1>
          </div>
        </div>

        {/* Right: User Info + Avatar */}
        <div className="flex items-center gap-4">
          {/* Time Display (hidden on mobile) */}
          <div className="hidden sm:flex flex-col items-end text-xs text-gray-500">
            <span className="font-medium text-gray-800">
              {formatDate(time)}
            </span>
            <span className="text-gray-600">{formatTime(time)}</span>
          </div>

          {/* User Details */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-gray-800 font-medium text-sm">
                {userData?.user.firstName} {userData?.user.lastName}
              </span>
              <span className="text-gray-500 text-xs">
                {userData?.user.email}
              </span>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#169698]/10 text-[#169698] font-bold shadow-sm flex items-center justify-center overflow-hidden">
              {userData?.user.profileImage ? (
                <img
                  src={userData.user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <span
                className="font-semibold"
                style={{
                  display: userData?.user.profileImage ? "none" : "flex",
                }}
              >
                {getInitials(
                  userData?.user.firstName,
                  userData?.user.lastName
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;