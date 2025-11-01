export const getCurrentUserRole = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return "Guest";
    const user = JSON.parse(userData);
    return user?.role || user?.user?.role || "Guest";
  } catch (error) {
    console.error("Error parsing user data:", error);
    return "Guest";
  }
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    return parsed.user; 
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  QR_GENERATE: "QR Generate",
};
