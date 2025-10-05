import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { getAllQRData } from "../Services/trackQRDataService";

export const TrackQRDataContext = createContext();

export const TrackQRDataProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [qrData, setQRData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchQRData = async (currentPage) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getAllQRData(token, currentPage);

      // Handle the nested response structure from your API
      const qrCodes = response?.qrCodes?.qrCodes || [];
      const pages = response?.qrCodes?.totalPages || 1;
      const totalCount = response?.qrCodes?.totalCount || 0; // Get actual total count
      const currentPageNum = response?.qrCodes?.currentPage || currentPage;

      // Transform location data from lon/lat to lng/lat for consistency
      const transformedQrCodes = qrCodes.map((qr) => ({
        ...qr,
        location:
          qr.lon && qr.lat
            ? {
                lng: qr.lon,
                lat: qr.lat,
              }
            : null,
      }));

      setQRData(transformedQrCodes);
      setTotalPages(pages);
      setTotalItems(totalCount); // Use the actual totalCount from API
    } catch (err) {
      console.error("Error fetching QR data:", err);
      setError(err.message || "Failed to fetch QR data");
      setQRData([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRData(page);
  }, [token, page]);

  return (
    <TrackQRDataContext.Provider
      value={{
        qrData,
        loading,
        error,
        page,
        totalPages,
        totalItems,
        setPage,
        fetchQRData,
      }}
    >
      {children}
    </TrackQRDataContext.Provider>
  );
};

// Custom hook for using the context
export const useTrackQRData = () => {
  const context = useContext(TrackQRDataContext);
  if (!context) {
    throw new Error("useTrackQRData must be used within TrackQRDataProvider");
  }
  return context;
};
