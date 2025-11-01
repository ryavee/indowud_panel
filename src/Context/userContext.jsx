import { createContext, useState, useEffect, useRef } from "react";
import {
  getUsersList,
  createUser,
  updateUser,
  deleteUser,
  uploadUserData,
} from "../Services/userService";
import { useAuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { token, isInitialized } = useAuthContext();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createOrUpdateUserLoading, setCreateOrUpdateUserLoading] =
    useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const sortUsersByCreatedAt = (users) => {
    return [...users].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
  };

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const data = await getUsersList(token);
      const users = data?.users || [];
      setUsersList(sortUsersByCreatedAt(users));
      setHasFetched(true);
    } catch (error) {
      console.log("Error fetching users:", error);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && token && !hasFetched) {
      console.log("Fetching on here");
      
      fetchUserList().then(() => setHasFetched(true));
    } else if (isInitialized && !token) {
      setUsersList([]);
      setHasFetched(false);
    }
  }, [isInitialized, token]);

  const createUserAdminPortal = async (newUserData) => {
    setCreateOrUpdateUserLoading(true);
    try {
      const data = await createUser(token, newUserData);
      if (data.success) {
        const newUser = { ...data.user };
        setUsersList((prev) => sortUsersByCreatedAt([newUser, ...prev]));
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || data.error || "Failed to create user",
        };
      }
    } catch (error) {
      let errorMessage = error.message || "An unexpected error occurred";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return { success: false, error: errorMessage };
    } finally {
      setCreateOrUpdateUserLoading(false);
    }
  };

  const updateUserData = async (updatedUserData) => {
    setCreateOrUpdateUserLoading(true);
    try {
      const data = await updateUser(token, updatedUserData);
      if (data.success) {
        setUsersList((prev) => {
          const updatedList = prev.map((user) =>
            user.uid === updatedUserData.uid
              ? { ...user, ...updatedUserData, ...data.user }
              : user
          );
          return sortUsersByCreatedAt(updatedList);
        });
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || data.error || "Failed to update user",
        };
      }
    } catch (error) {
      let errorMessage = error.message || "An unexpected error occurred";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return { success: false, error: errorMessage };
    } finally {
      setCreateOrUpdateUserLoading(false);
    }
  };

  const deleteUserFromPortal = async (uid) => {
    setDeleteLoading(true);
    try {
      const data = await deleteUser(token, uid);
      if (data.success) {
        setUsersList((prev) => prev.filter((user) => user.uid !== uid));
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.message || data.error || "Failed to delete user",
        };
      }
    } catch (error) {
      let errorMessage = error.message || "An unexpected error occurred";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return { success: false, error: errorMessage };
    } finally {
      setDeleteLoading(false);
    }
  };

  const uploadUserFile = async (file) => {
    setUploadLoading(true);
    try {
      const data = await uploadUserData(file);

      if (data.success) {
        await fetchUserList();
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          error: data.message || data.error || "File upload failed",
        };
      }
    } catch (error) {
      let errorMessage = error.message || "An unexpected error occurred";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return { success: false, error: errorMessage };
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        usersList,
        loading,
        createOrUpdateUserLoading,
        deleteLoading,
        uploadLoading,
        fetchUserList,
        createUserAdminPortal,
        updateUserData,
        deleteUserFromPortal,
        uploadUserFile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
