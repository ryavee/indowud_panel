import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  RefreshCw,
  X,
  AlertCircle,
  Loader,
  Package,
  Search,
} from "lucide-react";
import { useProductContext } from "../Context/ProductsContext";

const Products = () => {
  const {
    products,
    loading,
    error,
    creating,
    deleting,
    addProduct,
    removeProduct,
    clearError,
    refreshProducts,
  } = useProductContext();

  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleAddProduct = async () => {
    try {
      setFormError("");
      if (!newProductName.trim()) {
        setFormError("Product name is required");
        return;
      }
      if (!newProductUnit.trim()) {
        setFormError("Product unit is required");
        return;
      }
      await addProduct({ 
        productName: newProductName.trim(),
        productUnit: newProductUnit.trim()
      });
      setNewProductName("");
      setNewProductUnit("");
      setShowSuccessMessage(`"${newProductName.trim()}" added successfully!`);
    } catch (err) {
      setFormError(err.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await removeProduct(productId);
        setShowSuccessMessage(`"${productName}" deleted successfully!`);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddProduct();
    }
  };

  return (
    <div className=" mx-auto space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-green-800 font-medium">{showSuccessMessage}</p>
          </div>
        </div>
      )}
      
      {/* Add Product Form */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add New Product</h2>
        </div>

        {/* Form Error */}
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={16} />
              <p className="text-red-700 text-sm">{formError}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Product Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => {
                setNewProductName(e.target.value);
                if (formError) setFormError("");
              }}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              onKeyPress={handleKeyPress}
              disabled={creating}
            />
          </div>

          {/* Product Unit Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Unit
            </label>
            <input
              type="text"
              value={newProductUnit}
              onChange={(e) => {
                setNewProductUnit(e.target.value);
                if (formError) setFormError("");
              }}
              placeholder="Enter unit (e.g., 08 mm, 15mm, 20 mm, etc.)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              onKeyPress={handleKeyPress}
              disabled={creating}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddProduct}
            disabled={creating || !newProductName.trim() || !newProductUnit.trim()}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <Loader size={16} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Product List ({products.length})
            </h2>
            {loading && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="p-8 text-center">
            <Loader
              size={24}
              className="animate-spin mx-auto mb-3 text-gray-400"
            />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus size={24} className="text-gray-400" />
              </div>
            </div>
            <h3 className="font-medium mb-2">No products found</h3>
            <p className="text-sm">
              Add your first product above to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name || product.productName} {product.productUnit}
                  </h3>
                  <div className="space-y-1">
                    {product.id && (
                      <p className="text-xs text-gray-500">
                        ID: {product.id}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id, product.name || product.productName)}
                  disabled={deleting === product.id}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[40px] flex items-center justify-center"
                  title={
                    deleting === product.id ? "Deleting..." : "Delete product"
                  }
                >
                  {deleting === product.id ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;