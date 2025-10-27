import React, { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { usePromotionalContext } from "../Context/PromotionalContext";
import { useProductContext } from "../Context/ProductsContext";
import ProductSelectComponent from "../Components/select_product";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import ActionButtons from "../Components/Reusable/ActionButtons";
import Pagination from "../Components/Reusable/Pagination";

const StatusBadge = ({ status }) => {
  const getStatusColor = (isActive) =>
    isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status ? "Active" : "Inactive"}
    </span>
  );
};

const CategoryBadge = ({ category }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "Bonus":
        return "bg-blue-100 text-blue-800";
      case "Product Offer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
        category
      )}`}
    >
      {category}
    </span>
  );
};

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <p className="text-sm text-red-800">{error}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Promotions = () => {
  const {
    promotions = [],
    loading,
    error,
    createPromotion,
    editPromotion,
    removePromotion,
    clearError,
  } = usePromotionalContext();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProductContext();

  // UI + form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);

  // operation loaders (local)
  const [createOrUpdateLoading, setCreateOrUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({ edit: null, delete: null });

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(promotions.length / pageSize));

  useEffect(() => {
    // clamp current page if totalPages shrinks
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // slice promotions to show per page
  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return promotions.slice(start, start + pageSize);
  }, [promotions, currentPage, pageSize]);

  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    Discription: "",
    isActive: true,
    category: "Bonus",
    point: "",
  });

  useEffect(() => {
    // Reset form if modal closes and not editing
    if (!isModalOpen) {
      setFormData({
        productName: "",
        productId: "",
        Discription: "",
        isActive: true,
        category: "Bonus",
        point: "",
      });
      setEditingPromotion(null);
    }
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "productName") {
      const selectedProduct = products.find((p) => p.productName === value);
      setFormData((prev) => ({
        ...prev,
        productName: value,
        productId: selectedProduct ? selectedProduct.id : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.productName || !formData.Discription || !formData.point) {
      alert("Please fill in all required fields");
      return;
    }

    setCreateOrUpdateLoading(true);

    try {
      const promotionData = { ...formData, point: parseInt(formData.point, 10) };

      if (editingPromotion) {
        await editPromotion(editingPromotion.id, promotionData);
      } else {
        await createPromotion(promotionData);
      }

      // after save, refresh or UI update happens via context; close modal
      setIsModalOpen(false);
      setEditingPromotion(null);
      // if adding and the new item pushed to next page, we could navigate to last page, but keep current behavior.
    } catch (err) {
      console.error("Error saving promotion:", err);
    } finally {
      setCreateOrUpdateLoading(false);
    }
  };

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setFormData({
      productName: "",
      productId: "",
      Discription: "",
      isActive: true,
      category: "Bonus",
      point: "",
    });
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion) => {
    // only set the edit loader while preparing (quick)
    setActionLoading((prev) => ({ ...prev, edit: promotion.id }));
    setEditingPromotion(promotion);
    setFormData({
      productName: promotion.productName || "",
      productId: promotion.productId || "",
      Discription: promotion.Discription || "",
      isActive: promotion.isActive ?? true,
      category: promotion.category || "Bonus",
      point: promotion.point?.toString() || "",
    });
    setIsModalOpen(true);
    // clear edit loader (UI already shows modal)
    setActionLoading((prev) => ({ ...prev, edit: null }));
  };

  const handleDeletePromotion = (promotion) => {
    // mark which row initiated delete to show loader on that row's delete icon if desired
    setActionLoading((prev) => ({ ...prev, delete: promotion.id }));
    setPromotionToDelete(promotion);
    setIsConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
    setPromotionToDelete(null);
    setActionLoading((prev) => ({ ...prev, delete: null }));
  };

  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return;

    setDeleteLoading(true);
    try {
      await removePromotion(promotionToDelete.id);
      // after deletion, pagination may need adjusting — we clamp above via effect
    } catch (err) {
      console.error("Error deleting promotion:", err);
    } finally {
      setDeleteLoading(false);
      setIsConfirmationOpen(false);
      setPromotionToDelete(null);
      setActionLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const safePromotions = (promotions || []).map((promotion, index) => ({
    ...promotion,
    uniqueKey: promotion.id || `promotion-${index}-${promotion.productName || "unknown"}`,
  }));

  // global initial loading (no items yet)
  if (loading && promotions.length === 0) {
    return <LoadingSpinner centered message="Loading promotions..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Header (outside card) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            Promotions ({promotions.length})
            {loading && promotions.length > 0 && (
              <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-blue-600" />
            )}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage bonus points, offers, and promotional rewards.</p>
        </div>

        <button
          onClick={handleAddPromotion}
          disabled={createOrUpdateLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {createOrUpdateLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="text-lg">+</span>
          )}
          {createOrUpdateLoading ? "Processing..." : "Add New Promotion"}
        </button>
      </div>

      <ErrorAlert error={error} onClose={clearError} />

      {/* Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {promotions.length === 0 && !loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg font-medium mb-1">No promotions yet</p>
              <p className="text-gray-400 text-sm mb-4">Get started by creating your first promotion.</p>
              <button
                onClick={handleAddPromotion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create First Promotion
              </button>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPromotions.map((promotion) => (
                    <tr key={promotion.uniqueKey} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promotion.productName || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{promotion.Discription || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><CategoryBadge category={promotion.category} /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={promotion.isActive} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{promotion.point || 0} <span className="text-gray-500 ml-1">pts</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <ActionButtons
                          onEdit={() => handleEditPromotion(promotion)}
                          onDelete={() => handleDeletePromotion(promotion)}
                          loadingEdit={actionLoading.edit === promotion.id || createOrUpdateLoading}
                          loadingDelete={actionLoading.delete === promotion.id || (deleteLoading && promotionToDelete?.id === promotion.id)}
                          disableAll={Boolean(createOrUpdateLoading)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{editingPromotion ? "Edit Promotion" : "Add New Promotion"}</h3>
            </div>

            <div className="p-6 space-y-4">
              <ProductSelectComponent formData={formData} handleInputChange={handleInputChange} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="Discription"
                  value={formData.Discription}
                  onChange={handleInputChange}
                  placeholder="Enter promotion details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bonus">Bonus</option>
                    <option value="Product Offer">Product Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points *</label>
                  <input
                    type="number"
                    name="point"
                    value={formData.point}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={createOrUpdateLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleFormSubmit}
                  disabled={createOrUpdateLoading || productsLoading || products.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:bg-green-400"
                >
                  {createOrUpdateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingPromotion ? "Update Promotion" : "Add Promotion"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Promotion</h3>
              <p className="text-sm text-gray-600 mb-6">
                {promotionToDelete ? `Are you sure you want to delete "${promotionToDelete.productName}"? This action cannot be undone.` : ""}
              </p>

              <div className="flex justify-end gap-3">
                <button onClick={handleCancelDelete} disabled={deleteLoading} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={deleteLoading} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2">
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Promotions;
