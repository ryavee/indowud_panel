import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Download,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCodesContext } from "../Context/CodesContext";
import DealerSelectComponent from "../Components/searchDealers";
import ProductSelectComponent from "../Components/select_product";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import JSZip from "jszip";

const QRGeneration = () => {
  const [showForm, setShowForm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingPDF, setGeneratingPDF] = useState(null);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);

  const {
    batches,
    loading,
    error,
    generateQRCodes,
    fetchAllBatches,
    fetchBatchById,
  } = useCodesContext();

  const [formData, setFormData] = useState({
    numberOfCodes: "",
    productName: "",
    productId: "",
    productUnit: "",
    companyName: "",
    dealerId: "",
    batchId: "",
    remarks: "",
    expiryType: "None",
    customDate: "",
  });

  useEffect(() => {
    fetchAllBatches();
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(batches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = batches.slice(startIndex, endIndex);

  const generateBatchId = (dealerId, productId, productUnit) => {
    if (!dealerId || !productId || !productUnit) return "";

    const dealerPart = dealerId.toString().slice(0, 4);
    const productSegments = productId.split("-");
    const productPart = productSegments.slice(0, 2).join("-");
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
    console.log(formData);

    if (formData.productName && formData.companyName) {
      const batchId = generateBatchId(
        formData.dealerId,
        formData.productId,
        formData.productUnit
      );
      setFormData((prev) => ({ ...prev, batchId }));
    } else {
      setFormData((prev) => ({ ...prev, batchId: "" }));
    }
  }, [
    formData.productName,
    formData.companyName,
    formData.dealerId,
    formData.productId,
    formData.productUnit,
  ]);

  const generateQRCodePDF = async (qrCodesData, productName, batchId) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5;

      const cardWidth = 90;
      const cardHeight = 50;
      const qrSize = 32;
      const gapX = 5;
      const gapY = 5;

      const cardsPerRow = 2;
      const cardsPerColumn = 5;
      const printDate = new Date().toLocaleDateString("en-GB");

      for (let i = 0; i < qrCodesData.length; i++) {
        const qrData = qrCodesData[i];

        const cardIndex = i % (cardsPerRow * cardsPerColumn);
        const pageIndex = Math.floor(i / (cardsPerRow * cardsPerColumn));

        if (i > 0 && cardIndex === 0) pdf.addPage();

        const row = Math.floor(cardIndex / cardsPerRow);
        const col = cardIndex % cardsPerRow;

        const cardX = margin + col * (cardWidth + gapX);
        const cardY = margin + row * (cardHeight + gapY);

        pdf.setDrawColor(200);
        pdf.setLineWidth(0.3);
        pdf.rect(cardX, cardY, cardWidth, cardHeight);

        const padding = 5;
        const qrX = cardX + padding;
        const qrY = cardY + 10;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20);
        pdf.text(productName, qrX, cardY + 5);

        const qrCodeDataUrl = await QRCode.toDataURL(
          `${qrData.qrId}_${batchId}`,
          {
            width: 250,
            margin: 1,
            errorCorrectionLevel: "M",
          }
        );
        pdf.addImage(qrCodeDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0);

        const rightX = qrX + qrSize + 2;
        let textY = qrY;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20);

        textY += 14;
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80);
        pdf.text("Batch No:", rightX, textY);

        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0);
        pdf.text(batchId, rightX + 13, textY);

        textY += 8;
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100);
        pdf.text("Label Print Date:", rightX, textY);

        pdf.setTextColor(60);
        pdf.text(printDate, rightX + 19, textY);

        pdf.setTextColor(0);
      }

      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const generateCSV = (batchesData) => {
    const headers = [
      "Batch ID",
      "Product Name",
      "Dealer",
      "Points",
      "Expiry Date",
      "Created At",
      "Remarks",
    ];
    const rows = batchesData.map((batch) => [
      batch.batchId,
      batch.productName,
      batch.companyName,
      batch.points,
      batch.expiryDate || "None",
      formatDate(batch.createdAt),
      batch.remarks || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelect = (batchId) => {
    setSelectedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBatches.length === currentData.length) {
      setSelectedBatches([]);
    } else {
      setSelectedBatches(currentData.map((batch) => batch.batchId));
    }
  };

  const handleExportSelected = async (format) => {
    if (selectedBatches.length === 0) {
      toast.error("Please select at least one batch to export");
      return;
    }

    const loadingToast = toast.loading("Exporting...");
    setExporting(true);
    setShowExportMenu(false);

    try {
      const selectedBatchesData = batches.filter((batch) =>
        selectedBatches.includes(batch.batchId)
      );

      if (format === "csv") {
        const csvContent = generateCSV(selectedBatchesData);
        downloadFile(csvContent, `QR_Batches_${Date.now()}.csv`, "text/csv");
        toast.success("CSV exported successfully!", { id: loadingToast });
      } else if (format === "pdf") {
        if (selectedBatches.length === 1) {
          const batch = selectedBatchesData[0];
          const result = await fetchBatchById(batch.batchId);

          if (result?.success && result.data?.qrCodes) {
            const pdf = await generateQRCodePDF(
              result.data.qrCodes,
              batch.productName,
              batch.batchId
            );
            pdf.save(`QR_Indowud_${batch.batchId}_${Date.now()}.pdf`);
            toast.success("PDF downloaded successfully!", { id: loadingToast });
          } else {
            toast.error("Failed to fetch QR codes", { id: loadingToast });
          }
        } else {
          const zip = new JSZip();

          for (const batch of selectedBatchesData) {
            const result = await fetchBatchById(batch.batchId);

            if (result?.success && result.data?.qrCodes) {
              const pdf = await generateQRCodePDF(
                result.data.qrCodes,
                batch.productName,
                batch.batchId
              );
              const pdfBlob = pdf.output("blob");
              zip.file(`QR_Indowud_${batch.batchId}.pdf`, pdfBlob);
            }
          }

          const zipBlob = await zip.generateAsync({ type: "blob" });
          downloadFile(
            zipBlob,
            `QR_Batches_${Date.now()}.zip`,
            "application/zip"
          );
          toast.success(
            `${selectedBatches.length} PDFs exported as ZIP successfully!`,
            { id: loadingToast }
          );
        }
      }

      setSelectedBatches([]);
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Error exporting files. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExport = async (type, format) => {
    const loadingToast = toast.loading("Exporting...");
    setExporting(true);
    setShowExportMenu(false);

    try {
      let exportData = [];

      if (type === "first10") {
        exportData = batches.slice(0, 10);
      } else if (type === "half") {
        exportData = batches.slice(0, Math.ceil(batches.length / 2));
      } else if (type === "full") {
        exportData = batches;
      }

      if (format === "csv") {
        const csvContent = generateCSV(exportData);
        downloadFile(
          csvContent,
          `QR_Batches_${type}_${Date.now()}.csv`,
          "text/csv"
        );
        toast.success("CSV exported successfully!", { id: loadingToast });
      } else if (format === "excel") {
        const csvContent = generateCSV(exportData);
        downloadFile(
          csvContent,
          `QR_Batches_${type}_${Date.now()}.csv`,
          "text/csv"
        );
        toast.success("Excel file exported successfully!", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Error exporting file. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setExporting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      numberOfCodes: "",
      productName: "",
      productId: "",
      productUnit: "",
      companyName: "",
      dealerId: "",
      batchId: "",
      remarks: "",
      expiryDate: "None",
      customDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleGenerate = async () => {
    // Validation
    if (
      !formData.numberOfCodes ||
      !formData.productName ||
      !formData.companyName
    ) {
      toast.error(
        "Please fill in all required fields (Number of Codes, Product Name, and Dealer)"
      );
      return;
    }
    let expiryDate = null;
    if (formData.expiryType !== "None") {
      const today = new Date();
      if (formData.expiryType === "custom") {
        expiryDate = formData.customDate;
      } else {
        const months = parseInt(formData.expiryType.replace("months", ""));
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + months);
        expiryDate = futureDate.toISOString().split("T")[0];
      }
    }

    const loadingToast = toast.loading("Generating QR codes...");

    try {
      const dataToSend = {
        ...formData,
        expiryDate,
      };
      console.log("✅ Payload sent to server:", dataToSend);

      const result = await generateQRCodes(dataToSend);

      // Check if result is null or undefined
      if (!result) {
        toast.error("Failed to generate QR codes. Please try again.", {
          id: loadingToast,
        });
        return;
      }

      // Check if the generation was successful
      if (result.success) {
        toast.success("QR codes generated successfully!", { id: loadingToast });

        // Fetch updated batches
        await fetchAllBatches();

        // Try to generate and download PDF
        const pdfToast = toast.loading("Generating PDF...");

        try {
          const batchResult = await fetchBatchById(formData.batchId);

          if (batchResult?.success && batchResult.data?.qrCodes) {
            setGeneratingPDF(true);
            const pdf = await generateQRCodePDF(
              batchResult.data.qrCodes,
              formData.productName,
              formData.batchId
            );
            pdf.save(`QR_Indowud_${formData.batchId}_${Date.now()}.pdf`);
            setGeneratingPDF(false);

            toast.success(
              `Successfully generated ${formData.numberOfCodes} QR codes and downloaded PDF!`,
              { id: pdfToast }
            );
          } else {
            toast.error(
              "QR codes generated but PDF download failed. Please try downloading from the list.",
              { id: pdfToast }
            );
          }
        } catch (pdfError) {
          console.error("PDF generation error:", pdfError);
          toast.error(
            "Error generating PDF. Please try downloading from the list."
          );
        }

        // Reset form and close
        setShowForm(false);
        resetForm();
      } else {
        // Handle error response
        const errorMessage = result.error || "Failed to generate QR codes";
        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
        { id: loadingToast }
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleDownloadPDF = async (batch) => {
    const loadingToast = toast.loading("Generating PDF...");

    try {
      setGeneratingPDF(batch.batchId);

      const result = await fetchBatchById(batch.batchId);

      if (result?.success && result.data?.qrCodes) {
        const pdf = await generateQRCodePDF(
          result.data.qrCodes,
          batch.productName,
          batch.batchId
        );
        pdf.save(`QR_Indowud_${batch.batchId}_${Date.now()}.pdf`);
        toast.success("PDF downloaded successfully!", { id: loadingToast });
      } else {
        toast.error(
          "Failed to fetch QR codes for this batch. Please try again.",
          {
            id: loadingToast,
          }
        );
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error downloading PDF. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setGeneratingPDF(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <Toaster position="top-right" />
        <div className="rounded-lg space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Generate QR Codes
            </h2>
            {formData.batchId && (
              <button
                onClick={resetForm}
                className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

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
                disabled={loading || generatingPDF}
              />
            </div>

            <DealerSelectComponent
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={!!formData.batchId || loading || generatingPDF}
            />

            <ProductSelectComponent
              formData={formData}
              handleInputChange={handleInputChange}
              disabled={!!formData.batchId || loading || generatingPDF}
              fromQr={true}
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
                disabled={loading || generatingPDF}
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
                disabled={loading || generatingPDF}
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
              disabled={loading || generatingPDF}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGenerate}
              disabled={loading || generatingPDF}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Generating..."
                : generatingPDF
                  ? "Creating PDF..."
                  : "Generate"}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading || generatingPDF}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-4">
        <div>


          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            QR Code Generation</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage & Generate QR Codes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
            text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
            shadow-sm hover:shadow-md transition-all cursor-pointer" >
          <Plus size={20} />
          Generate QR Codes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading && batches.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <p className="text-gray-600">Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
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
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, batches.length)}{" "}
                  of {batches.length}
                </p>
                {selectedBatches.length > 0 && (
                  <span className="text-sm font-medium text-blue-600">
                    {selectedBatches.length} selected
                  </span>
                )}
              </div>

              <div className="flex gap-3 relative">
                {selectedBatches.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportSelected("csv")}
                      disabled={exporting}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      <Download size={18} />
                      {exporting ? "Exporting..." : "Export CSV"}
                    </button>
                    <button
                      onClick={() => handleExportSelected("pdf")}
                      disabled={exporting}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                      <Download size={18} />
                      {exporting
                        ? "Exporting..."
                        : selectedBatches.length > 1
                          ? "Export ZIP"
                          : "Export PDF"}
                    </button>
                    <button
                      onClick={() => setSelectedBatches([])}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
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
                      <input
                        type="checkbox"
                        checked={
                          selectedBatches.length === currentData.length &&
                          currentData.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dealer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((batch) => (
                    <tr key={batch.batchId} className="hover:bg-gray-50">
                      {/* ✅ Individual row checkbox */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="checkbox"
                          checked={selectedBatches.includes(batch.batchId)}
                          onChange={() => handleSelect(batch.batchId)}
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {batch.batchId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batch.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {batch.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {batch.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {batch.expiryDate || "None"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(batch.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDownloadPDF(batch)}
                          disabled={generatingPDF === batch.batchId}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download size={16} />
                          {generatingPDF === batch.batchId
                            ? "Loading..."
                            : "PDF"}
                        </button>
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
                          className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
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
