import React, { useRef } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

const ImportCSVButton = ({
  requiredHeaders = [],
  onUpload,
  label = "Import CSV",
  disabled = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📁 File selected:", file.name);

    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a valid .csv file");
      e.target.value = null;
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 1,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          toast.error("CSV file is empty");
          e.target.value = null;
          return;
        }

        const csvHeaders = Object.keys(results.data[0] || {}).map((h) =>
          h
            .replace(/^\uFEFF/, "")
            .trim()
            .toLowerCase()
        );
        const requiredKeys = requiredHeaders.map((h) =>
          h.header.trim().toLowerCase()
        );
        const missingKeys = requiredKeys.filter(
          (header) => !csvHeaders.includes(header)
        );

        if (missingKeys.length > 0) {
          toast.error(
            `Missing columns: ${missingKeys
              .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
              .join(", ")}`
          );
          e.target.value = null;
          return;
        }
        if (onUpload) {
          onUpload(file);
        }

        e.target.value = null;
      },
      error: (error) => {
        console.error("❌ CSV Parse Error:", error);
        toast.error(`Error parsing CSV: ${error.message}`);
        e.target.value = null;
      },
    });
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all
          ${
            disabled
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 hover:bg-green-700 text-white active:scale-[0.97]"
          }
        `}
      >
        <Upload className="h-4 w-4" />
        {label}
      </button>
    </div>
  );
};

export default ImportCSVButton;
