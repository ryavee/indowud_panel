import React, { useState, useEffect } from "react";
import {
  Trash2,
  AlertCircle,
  Loader,
  Plus,
  Search,
  Hash,
  Building2,
  MapPin,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useDealersContext } from "../Context/DealersContext";
import ExportButton from "../Components/export_button";
import ImportCSVButton from "../Components/Import_button";
import Pagination from "../Components/Reusable/Pagination";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";

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
    generateNewDealerId,
    importDealers,
  } = useDealersContext();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dealerToDelete, setDealerToDelete] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [newDealer, setNewDealer] = useState({
    dealerId: "",
    companyName: "",
    city: "",
  });

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleDeleteClick = (dealer) => {
    if (!dealer?.id) {
      toast.error("Invalid dealer ID");
      return;
    }
    setDeleteId(dealer.id);
    setDealerToDelete(dealer);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return toast.error("Invalid dealer ID");

    const result = await removeDealer(deleteId);
    if (result.success) {
      toast.success("Dealer deleted successfully");
      setShowConfirm(false);
      setDeleteId(null);
      setDealerToDelete(null);
    } else {
      toast.error(result.error || "Failed to delete dealer");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
    setDealerToDelete(null);
  };

  const handleAddDealerClick = () => {
    setShowAddModal(true);
    setAddError(null);
    setNewDealer({ dealerId: "", companyName: "", city: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDealer((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateDealer = async () => {
    setAddError(null);
    setIsGenerating(true);
    try {
      const result = await generateNewDealerId();
      if (result.success && result.dealerID) {
        setNewDealer((prev) => ({ ...prev, dealerId: result.dealerID }));
      } else {
        toast.error(result.error || "Failed to generate dealer ID");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateDealer = async () => {
    setAddError(null);

    if (!newDealer.dealerId.trim()) return toast.error("Dealer ID is required");
    if (!newDealer.companyName.trim())
      return toast.error("Company name is required");
    if (!newDealer.city.trim()) return toast.error("City is required");

    const result = await addDealer(newDealer);
    if (result.success) {
      toast.success("Dealer added successfully");
      setShowAddModal(false);
      setNewDealer({ dealerId: "", companyName: "", city: "" });
    } else {
      toast.error(result.error || "Failed to add dealer");
    }
  };

  const cancelAddDealer = () => {
    setShowAddModal(false);
    setAddError(null);
    setNewDealer({ dealerId: "", companyName: "", city: "" });
  };

  const handleImport = async (file) => {
    const result = await importDealers(file);

    if (result.success) {
      const imported = result.data?.imported || result.data?.count || 0;
      toast.success(
        `Successfully imported ${imported} dealer${imported !== 1 ? "s" : ""}`
      );
    } else {
      toast.error(result.error || "Failed to import dealers");
    }
  };

  const handleRetry = () => {
    clearError();
    refreshDealers();
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const sortedDealers = React.useMemo(() => {
    let sortableDealers = [...filteredDealers];
    if (sortConfig.key !== null) {
      sortableDealers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDealers;
  }, [filteredDealers, sortConfig]);

  const requestSort = (key) => {
    if (!key) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use sortedDealers length for correct total
  const totalPages = Math.max(1, Math.ceil(sortedDealers.length / pageSize));

  // Slice sorted list for current page
  const paginatedDealers = sortedDealers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  //loader
  if (loading) {
    return <LoadingSpinner centered message="Loading Dealers..." />;
  }

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
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Dealers
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your dealer network and onboarding process.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search company, dealer ID, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
            />
          </div>
          <div className="flex gap-3">

            <ImportCSVButton
              requiredHeaders={[
                { key: "dealerId", header: "Dealer ID" },
                { key: "companyName", header: "Company Name" },
                { key: "city", header: "City" },
              ]}
              onUpload={handleImport}
              label="Import Dealers"
            />

            <ExportButton
              data={filteredDealers}
              columns={[
                { key: "dealerId", header: "Dealer ID" },
                { key: "companyName", header: "Company Name" },
                { key: "city", header: "City" },
              ]}
              filename="dealers_export"
              page="dealers"
              disabled={operationLoading || filteredDealers.length === 0}
            />

            <button
              onClick={handleAddDealerClick}
              disabled={operationLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                          text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
                          shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Dealer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    { label: "Dealer ID", Icon: Hash, sortKey: "dealerId" },
                    { label: "Company Name", Icon: Building2, sortKey: "companyName" },
                    { label: "City", Icon: MapPin, sortKey: "city" },
                    { label: "Action", Icon: MoreVertical, sortKey: null },
                  ].map(({ label, Icon, sortKey }) => (
                    <th
                      key={label}
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider outline-none focus:outline-none focus-visible:outline-none ${sortKey ? "cursor-pointer select-none hover:bg-gray-200 transition-colors group" : ""}`}
                      onClick={() => requestSort(sortKey)}
                    >
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <span>{label}</span>
                        {sortKey && (
                          <div className="w-4 h-4 flex items-center justify-center">
                            {sortConfig.key === sortKey ? (
                              sortConfig.direction === 'asc' ?
                                <ChevronUp className="h-4 w-4 text-gray-700" /> :
                                <ChevronDown className="h-4 w-4 text-gray-700" />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedDealers.length > 0 ? (
                  paginatedDealers.map((dealer, index) => {
                    const uniqueKey =
                      dealer.dealerId || dealer.id || `dealer-key-${index}`;
                    return (
                      <tr
                        key={uniqueKey}
                        className="hover:bg-orange-50/40 transition-all"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                          {dealer.dealerId || dealer.id || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                          {dealer.companyName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {dealer.city || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(dealer)}
                            disabled={operationLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer"
                            aria-label={`Delete ${dealer.companyName}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No dealers match your search."
                        : "No dealers found. Add your first dealer to get started."}
                    </td>
                  </tr>
                )}
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
        </div>
      </div>

      {/* Add Dealer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Add New Dealer
            </h2>

            {addError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm flex-1">{addError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dealer ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="dealerId"
                    value={newDealer.dealerId}
                    onChange={handleInputChange}
                    placeholder="Enter or generate ID"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDealer}
                    disabled={operationLoading || isGenerating}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={newDealer.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={newDealer.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cancelAddDealer}
                disabled={operationLoading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDealer}
                disabled={operationLoading || isGenerating}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {operationLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Dealer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Delete Dealer
                </h2>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-900">
                    {dealerToDelete?.companyName || "this dealer"}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={operationLoading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={operationLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {operationLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
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
