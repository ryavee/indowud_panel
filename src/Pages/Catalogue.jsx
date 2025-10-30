import React, { useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Upload,
  X,
  Check,
  Eye,
  Loader,
} from "lucide-react";
import { useCatalogContext } from "../Context/CatalogContext";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import ConfirmationModal from "../Components/ConfirmationModal";

const Catalogue = () => {
  const { catalogs, loading, deleting, addCatalog, removeCatalog } =
    useCatalogContext();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCatalogue, setNewCatalogue] = useState({
    name: "",
    hindiName: "",
    pdf: null,
  });
  const [dragOver, setDragOver] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // For delete confirmation, we'll use the shared ConfirmationModal
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [catalogueToDelete, setCatalogueToDelete] = useState(null);

  const handleCreateCatalogue = async () => {
    if (
      !newCatalogue.name.trim() ||
      !newCatalogue.hindiName.trim() ||
      !newCatalogue.pdf
    )
      return;

    setIsCreating(true);
    const catalogueData = {
      name: newCatalogue.name.trim(),
      hindiName: newCatalogue.hindiName.trim(),
      pdf: newCatalogue.pdf,
    };

    const result = await addCatalog(catalogueData);

    if (result) {
      setNewCatalogue({ name: "", hindiName: "", pdf: null });
      setShowCreateModal(false);
    }

    setIsCreating(false);
  };

  const handleDeleteCatalogue = async () => {
    if (!catalogueToDelete) return;
    await removeCatalog(catalogueToDelete.id);
    setConfirmDeleteOpen(false);
    setCatalogueToDelete(null);
  };

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setNewCatalogue((prev) => ({ ...prev, pdf: file }));
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Early loading state (consistent spinner)
  if (loading && catalogs.length === 0) {
    return <LoadingSpinner centered message="Loading catalogues..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Catalogue Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create, organize, and manage your product catalogues.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          disabled={loading || isCreating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
            text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
            shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> Create Catalogue
        </button>
      </div>

      {/* Empty state */}
      {Array.isArray(catalogs) && catalogs.length === 0 && !loading ? (
        <div className="col-span-full flex flex-col items-center justify-center text-center py-12 text-gray-500 bg-white border border-gray-100 rounded-lg shadow-sm">
          <FileText size={40} className="mx-auto text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-900 mb-1">
            No catalogues yet
          </h3>
          <p className="text-gray-500 mb-4 text-sm">
            Create your first catalogue to get started!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
              text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
              shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Catalogue
          </button>
        </div>
      ) : (
        // Catalog grid
        Array.isArray(catalogs) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogs.map((catalogue) => (
              <div
                key={catalogue.id}
                className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-[#00A9A31A] p-3 rounded-lg">
                      <FileText className="w-5 h-5 text-[#00A9A3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {catalogue.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {catalogue.hindiName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={catalogue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00A9A3] hover:text-[#128083] hover:bg-[#00A9A310] p-2 rounded transition-colors"
                      title="View catalogue"
                    >
                      <Eye className="w-5 h-5" />
                    </a>

                    <button
                      onClick={() => {
                        setCatalogueToDelete(catalogue);
                        setConfirmDeleteOpen(true);
                      }}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded 
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      title="Delete catalogue"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Create Catalogue Modal (uses same backdrop/blur style as ConfirmationModal) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-gray-100 relative"
            role="dialog"
            aria-modal="true"
          >
            {/* close button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600  cursor-pointer"
              disabled={isCreating}
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Catalogue
              </h2>

              {/* Overlay loader when creating */}
              {isCreating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 rounded-xl">
                  <Loader className="w-8 h-8 text-[#00A9A3] animate-spin" />
                  <p className="mt-2 text-gray-700 font-medium">Creating catalogue...</p>
                </div>
              )}
               
               
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catalogue Name
                  </label>
                  <input
                    type="text"
                    value={newCatalogue.name}
                    onChange={(e) =>
                      setNewCatalogue((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter catalogue name"
                    className="w-full border border-[#00A9A3]/40 rounded-lg px-3 py-2 text-sm text-gray-800
                               focus:border-[#00A9A3] focus:ring-2 focus:ring-[#00A9A3]/50 focus:outline-none
                               transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catalogue Name (Hindi)
                  </label>
                  <input
                    type="text"
                    value={newCatalogue.hindiName}
                    onChange={(e) =>
                      setNewCatalogue((prev) => ({ ...prev, hindiName: e.target.value }))
                    }
                    placeholder="कैटलॉग का नाम दर्ज करें"
                    className="w-full border border-[#00A9A3]/40 rounded-lg px-3 py-2 text-sm text-gray-800
                               focus:border-[#00A9A3] focus:ring-2 focus:ring-[#00A9A3]/50 focus:outline-none
                               transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver
                      ? "border-[#00A9A3] bg-[#E6FFFA]"
                      : newCatalogue.pdf
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                      }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex={0}
                  >
                    {newCatalogue.pdf ? (
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">{newCatalogue.pdf.name}</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-1">Drop your PDF here or</p>
                        <label className="text-[#00A9A3] hover:text-[#128083] cursor-pointer font-medium">
                          browse files
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            className="hidden"
                            disabled={isCreating}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {newCatalogue.pdf && (
                    <button
                      onClick={() =>
                        setNewCatalogue((prev) => ({ ...prev, pdf: null }))
                      }
                      className="mt-2 text-sm text-red-600 hover:text-red-700 cursor-pointer"
                      disabled={isCreating}
                    >
                      Remove file
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCatalogue}
                  disabled={
                    !newCatalogue.name.trim() ||
                    !newCatalogue.hindiName.trim() ||
                    !newCatalogue.pdf ||
                    isCreating
                  }
                  className="px-4 py-2 bg-[#00A9A3] hover:bg-[#128083] text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create Catalogue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ConfirmationModal */}
      <ConfirmationModal
        isOpen={confirmDeleteOpen}
        title="Delete Catalogue"
        message={
          <>Are you sure you want to delete {" "}
            <strong className="text-red-600">{catalogueToDelete?.name || "this catalogue"}</strong>?
            This action cannot be undone.
          </>}
        onConfirm={handleDeleteCatalogue}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setCatalogueToDelete(null);
        }}
        isLoading={deleting}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Catalogue;
