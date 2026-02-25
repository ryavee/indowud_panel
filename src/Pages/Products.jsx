import { useState, useEffect } from "react";
import {
  Plus,
  AlertCircle,
  Loader,
  Box,
  Hash,
  Layers,
  CircleStar,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { useProductContext } from "../Context/ProductsContext";
import ActionButtons from "../Components/Reusable/ActionButtons";
import ConfirmationModal from "../Components/ConfirmationModal";
import Pagination from "../Components/Reusable/Pagination";
import ExportButton from "../Components/export_button";
import ImportButton from "../Components/Import_button";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import { getCurrentUserRole, ROLES } from "../utils/rbac";

const Products = () => {
  const {
    products,
    loading,
    creating,
    deleting,
    importing,
    addProduct,
    removeProduct,
    importProductsFromFile,
    updateProduct,
    refreshProducts,
  } = useProductContext();

  // Local states
  const [newProductId, setNewProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");
  const [newProductPoints, setNewProductPoints] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner centered message="Loading Products..." />;
  }
  // ========== ADD PRODUCT ==========
  const handleAddProduct = async () => {
    setFormError("");

    if (
      !newProductId.trim() ||
      !newProductName.trim()
    ) {
      setFormError("Product ID and Product Name are required.");
      return;
    }

    let productPoint = 0;
    if (newProductPoints.trim() !== "") {
      productPoint = parseFloat(newProductPoints);
      if (isNaN(productPoint) || productPoint < 0) {
        setFormError("Product points must be a valid positive number.");
        return;
      }
    }

    try {
      await addProduct({
        productId: newProductId.trim(),
        productName: newProductName.trim(),
        productUnit: newProductUnit.trim(),
        productPoint,
      });
      toast.success(`"${newProductName}" added successfully!`);
      setNewProductId("");
      setNewProductName("");
      setNewProductUnit("");
      setNewProductPoints("");
      setShowAddModal(false);
      setFormError("");
    } catch (err) {
      console.error("Add product error:", err);
      toast.error(err.message || "Failed to add product.");
    }
  };

  // ========== DELETE PRODUCT ==========
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeProduct(deleteTarget.id);
      toast.success(
        `"${deleteTarget.productName || deleteTarget.name
        }" deleted successfully!`
      );
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error(err.message || "Failed to delete product.");
    }
  };

  // ========== EDIT PRODUCT ==========
  const handleEdit = (product) => {
    setEditTarget({
      ...product,
      productName: product.productName || product.name,
      productUnit: product.productUnit,
      productPoint: product.productPoint ?? 0,
    });
    setFormError("");
  };

  const handleUpdateProduct = async () => {
    setFormError("");

    if (!editTarget.productId?.trim() || !editTarget.productName?.trim()) {
      setFormError("Product ID and Product Name are required.");
      return;
    }

    let productPoint = 0;
    if (editTarget.productPoint !== "" && editTarget.productPoint !== null && editTarget.productPoint !== undefined) {
      productPoint = parseFloat(editTarget.productPoint);
      if (isNaN(productPoint) || productPoint < 0) {
        setFormError("Product points must be a valid positive number.");
        return;
      }
    }

    setEditLoading(true);
    try {
      await updateProduct(editTarget.id, {
        productId: editTarget.productId.trim(),
        productName: editTarget.productName.trim(),
        productUnit: editTarget.productUnit?.trim() || "",
        productPoint,
      });
      toast.success(`"${editTarget.productName}" updated successfully!`);
      setEditTarget(null);
      setFormError("");
    } catch (err) {
      console.error("Update product error:", err);
      toast.error(err.message || "Error updating product.");
    } finally {
      setEditLoading(false);
    }
  };

  // ========== IMPORT PRODUCTS ==========
  const handleImportProducts = async (file) => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    console.log("Starting import process for file:", file.name);

    try {
      const result = await importProductsFromFile(file);

      console.log("Import result:", result);

      // Show success message with details
      const { successCount = 0, skipped = [], failed = [] } = result || {};

      if (successCount > 0) {
        toast.success(
          `Successfully imported ${successCount} product${successCount !== 1 ? "s" : ""
          }!`
        );
      }

      if (skipped.length > 0) {
        toast.error(
          `${skipped.length} product${skipped.length !== 1 ? "s were" : " was"
          } skipped (already exist${skipped.length !== 1 ? "" : "s"})`,
          { duration: 4000 }
        );
      }

      if (failed.length > 0) {
        toast.error(
          `${failed.length} product${failed.length !== 1 ? "s" : ""
          } failed to import`,
          { duration: 4000 }
        );
      }

      if (successCount === 0 && skipped.length === 0 && failed.length === 0) {
        toast.info("No new products were imported");
      }
    } catch (err) {
      console.error("Import error:", err);
      toast.error(err.message || "Failed to import products.");
    }
  };

  const currentUserRole = getCurrentUserRole();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              Products
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your product list and inventory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUserRole !== ROLES.QR_GENERATE ? (
              <>
                <ImportButton
                  requiredHeaders={[
                    { key: "productName", header: "Product Name" },
                    { key: "productUnit", header: "Product Unit" },
                    { key: "productPoint", header: "Point" },
                  ]}
                  onUpload={handleImportProducts}
                  disabled={loading || creating || importing}
                />

                <ExportButton
                  data={products}
                  columns={[
                    { key: "productId", header: "Product ID" },
                    { key: "productName", header: "Product Name" },
                    { key: "productUnit", header: "Product Unit" },
                    { key: "productPoint", header: "Point" },
                  ]}
                  filename="products"
                  disabled={loading || creating || importing}
                />
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  disabled={creating || importing}
                  className={`
                flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                text-white rounded-lg shadow-sm transition-all cursor-pointer
                active:scale-[0.97] 
                ${creating || importing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#00A9A3] hover:bg-[#128083]"
                    }
              `}
                >
                  {creating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">
                Product List
              </h2>
              <p className="text-xs text-gray-500">
                {products.length} {products.length === 1 ? "item" : "items"}
              </p>
            </div>
            {(loading || importing) && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader className="w-4 h-4 animate-spin" />
                {importing ? "Importing..." : "Loading..."}
              </div>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <Loader
                size={24}
                className="animate-spin mx-auto mb-3 text-gray-400"
              />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <Box className="mx-auto mb-3 text-[#169698]" size={28} />
              No products found
            </div>
          ) : (
            <div className="bg-white  overflow-hidden">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4" /> Product ID
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Box className="h-4 w-4" /> Product Name
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Layers className="h-4 w-4" /> Unit
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <CircleStar className="h-4 w-4" /> Points
                      </div>
                    </th>
                    {currentUserRole !== ROLES.QR_GENERATE ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <MoreVertical className="h-4 w-4" /> Action
                          </div>
                        </th>
                      </>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#169698]/5 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                        {product.productId
                          ? product.productId.replace(/\s|\n/g, "")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">
                        {product.name || product.productName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {product.productUnit}
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        {product.productPoint ?? 0}
                      </td>
                      {currentUserRole !== ROLES.QR_GENERATE ? (
                        <>
                          <td className="px-6">
                            <ActionButtons
                              onEdit={() => handleEdit(product)}
                              onDelete={() => setDeleteTarget(product)}
                              loadingDelete={deleting === product.id}
                              disableAll={creating || loading || importing}
                            />
                          </td>
                        </>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="bg-gray-50 border-t border-gray-100">
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

      {/* Add Modal */}
      <ConfirmationModal
        isOpen={showAddModal}
        title="Add New Product"
        message={
          <div className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm">{formError}</p>
              </div>
            )}
            <input
              type="text"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              placeholder="Product ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Product Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
            <input
              type="text"
              value={newProductUnit}
              onChange={(e) => setNewProductUnit(e.target.value)}
              placeholder="(e.g., 08 mm)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
            <input
              type="number"
              value={newProductPoints}
              onChange={(e) => setNewProductPoints(e.target.value)}
              placeholder="Product Points"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
          </div>
        }
        onConfirm={handleAddProduct}
        onCancel={() => {
          setShowAddModal(false);
          setFormError("");
          setNewProductId("");
          setNewProductName("");
          setNewProductUnit("");
          setNewProductPoints("");
        }}
        isLoading={creating}
        confirmText="Add Product"
        cancelText="Cancel"
        type="info"
      />

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.productName || deleteTarget?.name
          }"?`}
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
          <div className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm">{formError}</p>
              </div>
            )}
            <input
              type="text"
              value={editTarget?.productId || ""}
              onChange={(e) =>
                setEditTarget((prev) => ({
                  ...prev,
                  productId: e.target.value,
                }))
              }
              placeholder="Product ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
            <input
              type="text"
              value={editTarget?.productName || ""}
              onChange={(e) =>
                setEditTarget((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              placeholder="Product Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
            <input
              type="text"
              value={editTarget?.productUnit || ""}
              onChange={(e) =>
                setEditTarget((prev) => ({
                  ...prev,
                  productUnit: e.target.value,
                }))
              }
              placeholder="Product Unit"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
            <input
              type="number"
              value={editTarget?.productPoint || ""}
              onChange={(e) =>
                setEditTarget((prev) => ({
                  ...prev,
                  productPoint: e.target.value,
                }))
              }
              placeholder="Product Points"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#169698]"
            />
          </div>
        }
        onConfirm={handleUpdateProduct}
        onCancel={() => {
          setEditTarget(null);
          setFormError("");
        }}
        loadingText="Updating..."
        isLoading={editLoading}
        confirmText="Update"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default Products;
