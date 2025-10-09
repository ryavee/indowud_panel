import { useState, useEffect } from "react";
import logo from "../../assets/logo_Indowud.png";
import { useAuthContext } from "../../Context/AuthContext";

const Header = () => {
  const { userData } = useAuthContext();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getInitials = (firstName, lastName) => {
    return (
      `${firstName?.charAt(0) || ""}${
        lastName?.charAt(0) || ""
      }`.toUpperCase() || "U"
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo + Company Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <img src={logo} alt="" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              INDOWUD NFC PRIVATE LIMITED
            </h1>
          </div>
        </div>

        {/* Right: User Info + Avatar */}
        <div className="flex items-center gap-3 ml-auto">
          {/* User Info */}
          <div className="flex flex-col items-end">
            <span className="text-white font-medium text-sm">
              {userData?.user.firstName} {userData?.user.lastName}
            </span>
            <span className="text-orange-100 text-xs">
              {userData?.user.email}
            </span>
            <div className="text-orange-200 text-xs">
              {formatDate(time)} • {formatTime(time)}
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
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
              className="font-bold text-orange-500 text-sm"
              style={{
                display: userData?.user.profileImage ? "none" : "flex",
              }}
            >
              {getInitials(userData?.user.firstName, userData?.user.lastName)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
