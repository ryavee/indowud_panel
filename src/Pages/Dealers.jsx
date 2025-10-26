import React, { useState, useEffect } from "react";
import {
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Search,
  Hash,
  Building2,
  MapPin,
  MoreVertical,
} from "lucide-react";
import { useDealersContext } from "../Context/DealersContext";
import ConfirmationModal from "../Components/ConfirmationModal";

const Dealers = () => {
  const {
    dealers,
    loading,
    error,
    operationLoading,
    removeDealer,
    refreshDealers,
    clearError,
    addDealer,
  } = useDealersContext();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dealerToDelete, setDealerToDelete] = useState(null);
  const [localError, setLocalError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newDealer, setNewDealer] = useState({
    companyName: "",
    dealerId: "",
    city: "",
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // 🗑️ Delete Dealer
  const handleDeleteClick = (dealer) => {
    setDeleteId(dealer.dealerId);
    setDealerToDelete(dealer);
    setShowConfirm(true);
    setLocalError(null);
  };

  const confirmDelete = async () => {
    setLocalError(null);
    const result = await removeDealer(deleteId);
    if (result.success) {
      setShowConfirm(false);
      setDeleteId(null);
      setDealerToDelete(null);
    } else {
      setLocalError(result.error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
    setDealerToDelete(null);
    setLocalError(null);
  };

  // ➕ Add Dealer Modal Controls
  const handleAddDealerClick = () => {
    setShowAddModal(true);
    setAddError(null);
    setNewDealer({ companyName: "", dealerId: "", city: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDealer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDealer = async () => {
    setAddError(null);
    if (
      !newDealer.companyName.trim() ||
      !newDealer.dealerId.trim() ||
      !newDealer.city.trim()
    ) {
      setAddError("All fields are required");
      return;
    }

    const result = await addDealer(newDealer);
    if (result.success) {
      setShowAddModal(false);
      setNewDealer({ companyName: "", dealerId: "", city: "" });
    } else {
      setAddError(result.error);
    }
  };

  const cancelAddDealer = () => {
    setShowAddModal(false);
    setAddError(null);
    setNewDealer({ companyName: "", dealerId: "", city: "" });
  };

  const handleRetry = () => {
    clearError();
    refreshDealers();
  };

  // 🔍 Filter Dealers
  const filteredDealers = (Array.isArray(dealers) ? dealers : []).filter(
    (d) => {
      const q = searchTerm.toLowerCase();
      return (
        d.companyName?.toLowerCase().includes(q) ||
        d.dealerId?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q)
      );
    }
  );

  // 🌀 Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dealers...</p>
        </div>
      </div>
    );
  }

  // ❌ Error State
  if (error && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-1">
              Error Loading Dealers
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dealers
          </h1>
          <p className="text-sm text-gray-600">
            Manage your dealer network and onboarding process.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search company name, dealer ID, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
            />
          </div>
          <button
            onClick={handleAddDealerClick}
            disabled={operationLoading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add Dealer
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  ["Dealer ID", Hash],
                  ["Company Name", Building2],
                  ["City", MapPin],
                  ["Action", MoreVertical],
                ].map(([label, Icon]) => (
                  <th
                    key={label}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-gray-500" /> {label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredDealers.length > 0 ? (
                filteredDealers.map((dealer) => (
                  <tr
                    key={dealer.dealerId}
                    className="hover:bg-orange-50/40 transition-all"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {dealer.dealerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {dealer.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {dealer.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteClick(dealer)}
                        disabled={operationLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-12 text-gray-500 text-sm"
                  >
                    No dealers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Add Dealer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-100 transform scale-95 animate-modalPop">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <Plus className="w-5 h-5 text-orange-600 mr-2" /> Add New Dealer
            </h3>

            {/* Input Fields */}
            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={newDealer.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                />
              </div>

              {/* Dealer ID + Generate */}
              <div>
                <label
                  htmlFor="dealerId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dealer ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="dealerId"
                    name="dealerId"
                    value={newDealer.dealerId}
                    onChange={handleInputChange}
                    placeholder="Auto-generate or enter manually"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewDealer((prev) => ({
                        ...prev,
                        dealerId: `DLR-${Math.random()
                          .toString(36)
                          .substring(2, 8)
                          .toUpperCase()}`,
                      }))
                    }
                    className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-all duration-200"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newDealer.city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Error Message */}
            {addError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{addError}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelAddDealer}
                disabled={operationLoading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDealer}
                disabled={operationLoading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {operationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Delete Confirmation */}
      <ConfirmationModal
        isOpen={showConfirm && !!dealerToDelete}
        title="Confirm Delete"
        message={
          dealerToDelete ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#169698]">
                {dealerToDelete.companyName}
              </span>{" "}
              from{" "}
              <span className="text-orange-600 font-medium">
                {dealerToDelete.city}
              </span>
              ? <br />
              <span className="text-gray-600">
                This action cannot be undone.
              </span>
            </span>
          ) : (
            ""
          )
        }
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={operationLoading}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Dealers;
