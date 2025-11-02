import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useProductContext } from "../Context/ProductsContext";

const ProductSelectComponent = ({ 
  formData, 
  handleInputChange, 
  disabled,
  isMultiple = false 
}) => {
  const { products, loading, error } = useProductContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find((p) => p.productId === selectedId);

    if (selectedProduct) {
      handleInputChange({
        target: {
          name: "productId",
          value: selectedProduct.productId,
        },
      });

      handleInputChange({
        target: {
          name: "productName",
          value: selectedProduct.productName,
        },
      });

      handleInputChange({
        target: {
          name: "productUnit",
          value: selectedProduct.productUnit,
        },
      });
    } else {
      // union of selected and visible
      next = Array.from(new Set([...selected, ...visible]));
    }
    setSelected(next);
    commitSelection(next);
  };

  const handleCheckboxChange = (product) => {
    const currentProducts = formData.products || [];
    const exists = currentProducts.some(p => p.productId === product.productId);

    let updatedProducts;
    if (exists) {
      updatedProducts = currentProducts.filter(p => p.productId !== product.productId);
    } else {
      updatedProducts = [...currentProducts, {
        productId: product.productId,
        productName: product.productName,
        productUnit: product.productUnit,
      }];
    }

    handleInputChange({
      target: {
        name: "products",
        value: updatedProducts,
      },
    });
  };

  const handleSelectAll = () => {
    const currentProducts = formData.products || [];
    
    if (currentProducts.length === products.length) {
      // Deselect all
      handleInputChange({
        target: {
          name: "products",
          value: [],
        },
      });
    } else {
      // Select all
      const allProducts = products.map(p => ({
        productId: p.productId,
        productName: p.productName,
        productUnit: p.productUnit,
      }));
      
      handleInputChange({
        target: {
          name: "products",
          value: allProducts,
        },
      });
    }
  };

  const selectedProducts = formData.products || [];
  const isAllSelected = products.length > 0 && selectedProducts.length === products.length;
  const isSomeSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Name {!isMultiple && "*"}
      </label>

      {loading ? (
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-gray-500">Loading products...</span>
        </div>
      ) : error ? (
        <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50">
          <p className="text-sm text-yellow-700">
            No products available. Please add products first.
          </p>
        </div>
      ) : isMultiple ? (
        <div className="relative">
          {/* Dropdown Toggle Button */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-700">
              {selectedProducts.length === 0
                ? "Select products"
                : `${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''} selected`}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && !disabled && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {/* Select All Option */}
              <label className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = isSomeSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Select All
                </span>
              </label>

              {/* Product Options */}
              {products.map((product) => {
                const isSelected = selectedProducts.some(p => p.productId === product.productId);
                return (
                  <label
                    key={product.productId}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(product)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {product.productName} ({product.productUnit})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <select
          name="productId"
          value={formData.productId || ""}
          onChange={handleProductChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "border-gray-300"
          }`}
          required
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName} ({product.productUnit})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProductSelectComponent;