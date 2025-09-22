import { createContext, useState, useContext, useEffect } from "react";
import { loginToAdminPortal, getUserData } from "../Services/authService";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }

    setIsInitialized(true);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const loginRes = await loginToAdminPortal(email, password);

      if (!loginRes) {
        const errorMessage = "Login failed - Invalid credentials";
        setError(errorMessage);
        setLoading(false);
        throw new Error(errorMessage);
      }

      const idToken = loginRes.idToken;
      const refreshToken = loginRes.refreshToken;

      setToken(idToken);
      setRefreshToken(refreshToken);

      localStorage.setItem("authToken", idToken);
      localStorage.setItem("refreshToken", refreshToken);
      const userData = await getUserData(loginRes.uid, idToken);
      if(!userData) {
        const errorMessage = "User data not found";
        setError(errorMessage);
        setLoading(false);
        throw new Error(errorMessage);
      }
      setUserData(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setError(null);
      setLoading(false);
      return userData;
    } catch (error) {
      console.log("Login error:", error);
      setLoading(false);

      const errorMessage =
        error.message ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUserData(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        token,
        login,
        logout,
        loading,
        error,
        setError,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
