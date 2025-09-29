import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { useDealersContext } from "../Context/DealersContext";

const DealerSelectComponent = ({ formData, handleInputChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const { dealers } = useDealersContext();

  const filteredDealers = dealers.filter((dealer) => {
    const name = (dealer.firstName || "").toLowerCase();
    const id = (dealer.dealersId || "").toLowerCase();
    const state = (dealer.state || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return name.includes(term) || id.includes(term) || state.includes(term);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDealer = (dealer) => {
    if (disabled) return;
    const dealerName = `${dealer.firstName} ${dealer.lastName}`.trim();
    handleInputChange({
      target: { name: "dealerName", value: dealerName },
    });
    handleInputChange({
      target: { name: "dealerId", value: dealer.dealersId },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearDealer = (e) => {
    e.stopPropagation();
    if (disabled) return;
    handleInputChange({ target: { name: "dealerName", value: "" } });
    handleInputChange({ target: { name: "dealerId", value: "" } });
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Dealer Name *
      </label>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-md flex items-center justify-between ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer"
        }`}
      >
        <span
          className={formData.dealerName ? "text-gray-900" : "text-gray-400"}
        >
          {formData.dealerName || "Select a dealer"}
        </span>
        <div className="flex items-center gap-2">
          {formData.dealerName && !disabled && (
            <X
              size={16}
              className="text-gray-400 hover:text-gray-600"
              onClick={handleClearDealer}
            />
          )}
          <ChevronRight
            size={16}
            className={`text-gray-400 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search dealers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Dealer List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredDealers.length > 0 ? (
              filteredDealers.map((dealer) => {
                const dealerName =
                  `${dealer.firstName} ${dealer.lastName}`.trim();
                return (
                  <div
                    key={dealer.id}
                    onClick={() => handleSelectDealer(dealer)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {dealerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {dealer.dealersId} • {dealer.state}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-gray-500">
                No dealers found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerSelectComponent;
