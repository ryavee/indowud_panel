import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { getAllQRData, searchQRByBatch } from "../Services/trackQRDataService";

export const TrackQRDataContext = createContext();

export const TrackQRDataProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [qrData, setQRData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchQRData = async (currentPage) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getAllQRData(token, currentPage);

      const qrCodes = response?.qrCodes?.qrCodes || [];
      const pages = response?.qrCodes?.totalPages || 1;
      const totalCount = response?.qrCodes?.totalCount || 0;

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
      setTotalItems(totalCount);
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

  const searchQRData = async (query) => {
    if (!query) return;

    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const response = await searchQRByBatch(query);
      const qrCodes = response?.qrCodes || [];

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
      setTotalPages(1);
      setTotalItems(qrCodes.length);
    } catch (err) {
      console.error("Error searching QR data:", err);
      setError(err.message || "Failed to search QR data");
      setQRData([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchQRData(page);
    }
  }, [token, page, searchQuery]);

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
        searchQRData,
        setSearchQuery,
      }}
    >
      {children}
    </TrackQRDataContext.Provider>
  );
};
export const useTrackQRData = () => {
  return useContext(TrackQRDataContext);
}
