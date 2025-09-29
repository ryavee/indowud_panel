import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { usePromotionalContext } from "../Context/PromotionalContext";
import { useProductContext } from "../Context/ProductsContext";
import ProductSelectComponent from "../Components/select_product";

const StatusBadge = ({ status }) => {
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

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
    promotions,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [createOrUpdateLoading, setCreateOrUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    edit: null,
    delete: null,
  });

  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    Discription: "",
    isActive: true,
    category: "Bonus",
    point: "",
  });

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
      const promotionData = {
        ...formData,
        point: parseInt(formData.point),
      };

      if (editingPromotion) {
        await editPromotion(editingPromotion.id, promotionData);
      } else {
        await createPromotion(promotionData);
      }

      resetForm();
    } catch (err) {
      console.error("Error saving promotion:", err);
    } finally {
      setCreateOrUpdateLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productId: "",
      Discription: "",
      isActive: true,
      category: "Bonus",
      point: "",
    });
    setEditingPromotion(null);
    setIsModalOpen(false);
  };

  const handleEditPromotion = async (promotion) => {
    setActionLoading((prev) => ({ ...prev, edit: promotion.id }));
    try {
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
    } catch (error) {
      console.error("Error preparing promotion edit:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, edit: null }));
    }
  };

  const handleDeletePromotion = async (promotion) => {
    setActionLoading((prev) => ({ ...prev, delete: promotion.id }));
    try {
      setIsConfirmationOpen(true);
      setPromotionToDelete(promotion);
    } catch (error) {
      console.error("Error preparing promotion deletion:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return;

    setDeleteLoading(true);

    try {
      await removePromotion(promotionToDelete.id);
    } catch (error) {
      console.error("Error deleting promotion:", error);
    } finally {
      setDeleteLoading(false);
      setIsConfirmationOpen(false);
      setPromotionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
    setPromotionToDelete(null);
  };

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
    resetForm();
  };

  const safePromotions = promotions.map((promotion, index) => ({
    ...promotion,
    uniqueKey:
      promotion.id ||
      `promotion-${index}-${promotion.productName || "unknown"}`,
  }));

  if (loading && promotions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-9 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading promotions...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorAlert error={error} onClose={clearError} />

      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Promotions ({promotions.length})
            {loading && promotions.length > 0 && (
              <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-blue-600" />
            )}
          </h3>
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
            {createOrUpdateLoading ? "Adding..." : "Add New Promotion"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {promotions.length === 0 && !loading ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M7 7h.01M7 3h.01"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No promotions yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Get started by creating your first promotion
              </p>
              <button
                onClick={handleAddPromotion}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create First Promotion
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {safePromotions.map((promotion) => (
                  <tr
                    key={promotion.uniqueKey}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {promotion.productName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {promotion.Discription || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CategoryBadge category={promotion.category} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={promotion.isActive} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium text-blue-600">
                          {promotion.point || 0}
                        </span>
                        <span className="text-gray-500 ml-1">pts</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPromotion(promotion)}
                          disabled={
                            actionLoading.edit === promotion.id ||
                            createOrUpdateLoading
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {actionLoading.edit === promotion.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : null}
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promotion)}
                          disabled={
                            actionLoading.delete === promotion.id ||
                            deleteLoading
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {actionLoading.delete === promotion.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : null}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Promotion Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <ProductSelectComponent
                formData={formData}
                handleInputChange={handleInputChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="Discription"
                  value={formData.Discription}
                  onChange={handleInputChange}
                  placeholder="Enter product description and promotion details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bonus">Bonus</option>
                    <option value="Product Offer">Product Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points *
                  </label>
                  <input
                    type="number"
                    name="point"
                    value={formData.point}
                    onChange={handleInputChange}
                    placeholder="e.g., 80"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleCloseModal}
                  disabled={createOrUpdateLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={
                    createOrUpdateLoading ||
                    productsLoading ||
                    products.length === 0
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {createOrUpdateLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {editingPromotion ? "Update Promotion" : "Add Promotion"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Promotion
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {promotionToDelete
                  ? `Are you sure you want to delete "${promotionToDelete.productName}"? This action cannot be undone.`
                  : ""}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
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
