import { createContext, useState, useEffect } from "react";
import { getUsersList } from "../Services/userService";
import { useAuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { token, isInitialized } = useAuthContext();
  
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserList = async () => {
    if (!token) {
      console.log("No token available");
      return;
    }
    setLoading(true);
    try {
      const data = await getUsersList(token);
      console.log(data);
      setUsersList(data?.users || []);
    } catch (error) {
      console.log("Error fetching users:", error);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isInitialized && token) {
      fetchUserList();
    } else if (isInitialized && !token) {
      setUsersList([]);
    }
  }, [isInitialized, token]);

  return (
    <UserContext.Provider value={{ usersList, loading, fetchUserList }}>
      {children}
    </UserContext.Provider>
  );
};