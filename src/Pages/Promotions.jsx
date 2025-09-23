import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const Promotions = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      productName: "Zerowud 18mm",
      description:
        "Premium quality plywood with excellent durability and smooth finish",
      offerStatus: "Active",
      offerPoints: 150,
    },
    {
      id: 2,
      productName: "Zerowud 12mm",
      description:
        "Lightweight plywood perfect for furniture and interior applications",
      offerStatus: "Inactive",
      offerPoints: 100,
    },
    {
      id: 3,
      productName: "Zerowud 25mm",
      description:
        "Heavy-duty plywood for structural and commercial applications",
      offerStatus: "Active",
      offerPoints: 200,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createOrUpdateLoading, setCreateOrUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    edit: null,
    delete: null,
  });

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    offerStatus: "Active",
    offerPoints: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (
      !formData.productName ||
      !formData.description ||
      !formData.offerPoints
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setCreateOrUpdateLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingPromotion) {
      setPromotions((prev) =>
        prev.map((promo) =>
          promo.id === editingPromotion.id
            ? {
                ...promo,
                ...formData,
                offerPoints: parseInt(formData.offerPoints),
              }
            : promo
        )
      );
    } else {
      const newPromotion = {
        id: Date.now(),
        ...formData,
        offerPoints: parseInt(formData.offerPoints),
      };
      setPromotions((prev) => [...prev, newPromotion]);
    }

    setCreateOrUpdateLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      description: "",
      offerStatus: "Active",
      offerPoints: "",
    });
    setEditingPromotion(null);
    setIsModalOpen(false);
  };

  const handleEditPromotion = async (promotion) => {
    setActionLoading((prev) => ({ ...prev, edit: promotion.id }));
    try {
      setEditingPromotion(promotion);
      setFormData({
        productName: promotion.productName,
        description: promotion.description,
        offerStatus: promotion.offerStatus,
        offerPoints: promotion.offerPoints.toString(),
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      setPromotions((prev) =>
        prev.filter((promo) => promo.id !== promotionToDelete.id)
      );
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

  if (loading) {
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
      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Promotions ({promotions.length})
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
          {promotions.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No promotions found.
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offer Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr
                    key={promotion.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {promotion.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {promotion.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={promotion.offerStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium text-blue-600">
                          {promotion.offerPoints}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., Zerowud 18mm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description and promotion details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Status
                  </label>
                  <select
                    name="offerStatus"
                    value={formData.offerStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer Points
                  </label>
                  <input
                    type="number"
                    name="offerPoints"
                    value={formData.offerPoints}
                    onChange={handleInputChange}
                    placeholder="e.g., 150"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
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
                  disabled={createOrUpdateLoading}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
