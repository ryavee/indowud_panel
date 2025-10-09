import React, { useState, useEffect } from "react";

import {
  Trash2,
  AlertCircle,
  Loader2,
  Plus,
  Search,
  Hash,
  User,
  MapPin,
  Globe,
  MoreVertical,
} from "lucide-react";


import { useDealersContext } from "../Context/DealersContext";

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
  const [localError, setLocalError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState(null);
  const [dealerToDelete, setDealerToDelete] = useState(null);

  const [newDealer, setNewDealer] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleDeleteClick = (dealer) => {
    setDeleteId(dealer.id);
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

  const handleAddDealerClick = () => {
    setShowAddModal(true);
    setAddError(null);
    setNewDealer({ firstName: "", lastName: "", city: "", state: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDealer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDealer = async () => {
    setAddError(null);
    if (
      !newDealer.firstName.trim() ||
      !newDealer.lastName.trim() ||
      !newDealer.city.trim() ||
      !newDealer.state.trim()
    ) {
      setAddError("All fields are required");
      return;
    }

    const result = await addDealer(newDealer);

    if (result.success) {
      setShowAddModal(false);
      setNewDealer({ firstName: "", lastName: "", city: "", state: "" });
    } else {
      setAddError(result.error);
    }
  };

  const cancelAddDealer = () => {
    setShowAddModal(false);
    setAddError(null);
    setNewDealer({ firstName: "", lastName: "", city: "", state: "" });
  };

  const handleRetry = () => {
    clearError();
    refreshDealers();
  };

  const filteredDealers = (Array.isArray(dealers) ? dealers : []).filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.firstName?.toLowerCase().includes(q) ||
      d.lastName?.toLowerCase().includes(q) ||
      d.city?.toLowerCase().includes(q) ||
      d.state?.toLowerCase().includes(q)
    );
  });

  // 🌀 Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dealers...</p>
        </div>
      </div>
    );
  }

  // ❌ Error State
  if (error && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold mb-1">
              Error Loading Dealers
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg 
                hover:bg-red-700 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dealers</h1>
          <p className="text-gray-600">Manage your dealer network.</p>
        </div>

        {/* Search & Add */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search dealer name, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md 
        focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Add Dealer button (aligned to right) */}
          <div className="flex justify-end w-full sm:w-auto">
            <button
              onClick={handleAddDealerClick}
              disabled={operationLoading}
              className="flex items-center justify-center gap-2 px-5 py-2 
                     bg-green-600 hover:bg-green-700 text-white rounded-md 
                     text-sm font-medium transition-all duration-200 transform 
                     hover:scale-[1.05] active:scale-[0.97] shadow-sm hover:shadow-md 
                     disabled:bg-green-400 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Dealer
            </button>
          </div>
        </div>


        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">

              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Hash className="h-4 w-4" /> Dealer ID
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" /> Name
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> City
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4" /> State
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <MoreVertical className="h-4 w-4" /> Actions
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDealers.length > 0 ? (
                filteredDealers.map((dealer) => (
                  <tr
                    key={dealer.dealersId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {dealer.dealersId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {dealer.firstName} {dealer.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {dealer.city}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {dealer.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteClick(dealer)}
                        disabled={operationLoading}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 
                          p-2 rounded transition-all duration-150 disabled:opacity-50 
                          disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
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

      {/* ✅ Add Dealer Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 
               bg-black/10 backdrop-blur-sm transition-all duration-300 animate-fadeIn"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 
                 transform scale-95 animate-modalPop relative transition-transform duration-300"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <Plus className="w-5 h-5 text-blue-600 mr-2" />
              Add New Dealer
            </h3>

            <div className="space-y-4">
              {["firstName", "lastName", "city", "state"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1 capitalize"
                  >
                    {field}
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={newDealer[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>

            {addError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{addError}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={cancelAddDealer}
                disabled={operationLoading}
                className="px-4 py-2 border border-gray-300 rounded-md 
                     hover:bg-gray-50 text-sm font-medium transition-all 
                     duration-200 transform hover:scale-[1.05] 
                     active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDealer}
                disabled={operationLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 
                     hover:bg-blue-700 text-white rounded-md text-sm font-medium 
                     transition-all duration-200 transform hover:scale-[1.05] 
                     active:scale-[0.97] shadow-sm hover:shadow-md 
                     disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

      {/* 🗑️ Delete Confirmation Modal */}
      {showConfirm && dealerToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 
                bg-black/10 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 
                 transform scale-95 animate-modalPop relative transition-transform duration-300"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {dealerToDelete.firstName} {dealerToDelete.lastName}
              </span>{" "}
              from <span className="font-medium text-blue-600">
                {dealerToDelete.city}
              </span>
              ? This action cannot be undone.
            </p>

            {localError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{localError}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={cancelDelete}
                disabled={operationLoading}
                className="px-4 py-2 border border-gray-300 rounded-md 
                     hover:bg-gray-50 text-sm font-medium transition-all 
                     duration-200 transform hover:scale-[1.05] 
                     active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={operationLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 
                     hover:bg-red-700 text-white rounded-md text-sm font-medium 
                     transition-all duration-200 transform hover:scale-[1.05] 
                     active:scale-[0.97] shadow-sm hover:shadow-md 
                     disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {operationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dealers;
