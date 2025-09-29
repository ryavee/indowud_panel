import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Upload,
  Download,
} from "lucide-react";
import DealerSelectComponent from "../Components/searchDealers";
import ProductSelectComponent from "../Components/select_product";

const QRGeneration = () => {
  const [showForm, setShowForm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    numberOfCodes: "",
    productName: "",
    productId: "",
    productUnit: "",
    dealerName: "",
    dealerId: "",
    batchId: "",
    remarks: "",
    expiryType: "None",
    customDate: "",
  });

  const [qrCodes, setQrCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(qrCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = qrCodes.slice(startIndex, endIndex);

  const parseProductName = (productName) => {
    if (!productName || typeof productName !== "string") {
      return { shortName: "", thickness: "" };
    }
    const parts = productName.trim().split(/\s+/);
    if (parts.length === 0) {
      return { shortName: "", thickness: "" };
    }
    const thickness = parts[parts.length - 1];
    const nameWithoutThickness = parts.slice(0, -1).join(" ");
    let shortName = "";
    if (nameWithoutThickness) {
      if (parts.length === 2) {
        shortName = nameWithoutThickness.substring(0, 3).toUpperCase();
      } else {
        shortName = nameWithoutThickness
          .split(/\s+/)
          .map((word) => word.charAt(0).toUpperCase())
          .join("");
      }
    }
    return { shortName, thickness };
  };

  const generateBatchId = (dealerId, productId, productUnit) => {
    if (!dealerId || !productId || !productUnit) {
      return "";
    }
    const dealerPart = dealerId.toString().slice(0, 4);
    const productPart = productId.toString().slice(0, 3);
    const unitMatch = productUnit.match(/\d+/);
    const unitPart = unitMatch ? unitMatch[0].padStart(3, "0") : "000";
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear()).slice(-2); 
    const dateStr = `${day}${month}${year}`;
    const autoIncrement = String(Math.floor(Math.random() * 9999) + 1).padStart(
      4,
      "0"
    );

    return `${dealerPart}${productPart}${unitPart}${dateStr}${autoIncrement}`;
  };

  useEffect(() => {
    if (formData.productName && formData.dealerName) {
      const batchId = generateBatchId(
        formData.dealerId,
        formData.productId,
        formData.productUnit
      );
      setFormData((prev) => ({ ...prev, batchId }));
    } else {
      setFormData((prev) => ({ ...prev, batchId: "" }));
    }
  }, [formData.productName]);

  const handleReset = () => {
    setFormData({
      numberOfCodes: "",
      productName: "",
      productId: "",
      productUnit: "",
      dealerName: "",
      dealerId: "",
      batchId: "",
      remarks: "",
      expiryType: "None",
      customDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = (type, format) => {
    console.log(`Exporting ${type} as ${format}`);
    setShowExportMenu(false);
  };

  const handleImport = (format) => {
    console.log(`Import ${format} file`);
    fileInputRef.current?.click();
    setShowImportMenu(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
    }
  };

  const handleGenerate = () => {
    
    if (
      !formData.numberOfCodes ||
      !formData.productName ||
      !formData.dealerName
    ) {
      alert(
        "Please fill in all required fields (Number of Codes, Product Name, and Dealer Name)"
      );
      return;
    }

    console.log("=== QR Code Generation Data ===");
    console.log("Number of Codes:", formData.numberOfCodes);
    console.log("Product Name:", formData.productName);
    console.log("Product ID:", formData.productId);
    console.log("Dealer Name:", formData.dealerName);
    console.log("Dealer ID:", formData.dealerId);
    console.log("Batch ID:", formData.batchId);
    console.log("Expiry Type:", formData.expiryType);
    console.log("Custom Date:", formData.customDate);
    console.log("Remarks:", formData.remarks);
    console.log("Complete Form Data:", formData);
    console.log("===============================");

    setShowForm(false);
    setFormData({
      numberOfCodes: "",
      productName: "",
      productId: "",
      dealerName: "",
      dealerId: "",
      batchId: "",
      remarks: "",
      expiryType: "None",
      customDate: "",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      numberOfCodes: "",
      productName: "",
      productId: "",
      dealerName: "",
      dealerId: "",
      batchId: "",
      remarks: "",
      expiryType: "None",
      customDate: "",
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (showForm) {
    return (
      <div className="p-6">
        <div className="rounded-lg space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Generate QR Codes
            </h2>
            {formData.batchId && (
              <button
                onClick={handleReset}
                className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Codes *
              </label>
              <input
                type="number"
                name="numberOfCodes"
                value={formData.numberOfCodes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter number of codes"
                min="1"
              />
            </div>

            <DealerSelectComponent
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={!!formData.batchId}
            />
            <ProductSelectComponent
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={!!formData.batchId}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch ID *
              </label>
              <input
                type="text"
                name="batchId"
                value={formData.batchId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none text-gray-600"
                placeholder="Auto-generated based on product selection"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <select
                name="expiryType"
                value={formData.expiryType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="None">None</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="9months">9 Months</option>
                <option value="12months">12 Months</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>
          </div>

          {formData.expiryType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Custom Date
              </label>
              <input
                type="date"
                name="customDate"
                value={formData.customDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any remarks"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGenerate}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Generate
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">QR Code Generation</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Generate QR Codes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {qrCodes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <Calendar size={48} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No QR Codes Generated Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Click the "Generate QR Codes" button above to create your first
              batch of QR codes.
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, qrCodes.length)} of{" "}
                {qrCodes.length}
              </p>

              <div className="flex gap-3 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowExportMenu(!showExportMenu);
                      setShowImportMenu(false);
                    }}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <Download size={18} />
                    Export
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          Export as CSV
                        </div>
                        <button
                          onClick={() => handleExport("first10", "csv")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          First 10 Records
                        </button>
                        <button
                          onClick={() => handleExport("half", "csv")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Half Records
                        </button>
                        <button
                          onClick={() => handleExport("full", "csv")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Full Records
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          Export as Excel
                        </div>
                        <button
                          onClick={() => handleExport("first10", "excel")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          First 10 Records
                        </button>
                        <button
                          onClick={() => handleExport("half", "excel")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Half Records
                        </button>
                        <button
                          onClick={() => handleExport("full", "excel")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Full Records
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      setShowImportMenu(!showImportMenu);
                      setShowExportMenu(false);
                    }}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium text-sm"
                  >
                    <Upload size={18} />
                    Import
                  </button>
                  {showImportMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleImport("csv")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Upload CSV File
                        </button>
                        <button
                          onClick={() => handleImport("excel")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Upload Excel File
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.batchId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.expiryDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {renderPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-2 text-sm text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRGeneration;
