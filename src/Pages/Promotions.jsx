import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Loader,
  AlertCircle,
  Box,
  FileText,
  Tag,
  CheckCircle,
  Star,
  MoreVertical,
  Calendar,
  Percent,
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

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
    }`}
  >
    {status ? "Active" : "Inactive"}
  </span>
);

const CategoryBadge = ({ category }) => {
  const colors = {
    Bonus: "bg-blue-100 text-blue-800",
    "Product Offer": "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[category] || "bg-gray-100 text-gray-800"
      }`}
    >
      {category}
    </span>
  );
};

const BonusTypeBadge = ({ bonusType }) => {
  const colors = {
    "Fixed Points": "bg-indigo-100 text-indigo-800",
    Percentage: "bg-amber-100 text-amber-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[bonusType] || "bg-gray-100 text-gray-800"
      }`}
    >
      {bonusType}
    </span>
  );
};

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    products: [],
    Discription: "",
    isActive: true,
    category: "Bonus",
    bonusType: "Fixed Points",
    point: "",
    bonusPercentage: "",
    startDate: "",
    endDate: "",
  });

  const [createOrUpdateLoading, setCreateOrUpdateLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    edit: null,
    delete: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(promotions.length / pageSize));

  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return promotions.slice(start, start + pageSize);
  }, [promotions, currentPage, pageSize]);

  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        products: [],
        Discription: "",
        isActive: true,
        category: "Bonus",
        bonusType: "Fixed Points",
        point: "",
        bonusPercentage: "",
        startDate: "",
        endDate: "",
      });
      setEditingPromotion(null);
    }
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "bonusType") {
      // Clear the other field when switching bonus type
      setFormData((prev) => ({
        ...prev,
        bonusType: value,
        point: value === "Fixed Points" ? prev.point : "",
        bonusPercentage: value === "Percentage" ? prev.bonusPercentage : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFormSubmit = async () => {
    // Validation
    if (!formData.products || formData.products.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    const selectedProductIds = formData.products.map((p) => p.productId);
    const productsWithActivePromotions = [];

    for (const productId of selectedProductIds) {
      const existingPromotion = promotions.find(
        (promo) =>
          promo.productIds?.includes(productId) &&
          promo.active &&
          promo.id !== editingPromotion?.id 
      );

      if (existingPromotion) {
        const product = formData.products.find(
          (p) => p.productId === productId
        );
        productsWithActivePromotions.push(product?.productName || productId);
      }
    }

    if (productsWithActivePromotions.length > 0) {
      const productList = productsWithActivePromotions.join(", ");
      toast.error(
        `The following product(s) already have active promotions: ${productList}. Please deactivate existing promotions first.`,
        { duration: 5000 }
      );
      return;
    }

    if (formData.bonusType === "Fixed Points" && !formData.point) {
      toast.error("Please enter points for Fixed Points bonus type");
      return;
    }

    if (formData.bonusType === "Percentage" && !formData.bonusPercentage) {
      toast.error("Please enter percentage for Percentage bonus type");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setCreateOrUpdateLoading(true);
    try {
      const payload = {
        productIds: formData.products.map((p) => p.productId),
        productNames: formData.products.map((p) => p.productName),
        description: formData.Discription,
        active: formData.isActive,
        category: formData.category,
        bonusType: formData.bonusType,
        bonusValue:
          formData.bonusType === "Fixed Points"
            ? parseInt(formData.point, 10)
            : parseFloat(formData.bonusPercentage),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

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

  const handleEditPromotion = (promotion) => {
    setActionLoading((prev) => ({ ...prev, edit: promotion.id }));
    setEditingPromotion(promotion);

    // Reconstruct products array from productIds and productNames
    const productsArray =
      promotion.productIds?.map((id, index) => ({
        productId: id,
        productName: promotion.productNames?.[index] || "",
      })) || [];

    setFormData({
      products: productsArray,
      Discription: promotion.description || "",
      isActive: promotion.active ?? true,
      category: promotion.category || "Bonus",
      bonusType: promotion.bonusType || "Fixed Points",
      point:
        promotion.bonusType === "Fixed Points"
          ? promotion.bonusValue?.toString() || ""
          : "",
      bonusPercentage:
        promotion.bonusType === "Percentage"
          ? promotion.bonusValue?.toString() || ""
          : "",
      startDate: promotion.startDate || "",
      endDate: promotion.endDate || "",
    });
    setIsModalOpen(true);
    setActionLoading((prev) => ({ ...prev, edit: null }));
  };

  const handleDeletePromotion = (promotion) => {
    setPromotionToDelete(promotion);
  };

  const handleCancelDelete = () => {
    setPromotionToDelete(null);
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && promotions.length === 0) {
    return <LoadingSpinner centered message="Loading promotions..." />;
  }

  const headerConfig = [
    { key: "productName", label: "Product Name", Icon: Box },
    { key: "description", label: "Description", Icon: FileText },
    { key: "category", label: "Category", Icon: Tag },
    { key: "bonusType", label: "Bonus Type", Icon: Percent },
    { key: "value", label: "Value", Icon: Star },
    { key: "dates", label: "Duration", Icon: Calendar },
    { key: "status", label: "Status", Icon: CheckCircle },
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
              <Loader className="inline ml-2 h-4 w-4 animate-spin text-blue-600" />
            )}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage bonus points, offers, and promotional rewards.
          </p>
        </div>

        <div className="flex item-center gap-2">
          <ImportButton
            label="Import"
            requiredHeaders={[
              { key: "productName", header: "Product Name" },
              { key: "productId", header: "Product ID" },
              { key: "bonusType", header: "Bonus Type" },
              { key: "point", header: "Point" },
              { key: "bonusPercentage", header: "Bonus Percentage" },
              { key: "startDate", header: "Start Date" },
              { key: "endDate", header: "End Date" },
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
              { key: "description", header: "Description" },
              { key: "active", header: "Active" },
              { key: "category", header: "Category" },
              { key: "bonusType", header: "Bonus Type" },
              { key: "bonusValue", header: "Bonus Value" },
              { key: "startDate", header: "Start Date" },
              { key: "endDate", header: "End Date" },
            ]}
            filename="promotions"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={createOrUpdateLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
            text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
            shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            {createOrUpdateLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Promotion</span>
              </>
            )}
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
                    <tr key={promotion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {promotion.productNames?.length > 1 ? (
                          <div className="flex flex-wrap gap-1">
                            {promotion.productNames.map((name, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          promotion.productNames?.[0] || "-"
                        )}
                      </td>
                      <td className="px-6 py-4">{promotion.description}</td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={promotion.category} />
                      </td>
                      <td className="px-6 py-4">
                        <BonusTypeBadge
                          bonusType={promotion.bonusType || "Fixed Points"}
                        />
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-medium">
                        {promotion.calculation}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <div className="text-gray-600">
                            {formatDate(promotion.startDate)}
                          </div>
                          <div className="text-gray-400">to</div>
                          <div className="text-gray-600">
                            {formatDate(promotion.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={promotion.active} />
                      </td>
                      <td className="px-6 py-4">
                        <ActionButtons
                          onEdit={() =>{}}
                          onDelete={() => handleDeletePromotion(promotion)}
                          loadingEdit={
                            actionLoading.edit === promotion.id ||
                            createOrUpdateLoading
                          }
                          loadingDelete={
                            actionLoading.delete === promotion.id ||
                            deleteLoading
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-xs animate-fadeIn p-4">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] sm:w-full sm:max-w-3xl p-6 border border-gray-100 transform animate-modalPop relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              disabled={createOrUpdateLoading}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
            </h3>

            <div className="space-y-4">
              <ProductSelectComponent
                formData={formData}
                handleInputChange={handleInputChange}
                isMultiple={true}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="Discription"
                  value={formData.Discription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                  placeholder="Enter promotion description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                  >
                    <option value="Bonus">Bonus</option>
                    <option value="Product Offer">Product Offer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonus Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bonusType"
                    value={formData.bonusType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                  >
                    <option value="Fixed Points">Fixed Points</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.bonusType === "Fixed Points" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="point"
                      value={formData.point}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                      placeholder="Enter points"
                      min="0"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bonus Percentage (%){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bonusPercentage"
                      value={formData.bonusPercentage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A9A3]"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                )}

                <label className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2 text-[#00A9A3] focus:ring-[#00A9A3]"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            {/* Show calculated result */}
            {formData.bonusType === "percentage" && (
              <p className="text-sm text-gray-600 mt-2">
                Final Points after bonus:{" "}
                <span className="font-semibold text-[#00A9A3]">
                  {formData.calculatedPoints || 0}
                </span>
              </p>
            )}

            {/* Active Toggle */}
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2 text-[#00A9A3] focus:ring-[#00A9A3]"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer"
                disabled={createOrUpdateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={createOrUpdateLoading || productsLoading}
                className="px-4 py-2 bg-[#00A9A3] hover:bg-[#128083] text-white rounded-md flex items-center gap-2 cursor-pointer"
              >
                {createOrUpdateLoading && (
                  <Loader className="w-4 h-4 animate-spin" />
                )}
                {editingPromotion ? "Update Promotion" : "Create Promotion"}
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
            ? `Are you sure you want to delete this promotion? This action cannot be undone.`
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
