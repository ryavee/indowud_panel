// src/Components/select_product.jsx
import React, { useState, useEffect, useRef } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { useProductContext } from "../Context/ProductsContext";

const ProductSelectComponent = ({ formData, handleInputChange, placeholder = "Select product(s)..." }) => {
  const { products = [], loading } = useProductContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => {
    // normalize initial selection (products may come as string or array)
    if (!formData?.productId) return [];
    return Array.isArray(formData.productId) ? formData.productId : (typeof formData.productId === "string" && formData.productId ? formData.productId.split(",") : []);
  });
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const dropdownRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // keep selectAll state in sync with products/selection
  useEffect(() => {
    const visibleIds = filteredProducts(products, query).map((p) => String(p.id));
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
    setSelectAllChecked(allVisibleSelected);
  }, [selected, products, query]);

  // helper to filter products by search
  const filteredProducts = (productList, q) => {
    if (!q) return productList;
    const lower = q.toLowerCase();
    return productList.filter(
      (p) =>
        (p.productName || "").toLowerCase().includes(lower) ||
        (p.sku || "").toLowerCase().includes(lower)
    );
  };

  const onToggleProduct = (product) => {
    const id = String(product.id);
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    setSelected(next);
    commitSelection(next);
  };

  const commitSelection = (selectedIds) => {
    // convert ids to names
    const names = (selectedIds || []).map((sid) => {
      const p = products.find((pr) => String(pr.id) === String(sid));
      return p ? p.productName : "";
    }).filter(Boolean);

    // call parent's handleInputChange twice (productName, productId)
    if (typeof handleInputChange === "function") {
      handleInputChange({ target: { name: "productId", value: selectedIds } });
      handleInputChange({ target: { name: "productName", value: names.join(", ") } });
    }
  };

  const onToggleSelectAllVisible = () => {
    const visible = filteredProducts(products, query).map((p) => String(p.id));
    // if all visible already selected -> unselect visible, else add all visible
    const allSelected = visible.every((id) => selected.includes(id));
    let next;
    if (allSelected) {
      // remove visible ids
      next = selected.filter((s) => !visible.includes(s));
    } else {
      // union of selected and visible
      next = Array.from(new Set([...selected, ...visible]));
    }
    setSelected(next);
    commitSelection(next);
  };

  // expose changes from external formData (if parent sets it)
  useEffect(() => {
    if (!formData?.productId) return;
    const normalized = Array.isArray(formData.productId) ? formData.productId.map(String) : (typeof formData.productId === "string" ? formData.productId.split(",").map(s => s.trim()).filter(Boolean) : []);
    setSelected(normalized);
  }, [formData?.productId]);

  // render
  const visible = filteredProducts(products, query);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Product(s) <span className="text-red-500">*</span></label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:shadow-sm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {selected.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <span className="truncate">{(formData?.productName) || `${selected.length} selected`}</span>
            )}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-72 overflow-auto">
          <div className="px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full text-sm outline-none px-1 py-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="selectAllVisible"
                  type="checkbox"
                  checked={selectAllChecked}
                  onChange={onToggleSelectAllVisible}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="selectAllVisible" className="text-sm text-gray-600 cursor-pointer">Select all</label>
              </div>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading products...</div>
            ) : visible.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No products match "{query}"</div>
            ) : (
              visible.map((p) => {
                const id = String(p.id);
                const checked = selected.includes(id);
                return (
                  <div key={id} className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleProduct(p)}
                      className="w-4 h-4 cursor-pointer"
                      id={`prod-${id}`}
                    />
                    <label htmlFor={`prod-${id}`} className="flex-1 text-sm cursor-pointer">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate">
                          <div className="font-medium text-gray-800 truncate">{p.productName}</div>
                          {p.sku && <div className="text-xs text-gray-500">SKU: {p.sku}</div>}
                        </div>
                        {checked && <Check className="w-4 h-4 text-[#00A9A3]" />}
                      </div>
                    </label>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-3 py-2 border-t flex items-center justify-between gap-2">
            <div className="text-xs text-gray-600">{selected.length} selected</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setSelected([]); commitSelection([]); }}
                className="text-sm px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm px-3 py-1 rounded bg-[#00A9A3] text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelectComponent;
