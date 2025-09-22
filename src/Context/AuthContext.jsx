import { createContext, useState, useContext } from "react";
import { loginToAdminPortal, getUserData } from "../Services/authService";

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setToken(idToken);
      localStorage.setItem("authToken", idToken);

      const userData = await getUserData(loginRes.uid, idToken);
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
  };

  return (
    <AuthContext.Provider
      value={{ userData, token, login, logout, loading, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
}
