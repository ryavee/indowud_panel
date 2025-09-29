import { createContext, useState, useContext } from "react";
import {
  getAllBatches,
  getBatchById,
  generateQR,
} from "../Services/codesServices";
import { useAuthContext } from "./AuthContext";

export const CodesContext = createContext();

export const CodesProvider = ({ children }) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuthContext();

  const generateQRCodes = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        noOfCodes: parseInt(formData.numberOfCodes),
        dealerId: formData.dealerId.toString(),
        productId: formData.productId.toString(),
        batchId: formData.batchId.toString(),
        expiryDate:
          formData.expiryType === "custom" && formData.customDate
            ? formData.customDate
            : "None",
        remark: formData.remarks || "",
      };

      const response = await generateQR(token, payload);

      console.log(response);

      if (response.success && response.qrCode) {
        const newQRData = {
          id: response.qrCode.batchId,
          batchId: response.qrCode.batchId,
          productName: formData.productName,
          productId: formData.productId,
          dealerName: formData.dealerName,
          dealerId: formData.dealerId,
          totalGenerated: response.qrCode.totalGenerated,
          points: response.qrCode.points,
          qrCodes: response.qrCode.qrCodes,
          createdAt: new Date().toLocaleString(),
          expiryType: formData.expiryType,
          customDate: formData.customDate,
          remarks: formData.remarks,
        };

        setQrCodes((prev) => [newQRData, ...prev]);
        return { success: true, data: newQRData };
      }

      throw new Error(response.message || "Failed to generate QR codes");
    } catch (err) {
      setError(err.message || "An error occurred while generating QR codes");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllBatches(token);

      if (response.success && response.batches) {
        setBatches(response.batches);
        return { success: true, data: response.batches };
      }

      throw new Error(response.message || "Failed to fetch batches");
    } catch (err) {
      setError(err.message || "An error occurred while fetching batches");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchById = async (batchId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBatchById(token, batchId);

      if (response.success && response.batch) {
        setSelectedBatch(response.batch);
        return { success: true, data: response.batch };
      }

      throw new Error(response.message || "Failed to fetch batch");
    } catch (err) {
      setError(err.message || "An error occurred while fetching batch");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    qrCodes,
    batches,
    selectedBatch,
    loading,
    error,
    generateQRCodes,
    fetchAllBatches,
    fetchBatchById,
    setQrCodes,
    setBatches,
    setSelectedBatch,
  };

  return (
    <CodesContext.Provider value={value}>{children}</CodesContext.Provider>
  );
};

export const useCodesContext = () => {
  const context = useContext(CodesContext);
  if (!context) {
    throw new Error("useCodesContext must be used within CodesProvider");
  }
  return context;
};
