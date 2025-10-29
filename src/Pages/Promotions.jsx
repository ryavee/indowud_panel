import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  AlertCircle,
  Box,           // product
  FileText,      // description
  Tag,           // category
  CheckCircle as CheckIcon, // status (alias to avoid name clash)
  CircleStar,          // points
  MoreVertical,  // actions
} from "lucide-react";

import { toast } from "react-hot-toast";
import { usePromotionalContext } from "../Context/PromotionalContext";
import { useProductContext } from "../Context/ProductsContext";
import ProductSelectComponent from "../Components/select_product";
import ExportButton from "../Components/export_button";
import ImportButton from "../Components/Import_button";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import ActionButtons from "../Components/Reusable/ActionButtons";
import Pagination from "../Components/Reusable/Pagination";
import ConfirmationModal from "../Components/ConfirmationModal";

// Status badge
const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
  >
    {status ? "Active" : "Inactive"}
  </span>
);

// Category badge
const CategoryBadge = ({ category }) => {
  const colors = {
    Bonus: "bg-blue-100 text-blue-800",
    "Product Offer": "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category] || "bg-gray-100 text-gray-800"
        }`}
    >
      {category}
    </span>
  );
};

// Error alert
const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-800">{error}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-1 text-sm text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        )}
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
    importPromotions,
    clearError,
  } = usePromotionalContext();

  const { products, loading: productsLoading } = useProductContext();

  // UI + form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  // Delete flow state (uses ConfirmationModal)
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    Discription: "",
    isActive: true,
    category: "Bonus",
    point: "",
  });

  // Operation loaders
  const [createOrUpdateLoading, setCreateOrUpdateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({ edit: null, delete: null });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(promotions.length / pageSize));

  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return promotions.slice(start, start + pageSize);
  }, [promotions, currentPage, pageSize]);

  // reset form when modal closes
  useEffect(() => {
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

  // Input change handler
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

  // Create / Update submit
  const handleFormSubmit = async () => {
    if (!formData.productName || !formData.Discription || !formData.point) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreateOrUpdateLoading(true);
    try {
      const payload = { ...formData, point: parseInt(formData.point, 10) };
      if (editingPromotion) {
        await editPromotion(editingPromotion.id, payload);
        toast.success("Promotion updated successfully");
      } else {
        await createPromotion(payload);
        toast.success("Promotion created successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to save promotion");
    } finally {
      setCreateOrUpdateLoading(false);
    }
  };

  // Prepare edit
  const handleEditPromotion = (promotion) => {
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
    setActionLoading((prev) => ({ ...prev, edit: null }));
  };

  // Open confirmation modal for delete
  const handleDeletePromotion = (promotion) => {
    setPromotionToDelete(promotion);
  };

  const handleCancelDelete = () => {
    setPromotionToDelete(null);
  };

  // Confirm delete -> uses removePromotion from context
  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return;
    setDeleteLoading(true);
    try {
      await removePromotion(promotionToDelete.id);
      toast.success("Promotion deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete promotion");
    } finally {
      setDeleteLoading(false);
      setPromotionToDelete(null);
    }
  };

  // global initial loading
  if (loading && promotions.length === 0) {
    return <LoadingSpinner centered message="Loading promotions..." />;
  }


  const headerConfig = [
    { key: "productName", label: "Product Name", Icon: Box },
    { key: "description", label: "Description", Icon: FileText },
    { key: "category", label: "Category", Icon: Tag },
    { key: "status", label: "Status", Icon: CheckIcon },
    { key: "points", label: "Points", Icon: CircleStar },
    { key: "actions", label: "Action", Icon: MoreVertical },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <ErrorAlert error={error} onClose={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            <span>Promotions</span>
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-[#00A9A3]/10 text-[#00A9A3] border border-[#00A9A3]/20">
              {promotions.length}
            </span>
            {loading && promotions.length > 0 && (
              <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-blue-600" />
            )}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage bonus points, offers, and promotional rewards.
          </p>
        </div>

        <div className="flex  item-center gap-2">


          <ImportButton
            label="Import Promotions"
            requiredHeaders={[
              { key: "productName", header: "Product Name" },
              { key: "productId", header: "Product ID" },
              { key: "point", header: "Point" },
            ]}
            disabled={loading}
            onUpload={async (file) => {
              try {
                await importPromotions(file);
                toast.success("Promotions imported successfully");
              } catch (err) {
                toast.error(err?.message || "Import failed");
              }
            }}
          />
          <ExportButton
            data={promotions}
            columns={[
              { key: "productName", header: "Product Name" },
              { key: "productId", header: "Product ID" },
              { key: "Discription", header: "Description" },
              { key: "isActive", header: "Active" },
              { key: "category", header: "Category" },
              { key: "point", header: "Point" },
            ]}
            filename="promotions"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={createOrUpdateLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            {createOrUpdateLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span className="text-lg">+</span>
            )}
            Add Promotion
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {promotions.length === 0 && !loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No promotions found.
            </div>
          ) : (
            <>
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                  <tr>
                    {headerConfig.map(({ key, label, Icon }) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span>{label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>


                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPromotions.map((promotion) => (
                    <tr key={promotion.id || promotion.productName} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{promotion.productName}</td>
                      <td className="px-6 py-4">{promotion.Discription}</td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={promotion.category} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={promotion.isActive} />
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-medium">
                        {promotion.point || 0} pts
                      </td>
                      <td className="px-6 py-4">
                        <ActionButtons
                          onEdit={() => handleEditPromotion(promotion)}
                          onDelete={() => handleDeletePromotion(promotion)}
                          loadingEdit={
                            actionLoading.edit === promotion.id ||
                            createOrUpdateLoading
                          }
                          loadingDelete={
                            actionLoading.delete === promotion.id || deleteLoading
                          }
                          disableAll={createOrUpdateLoading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
            </h3>

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
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={createOrUpdateLoading || productsLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-green-400"
              >
                {createOrUpdateLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingPromotion ? "Update Promotion" : "Add Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ConfirmationModal (reusable) for delete */}
      <ConfirmationModal
        isOpen={!!promotionToDelete}
        title="Delete Promotion"
        message={
          promotionToDelete
            ? `Are you sure you want to delete "${promotionToDelete.productName}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteLoading}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Promotions;