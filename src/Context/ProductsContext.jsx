import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";

import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../Services/productsServices";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (token) {
      fetchProducts();
    } else {
      setProducts([]);
      setError(null);
    }
  }, [token]);

  const normalizeProduct = (product) => {
    return {
      id: product.productId || product.id,
      productName: product.productName || product.name,
      name: product.productName || product.name,
      ...product,
    };
  };

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

  const addProduct = async (productData) => {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    try {
      setCreating(true);
      setError(null);

      const trimmedName = productData.productName.trim();
      const trimmedProductUnit = productData.productUnit.trim();

      if (!trimmedName) {
        throw new Error("Product name cannot be empty");
      }

      const response = await createProduct(token, {
        productName: trimmedName,
        productUnit: trimmedProductUnit,
      });

      let newProduct;

      if (response?.success && response?.product) {
        newProduct = normalizeProduct(response.product);
      } else if (response?.productId || response?.id) {
        newProduct = normalizeProduct(response);
      } else {
        throw new Error("Invalid response format from server");
      }

      setProducts((prevProducts) => {
        const currentProducts = Array.isArray(prevProducts) ? prevProducts : [];
        return [...currentProducts, newProduct];
      });

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

  const removeProduct = async (productId) => {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    if (!productId) {
      throw new Error("Product ID is required");
    }

    try {
      setDeleting(productId);
      setError(null);

      const productExists = products.find(
        (product) => product.id === productId
      );

      if (!productExists) {
        throw new Error("Product not found");
      }
      const response = await deleteProduct(token, productId);
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to delete product");
      }
      setProducts((prevProducts) => {
        const currentProducts = Array.isArray(prevProducts) ? prevProducts : [];
        return currentProducts.filter((product) => product.id !== productId);
      });
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

  const clearError = () => {
    setError(null);
  };

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
  };

  const value = {
    products: Array.isArray(products) ? products : [],
    loading,
    error,
    creating,
    deleting,

    addProduct,
    removeProduct,
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

  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }

  return context;
};

export default ProductContext;
