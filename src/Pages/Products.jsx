import { useState, useEffect } from "react";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  Loader,
  Package,
  CheckCircle,
} from "lucide-react";
import { useProductContext } from "../Context/ProductsContext";
import ActionButtons from "../Components/Reusable/ActionButtons";
import ConfirmationModal from "../Components/ConfirmationModal";
import Pagination from "../Components/Reusable/Pagination";


const Products = () => {
  const {
    products,
    loading,
    creating,
    deleting,
    addProduct,
    removeProduct,
    refreshProducts,
    updateProduct, // ✅ Make sure this exists in context
  } = useProductContext();

  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [formError, setFormError] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleAddProduct = async () => {
    setFormError("");
    if (!newProductName.trim() || !newProductUnit.trim()) {
      setFormError("Both fields are required.");
      return;
    }
    try {
      await addProduct({
        productName: newProductName.trim(),
        productUnit: newProductUnit.trim(),
      });
      setToastMsg(`✅ "${newProductName}" added successfully!`);
      setNewProductName("");
      setNewProductUnit("");
    } catch {
      setFormError("Failed to add product. Please try again.");
    }
  };

  const handleDelete = (product) => setDeleteTarget(product);
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeProduct(deleteTarget.id);
      setToastMsg(`🗑️ "${deleteTarget.productName}" deleted successfully!`);
      setDeleteTarget(null);
    } catch {
      setFormError("Error deleting product.");
    }
  };

  const handleEdit = (product) => {
    setEditTarget({
      ...product,
      productName: product.productName || product.name,
      productUnit: product.productUnit,
    });
  };

  const handleUpdateProduct = async () => {
    if (!editTarget.productName.trim() || !editTarget.productUnit.trim()) return;
    setEditLoading(true);
    try {
      await updateProduct(editTarget.id, {
        productName: editTarget.productName.trim(),
        productUnit: editTarget.productUnit.trim(),
      });
      setToastMsg(`✏️ "${editTarget.productName}" updated successfully!`);
      setEditTarget(null);
    } catch {
      setFormError("Error updating product.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#169698] hover:bg-[#128083] rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-6 flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-lg shadow-lg animate-fade-in-down z-50">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-800 text-sm font-medium">{toastMsg}</p>
          </div>
        )}

        {/* Add Product Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#169698]" /> Add New Product
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
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#169698] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Unit (e.g., 08 mm, 15 mm)"
              value={newProductUnit}
              onChange={(e) => setNewProductUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#169698] focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddProduct}
            disabled={creating}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-[#169698] hover:bg-[#128083] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                Product List
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
              <Package className="mx-auto mb-3 text-[#169698]" size={28} />
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
                  {paginatedProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#169698]/5 transition-all duration-200"
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
                        <ActionButtons
                          onEdit={() => handleEdit(product)}
                          onDelete={() => handleDelete(product)}
                          loadingDelete={deleting === product.id}
                          disableAll={creating || loading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            {/* Pagination Component */}
            <div className="bg-gray-50 border-t border-gray-100 ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            />

            </div>
            </div>

          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.productName}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting === deleteTarget?.id}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Edit Modal */}
      <ConfirmationModal
        isOpen={!!editTarget}
        title="Edit Product"
        message={
          <div className="space-y-3">
            <input
              type="text"
              value={editTarget?.productName || ""}
              onChange={(e) =>
                setEditTarget((prev) => ({ ...prev, productName: e.target.value }))
              }
              placeholder="Product Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698] focus:outline-none"
            />
            <input
              type="text"
              value={editTarget?.productUnit || ""}
              onChange={(e) =>
                setEditTarget((prev) => ({ ...prev, productUnit: e.target.value }))
              }
              placeholder="Product Unit"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698] focus:outline-none"
            />
          </div>
        }
        onConfirm={handleUpdateProduct}
        onCancel={() => setEditTarget(null)}
        isLoading={editLoading}
        confirmText="Update"
        cancelText="Cancel"
        type="info"
        closeOnBackdrop={false}
      />
    </div>
  );
};

export default Products;
