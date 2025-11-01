import React, { useState, useEffect, useRef } from "react";
import { Upload, ChevronDown } from "lucide-react";
import { getCurrentUserRole, ROLES } from "../utils/rbac";

const ExportButton = ({
  data = [],
  columns = [],
  filename = "export",
  disabled = false,
  customExport = null,
  page = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentUserRole = getCurrentUserRole();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportDemo = () => {
    const headers = columns.map((col) => col.header);
    const csvRows = [headers.join(",")];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}-demo-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const handleExportCSV = () => {
    if (customExport) {
      customExport();
      setIsOpen(false);
      return;
    }

    const headers = columns.map((col) => col.header);
    const csvRows = [headers.join(",")];

    data.forEach((item) => {
      const row = columns.map((col) => {
        const value = item[col.key];
        const formattedValue = col.formatter
          ? col.formatter(value, item)
          : value || "";
        return formattedValue;
      });
      csvRows.push(row.map((field) => `"${field}"`).join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
      >
        <Upload className="w-4 h-4" />
        Export
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={handleExportDemo}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Demo
          </button>
          {currentUserRole !== ROLES.QR_GENERATE && page === "dealers" ? (
            <button
              onClick={handleExportCSV}
              disabled={data.length === 0}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Export to CSV
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
