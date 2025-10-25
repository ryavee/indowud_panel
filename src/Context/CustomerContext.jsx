import { createContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getCustomers,
  blockCustomer,
  customerKYCVerification,
  sendCustomerNotification,
  importCustomersData,
} from "../Services/customerService";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(null);
  const [kycLoading, setKycLoading] = useState(null);
  const [notificationLoading, setNotificationLoading] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // Fetch all customers
  const fetchCustomerList = async () => {
    setLoading(true);
    try {
      const data = await getCustomers(token);
      const customers = data?.customers || [];
      setCustomersList(customers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomersList([]);
    } finally {
      setLoading(false);
    }
  };

  // Block/unblock a customer
  const blockAppCustomer = async (uid, isUserInActive) => {
    setBlockLoading(uid);
    try {
      await blockCustomer(token, uid, isUserInActive);
      setCustomersList((prevList) =>
        prevList.map((customer) =>
          customer.uid === uid
            ? { ...customer, isBlocked: isUserInActive }
            : customer
        )
      );
      return true;
    } catch (error) {
      console.error("Failed to block customer:", error);
      throw error;
    } finally {
      setBlockLoading(null);
    }
  };

  // Verify or unverify KYC
  const kycVerification = async (uid, isKYCverified) => {
    setKycLoading(uid);
    try {
      await customerKYCVerification(token, uid, isKYCverified);
      setCustomersList((prevList) =>
        prevList.map((customer) =>
          customer.uid === uid
            ? { ...customer, isKYCVerified: isKYCverified }
            : customer
        )
      );
      return true;
    } catch (error) {
      console.error("Failed to update KYC status:", error);
      throw error;
    } finally {
      setKycLoading(null);
    }
  };

  // Send notification to a customer
  const notifyCustomer = async (uid, message) => {
    setNotificationLoading(uid);
    try {
      const response = await sendCustomerNotification(uid, message);
      return response;
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw error;
    } finally {
      setNotificationLoading(null);
    }
  };

  // Import customers from a file
  const uploadCustomersData = async (file) => {
    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await importCustomersData(formData);
      await fetchCustomerList();
      return response;
    } catch (error) {
      console.error("Unexpected error while importing customers:", error);
      // Only throw if it’s a real JS/network error
      throw new Error("Unexpected import error");
    } finally {
      setImportLoading(false);
    }
  };

  // Load customers on mount
  useEffect(() => {
    if (token && customersList.length === 0) {
      fetchCustomerList();
    }
  }, [token]);

  return (
    <CustomerContext.Provider
      value={{
        customersList,
        loading,
        blockAppCustomer,
        blockLoading,
        kycVerification,
        kycLoading,
        notifyCustomer,
        notificationLoading,
        uploadCustomersData,
        importLoading,
        fetchCustomerList,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
