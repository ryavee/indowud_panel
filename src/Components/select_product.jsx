import { Loader2 } from "lucide-react";
import { useProductContext } from "../Context/ProductsContext";
import { usePromotionalContext } from "../Context/PromotionalContext";

const ProductSelectComponent = ({
  formData,
  handleInputChange,
  disabled,
  fromQr = false,
}) => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProductContext();
  const {
    promotions,
    loading: promotionsLoading,
    error: promotionsError,
  } = usePromotionalContext();

  // Choose source based on fromQr
  const productList = fromQr ? promotions : products;
  const loading = fromQr ? promotionsLoading : productsLoading;
  const error = fromQr ? promotionsError : productsError;

  const handleProductChange = (e) => {
    const selectedId = e.target.value;

    const selectedProduct = productList.find((p) =>
      fromQr ? p.productId === selectedId : p.id === selectedId
    );

    if (selectedProduct) {
      handleInputChange({
        target: {
          name: "productId",
          value: fromQr ? selectedProduct.productId : selectedProduct.id,
        },
      });

      handleInputChange({
        target: {
          name: "productName",
          value: fromQr
            ? selectedProduct.productName
            : selectedProduct.productName,
        },
      });

      handleInputChange({
        target: {
          name: "productUnit",
          value: fromQr
            ? selectedProduct.productUnit
            : selectedProduct.productUnit,
        },
      });
    } else {
      handleInputChange({ target: { name: "productId", value: "" } });
      handleInputChange({ target: { name: "productName", value: "" } });
      handleInputChange({ target: { name: "productUnit", value: "" } });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Name *
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
      ) : productList.length === 0 ? (
        <div className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50">
          <p className="text-sm text-yellow-700">
            No products available. Please add products first.
          </p>
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
          <option value={""}>Select a product</option>
          {productList.map((product) => (
            <option
              key={fromQr ? product.productId : product.id}
              value={fromQr ? product.productId : product.id}
            >
              {product.productName} ({product.productUnit})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProductSelectComponent;
