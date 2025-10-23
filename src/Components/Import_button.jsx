import React, { useRef } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

const ImportCSVButton = ({ requiredHeaders = [], onUpload, label = "Import CSV" }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a valid .csv file");
      e.target.value = null;
      return;
    }

    // Parse CSV to read headers
    Papa.parse(file, {
      header: true,
      preview: 1, // read only header
      complete: (results) => {
        const csvHeaders = Object.keys(results.data[0] || {});
        const requiredKeys = requiredHeaders.map((h) =>
          typeof h === "string" ? h : h.header
        );

        const missingKeys = requiredKeys.filter(
          (key) => !csvHeaders.includes(key)
        );

        if (missingKeys.length > 0) {
          toast.error(
            `Missing columns: ${missingKeys.join(", ")}. File not imported.`
          );
          e.target.value = null;
          return;
        }

        toast.success("CSV file validated successfully!");
        onUpload?.(file);
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
      >
        <Upload className="h-4 w-4" />
        {label}
      </button>
    </div>
  );
};

export default ImportCSVButton;
