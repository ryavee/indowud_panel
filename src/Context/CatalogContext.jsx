import { createContext, useState, useContext, useEffect } from "react";
import {
  getAllCatalogues,
  createCatalogue,
  deleteCatalogue,
} from "../Services/catalogService";
import { useAuthContext } from "./AuthContext";

export const CatalogContext = createContext();

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalogContext must be used within CatalogProvider");
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthContext();

  // Fetch all catalogues on mount
  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCatalogues();
      console.log("Fetched data:", data);

      if (data && data.success && Array.isArray(data.catalogs)) {
        // Map API response to component expected format
        const formattedCatalogs = data.catalogs.map((cat) => ({
          id: cat.id,
          name: cat.name,
          hindiName: cat.hiName,
          pdfName: cat.url.split("/").pop(), // Extract filename from URL
          url: cat.url,
          createdAt: new Date().toISOString().split("T")[0], // Use current date if not provided by API
        }));
        setCatalogs(formattedCatalogs);
      } else {
        setError("Failed to fetch catalogues");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCatalog = async (catalogueData) => {
    if (!token) {
      setError("No token available");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await createCatalogue(token, catalogueData);
      console.log("Create result:", result);

      if (result && result.success) {
        const newCatalog = {
          id: result.id || result.data?.id,
          name: result.name || result.data?.name,
          hindiName: result.hiName || result.data?.hiName,
          pdfName: (result.url || result.data?.url || "").split("/").pop(),
          url: result.url || result.data?.url,
          createdAt: new Date().toISOString().split("T")[0],
        };

        // Refresh to get updated list from server
        await fetchCatalogs();

        return newCatalog;
      } else {
        setError(result?.message || "Failed to create catalogue");
        return null;
      }
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCatalog = async (catalogueId) => {
    if (!token) {
      setError("No token available");
      return false;
    }

    setDeleting(true);
    setError(null);
    try {
      const result = await deleteCatalogue(token, catalogueId);
      console.log("Delete result:", result);

      if (result && result.success) {
        setCatalogs((prev) => prev.filter((cat) => cat.id !== catalogueId));
        setError(null);
        return true;
      } else {
        const errorMsg = result?.message || "Failed to delete catalogue";
        setError(errorMsg);
        console.error("Delete error:", errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = err.message || "An error occurred while deleting";
      setError(errorMsg);
      console.error("Delete error:", err);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const value = {
    catalogs,
    loading,
    deleting,
    error,
    fetchCatalogs,
    addCatalog,
    removeCatalog,
  };

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};
