import { Loader2 } from "lucide-react";
import { useProductContext } from "../Context/ProductsContext";

const ProductSelectComponent = ({ formData, handleInputChange, disabled }) => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProductContext();

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedProduct = products.find(
      (p) => p.id.toString() === selectedId
    );

    handleInputChange({
      target: { name: "productId", value: selectedProduct?.id || "" },
    });

    handleInputChange({
      target: {
        name: "productName",
        value: selectedProduct?.productName || "",
      },
    });
    handleInputChange({
      target: {
        name: "productUnit",
        value: selectedProduct?.productUnit || "",
      },
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Name *
      </label>

      {productsLoading ? (
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-gray-500">Loading products...</span>
        </div>
      ) : productsError ? (
        <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50">
          <p className="text-sm text-red-600">{productsError}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50">
          <p className="text-sm text-yellow-700">
            No products available. Please add products first.
          </p>
        </div>
      ) : (
        <select
          name="productId"
          value={formData.productId?.toString() || ""}
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
            <option key={product.id} value={product.id.toString()}>
              {product.productName} ({product.productUnit})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProductSelectComponent;
