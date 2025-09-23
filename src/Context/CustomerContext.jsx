import { createContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import {
  getCustomers,
  blockCustomer,
  customerKYCVerification,
} from "../Services/customerService";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(null);
  const [kycLoading, setKycLoading] = useState(null);

  const fetchCustomerList = async () => {
    if (!token) return;
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

      setBlockLoading(null);
      return true;
    } catch (error) {
      setBlockLoading(null);
      console.error("Failed to block customer:", error);
      throw error;
    }
  };

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

      setKycLoading(null);
      return true;
    } catch (error) {
      setKycLoading(null);
      console.error("Failed to update KYC status:", error);
      throw error;
    }
  };

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
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
