import { useState, useEffect, useContext } from "react";
import { Bell } from "lucide-react";
import logo from "../../assets/logo_Indowud.png";
import { useAuthContext } from "../../Context/AuthContext";

const Header = () => {
  const { userData } = useAuthContext();
  const [time, setTime] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);
  const [photo, setPhoto] = useState(null);

  // live updating time
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // initials if no photo
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 shadow-md"
      style={{ backgroundColor: "#fe9f45" }}
    >
      {/* Left: Logo + Company Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold text-white">
          Indowud Private Limited
        </h1>
      </div>

      {/* Center: Date and Time */}
      <div className="text-white font-semibold">
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4 text-white relative">
        <Bell className="w-6 h-6 cursor-pointer" />

        <span>{userData ? userData.user.email : "Guest"}</span>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        >
          {
            <span className="font-bold">
              {getInitials(userData?.user.firstName)}
            </span>
          }
        </div>
 
        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-lg w-56 p-4">
            <h3 className="font-semibold mb-2">Profile</h3>

            {/* Change Name */}
            <input
              type="text"
              placeholder="Change Name"
              className="border rounded p-2 w-full mb-2"
            />

            {/* Change Photo */}
            <label className="block mb-2 cursor-pointer">
              <span className="text-sm text-gray-700">Change Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>

            {/* Logout */}
            <button
              onClick={logout}
              className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
