import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePromotionalContext } from "../Context/PromotionalContext";
import { useProductContext } from "../Context/ProductsContext";
import ProductSelectComponent from "../Components/select_product";
import ExportButton from "../Components/export_button";
import ImportButton from "../Components/Import_button";

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

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-800">{error}</p>
        <button
          onClick={onClose}
          className="mt-1 text-sm text-red-600 hover:text-red-800 underline"
        >
          Dismiss
        </button>
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
    importPromotions,
    clearError,
  } = usePromotionalContext();

  const { products, loading: productsLoading } = useProductContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    Discription: "",
    isActive: true,
    category: "Bonus",
    point: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

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
      toast.error("Please fill in all required fields");
      return;
    }

    setActionLoading(true);
    try {
      const payload = { ...formData, point: parseInt(formData.point) };
      if (editingPromotion) {
        await editPromotion(editingPromotion.id, payload);
        toast.success("Promotion updated successfully");
      } else {
        await createPromotion(payload);
        toast.success("Promotion created successfully");
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save promotion");
    } finally {
      setActionLoading(false);
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

  const handleEditPromotion = (promotion) => {
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
  };

  const handleDeletePromotion = async (promotion) => {
    if (!window.confirm(`Delete "${promotion.productName}"?`)) return;
    setActionLoading(true);
    try {
      await removePromotion(promotion.id);
      toast.success("Promotion deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete promotion");
    } finally {
      setActionLoading(false);
    }
  };

  const safePromotions = promotions.map((promotion, i) => ({
    ...promotion,
    uniqueKey: promotion.id || `promotion-${i}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorAlert error={error} onClose={clearError} />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Promotions ({promotions.length})
            {loading && (
              <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-blue-600" />
            )}
          </h3>

          <div className="flex items-center gap-3">
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

            {/* ✅ Import connected to Context */}
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
                  toast.error(err.message || "Import failed");
                }
              }}
            />

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:bg-green-400"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-lg">+</span>
              )}
              Add Promotion
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {promotions.length === 0 && !loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No promotions found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Product Name",
                    "Description",
                    "Category",
                    "Status",
                    "Points",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {safePromotions.map((promotion) => (
                  <tr key={promotion.uniqueKey} className="hover:bg-gray-50">
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPromotion(promotion)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promotion)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
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
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={actionLoading || productsLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-green-400"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingPromotion ? "Update Promotion" : "Add Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
