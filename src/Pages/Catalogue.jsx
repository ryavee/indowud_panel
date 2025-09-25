import React, { useState } from "react";
import { Plus, Trash2, FileText, Upload, X, Check } from "lucide-react";

const Catalogue = () => {
  const [catalogues, setCatalogues] = useState([
    {
      id: 1,
      name: "Summer Collection 2024",
      pdfName: "summer-catalog.pdf",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Electronics Inventory",
      pdfName: "electronics-list.pdf",
      createdAt: "2024-01-12",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCatalogue, setNewCatalogue] = useState({ name: "", pdf: null });
  const [dragOver, setDragOver] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    catalogue: null,
  });

  const handleCreateCatalogue = async () => {
    if (!newCatalogue.name.trim() || !newCatalogue.pdf) return;

    setIsCreating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const catalogue = {
      id: Date.now(),
      name: newCatalogue.name.trim(),
      pdfName: newCatalogue.pdf.name,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCatalogues((prev) => [catalogue, ...prev]);
    setNewCatalogue({ name: "", pdf: null });
    setShowCreateModal(false);
    setIsCreating(false);
  };

  const handleDeleteCatalogue = (id) => {
    setCatalogues((prev) => prev.filter((cat) => cat.id !== id));
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Catalogue Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create, manage and organize your product catalogues
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Catalogue
        </button>
      </div>

      {catalogues.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No catalogues yet
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first catalogue
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Your First Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogues.map((catalogue) => (
            <div
              key={catalogue.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {catalogue.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created {formatDate(catalogue.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCatalogue(catalogue)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Delete catalogue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="truncate">{catalogue.pdfName}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  View
                </button>
                <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Catalogue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            onClick={() => !isCreating && setShowCreateModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Catalogue
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isCreating}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catalogue Name
                </label>
                <input
                  type="text"
                  value={newCatalogue.name}
                  onChange={(e) =>
                    setNewCatalogue((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter catalogue name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver
                      ? "border-blue-400 bg-blue-50"
                      : newCatalogue.pdf
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {newCatalogue.pdf ? (
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">
                        {newCatalogue.pdf.name}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">
                        Drop your PDF here or
                      </p>
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
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
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                    disabled={isCreating}
                  >
                    Remove file
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCatalogue}
                disabled={
                  !newCatalogue.name.trim() || !newCatalogue.pdf || isCreating
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  "Create Catalogue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            onClick={cancelDelete}
          ></div>
          <div className="relative bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Catalogue
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "
                <strong>{deleteConfirm.catalogue?.name}</strong>"? This will
                permanently remove the catalogue and its associated PDF file.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete Catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogue;
