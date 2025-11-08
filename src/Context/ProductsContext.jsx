import { createContext, useState, useEffect, useContext } from "react";

import {
  getProducts,
  createProduct,
  updateProductService,
  deleteProduct,
  importproducts,
} from "../Services/productsServices.js";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [importing, setImporting] = useState(false);

  const normalizeProduct = (product) => ({
    id: product.id,
    productId: product.productId,
    productName: product.productName,
    productUnit: product.productUnit,
    productPoint: Number(product.productPoint) || 0,
  });

  // ✅ Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProducts();

      let productsData = [];

      // Handle different response formats
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

      setProducts(productsData.map(normalizeProduct));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch products";
      setError(message);
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setCreating(true);
      setError(null);

      const trimmedName = productData.productName?.trim();
      const trimmedUnit = productData.productUnit?.trim();
      const productPoint = Number(productData.productPoint) || 0;

      if (!trimmedName) throw new Error("Product name cannot be empty");
      if (!trimmedUnit) throw new Error("Product unit cannot be empty");

      const response = await createProduct({
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

      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create product";
      setError(message);
      console.error("Error creating product:", err);
      throw new Error(message);
    } finally {
      setCreating(false);
    }
  };

  const updateProduct = async (id, productData) => {
    if (!id) throw new Error("Product ID is required");
    try {
      setError(null);
      const trimmedName = productData.productName?.trim() || "N/A";
      const trimmedUnit = productData.productUnit?.trim() || "N/A";
      const productPoint = Number(productData.productPoint) || 0;
      const response = await updateProductService({
        id,
        productId: productData.productId,
        productName: trimmedName,
        productUnit: trimmedUnit,
        productPoint,
      });
      if (!response?.success || !response?.product) {
        throw new Error(response?.message || "Failed to update product");
      }

      const updatedProduct = normalizeProduct(response.product);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedProduct.id || p.productId === updatedProduct.productId
            ? updatedProduct
            : p
        )
      );

      return updatedProduct;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update product";
      setError(message);
      console.error("Error updating product:", err);
      throw new Error(message);
    }
  };
  const removeProduct = async (id) => {
    if (!id) throw new Error("Product ID is required");

    try {
      setDeleting(id);
      setError(null);

      const productExists = products.find((p) => p.id === id);
      if (!productExists) throw new Error("Product not found");

      const response = await deleteProduct(id);
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete product";
      setError(message);
      console.error("Error deleting product:", err);
      throw new Error(message);
    } finally {
      setDeleting(null);
    }
  };

  const importProductsFromFile = async (file) => {
    try {
      setImporting(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await importproducts(formData);
      const importData = response?.products || response?.data || {};
      const successCount = importData.successCount || 0;
      const skipped = importData.skipped || [];
      const failed = importData.failed || [];

      if (skipped.length > 0) console.warn(`⚠ Skipped products:`, skipped);
      if (failed.length > 0) console.error(`✗ Failed products:`, failed);

      await fetchProducts();

      return { successCount, skipped, failed };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to import products";
      setError(message);
      console.error("Error importing products:", err);
      throw new Error(message);
    } finally {
      setImporting(false);
    }
  };

  const clearError = () => setError(null);
  const refreshProducts = () => fetchProducts();
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
    updateProduct,
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
