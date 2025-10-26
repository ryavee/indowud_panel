import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";

import {
  getProducts,
  createProduct,
  deleteProduct,
  importproducts,
} from "../Services/productsServices";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProducts();
    } else {
      setProducts([]);
      setError(null);
    }
  }, [token]);

  const normalizeProduct = (product) => ({
    id: product.productId || product.id,
    productId: product.productId || product.id,
    productName: product.productName || product.name,
    name: product.productName || product.name,
    productUnit: product.productUnit,
    productPoint: product.productPoint ?? 0,
    ...product,
  });

  // Fetch products
  const fetchProducts = async () => {
    if (!token) {
      setError("Authentication token is required");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await getProducts();
      let productsData = [];

      if (response?.success && Array.isArray(response.products)) {
        productsData = response.products;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else if (response?.products && Array.isArray(response.products)) {
        productsData = response.products;
      } else {
        console.warn("Unexpected products data format:", response);
        productsData = [];
      }

      const normalizedProducts = productsData.map(normalizeProduct);
      setProducts(normalizedProducts);
      console.log("✓ Products fetched:", normalizedProducts.length);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch products";
      setError(errorMessage);
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a product
  const addProduct = async (productData) => {
    if (!token) throw new Error("Authentication token is required");

    try {
      setCreating(true);
      setError(null);

      const trimmedName = productData.productName?.trim();
      const trimmedUnit = productData.productUnit?.trim();
      const productPoint = Number(productData.productPoint) || 0;

      if (!trimmedName) throw new Error("Product name cannot be empty");
      if (!trimmedUnit) throw new Error("Product unit cannot be empty");

      const response = await createProduct(token, {
        productName: trimmedName,
        productUnit: trimmedUnit,
        productPoint,
      });

      let newProduct;
      if (response?.success && response?.product) {
        newProduct = normalizeProduct(response.product);
      } else if (response?.productId || response?.id) {
        newProduct = normalizeProduct(response);
      } else {
        throw new Error("Invalid response format from server");
      }

      newProduct.productPoint = newProduct.productPoint ?? productPoint;

      setProducts((prev) => [...prev, newProduct]);

      return newProduct;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create product";
      setError(errorMessage);
      console.error("Error creating product:", err);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Update a product
  const updateProduct = async (productId, productData) => {
    if (!token) throw new Error("Authentication token is required");
    if (!productId) throw new Error("Product ID is required");

    try {
      setError(null);

      const trimmedName = productData.productName?.trim();
      const trimmedUnit = productData.productUnit?.trim();
      const productPoint = Number(productData.productPoint) || 0;

      if (!trimmedName) throw new Error("Product name cannot be empty");
      if (!trimmedUnit) throw new Error("Product unit cannot be empty");

      const response = await updateProductService(token, productId, {
        productName: trimmedName,
        productUnit: trimmedUnit,
        productPoint,
      });

      if (!response) {
        throw new Error("Failed to update product");
      }

      let updatedProduct;
      if (response?.success && response?.product) {
        updatedProduct = normalizeProduct(response.product);
      } else if (response?.productId || response?.id) {
        updatedProduct = normalizeProduct(response);
      } else {
        updatedProduct = normalizeProduct({
          ...productData,
          id: productId,
          productId: productId,
        });
      }

      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );

      return updatedProduct;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update product";
      setError(errorMessage);
      console.error("Error updating product:", err);
      throw new Error(errorMessage);
    }
  };

  // Remove a product
  const removeProduct = async (productId) => {
    if (!token) throw new Error("Authentication token is required");
    if (!productId) throw new Error("Product ID is required");

    try {
      setDeleting(productId);
      setError(null);

      const productExists = products.find((p) => p.id === productId);
      if (!productExists) throw new Error("Product not found");

      const response = await deleteProduct(token, productId);
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to delete product");
      }

      // Update local state immediately
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      console.log("✓ Product deleted and state updated");
      return true;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete product";
      setError(errorMessage);
      console.error("Error deleting product:", err);
      throw new Error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  // Import products from a file
  const importProductsFromFile = async (file) => {
    if (!token) throw new Error("Authentication token is required");

    try {
      setImporting(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      console.log("Starting import...");
      const response = await importproducts(formData);

      console.log("Import response received:", response);

      // Extract data from the nested structure
      const importData = response?.products || response?.data || {};
      const successCount = importData.successCount || 0;
      const skipped = importData.skipped || [];
      const failed = importData.failed || [];

      console.log(`✓ Import completed: ${successCount} products added`);

      if (skipped.length > 0) {
        console.warn(`⚠ ${skipped.length} products skipped:`, skipped);
      }
      if (failed.length > 0) {
        console.error(`✗ ${failed.length} products failed:`, failed);
      }

      // CRITICAL FIX: Always fetch products after import, even if successCount is 0
      // The backend might have processed products successfully
      console.log("Fetching updated products...");
      await fetchProducts();
      console.log("✓ Products refreshed successfully");

      return {
        successCount,
        skipped,
        failed,
      };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to import products";
      setError(errorMessage);
      console.error("Error importing products:", err);
      throw new Error(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  const clearError = () => setError(null);

  const refreshProducts = async () => {
    if (!token) {
      setError("Please log in to refresh products");
      return;
    }
    try {
      await fetchProducts();
    } catch (err) {
      console.error("Error refreshing products:", err);
    }
  };

  const resetState = () => {
    setProducts([]);
    setLoading(false);
    setError(null);
    setCreating(false);
    setDeleting(null);
    setImporting(false);
  };

  const value = {
    products,
    loading,
    error,
    creating,
    deleting,
    importing,

    addProduct,
    updateProduct, // NOW EXPORTED
    removeProduct,
    importProductsFromFile,
    clearError,
    refreshProducts,
    fetchProducts,
    resetState,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductContext must be used within a ProductProvider");
  return context;
};

export default ProductContext;
