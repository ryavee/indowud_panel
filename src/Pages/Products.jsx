import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  Loader,
  Package,
} from "lucide-react";
import { useProductContext } from "../Context/ProductsContext";

const Products = () => {
  const {
    products,
    loading,
    creating,
    deleting,
    addProduct,
    removeProduct,
    refreshProducts,
  } = useProductContext();

  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [formError, setFormError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleAddProduct = async () => {
    setFormError("");
    if (!newProductName.trim() || !newProductUnit.trim()) {
      setFormError("Both fields are required");
      return;
    }
    try {
      await addProduct({
        productName: newProductName.trim(),
        productUnit: newProductUnit.trim(),
      });
      setNewProductName("");
      setNewProductUnit("");
      setShowSuccessMessage(`"${newProductName.trim()}" added successfully!`);
    } catch (err) {
      setFormError("Failed to add product");
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Products
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your product list and inventory.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
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
        )}

        {/* Add Product Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" /> Add New Product
          </h2>

          {formError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm">{formError}</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Unit (e.g., 08 mm, 15mm, etc.)"
              value={newProductUnit}
              onChange={(e) => setNewProductUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddProduct}
            disabled={creating || !newProductName.trim() || !newProductUnit.trim()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {creating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Product
              </>
            )}
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                Products
              </h2>
              <p className="text-xs text-gray-500">
                {products.length} {products.length === 1 ? "item" : "items"}
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader className="w-4 h-4 animate-spin" /> Updating...
              </div>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <Loader size={24} className="animate-spin mx-auto mb-3 text-gray-400" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <Package className="mx-auto mb-3 text-orange-400" size={26} />
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase tracking-wider w-10">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-gray-500 font-medium uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-right text-gray-500 font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-orange-50/40 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {product.name || product.productName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {product.productUnit}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleDeleteProduct(
                              product.id,
                              product.name || product.productName
                            )
                          }
                          disabled={deleting === product.id}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                        >
                          {deleting === product.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
