import { useEffect } from "react";
import { Loader, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info", // "danger" | "success" | "warning" | "info"
  closeOnBackdrop = true,
}) => {
  if (!isOpen) return null;

  // 🎹 Keyboard Shortcuts (Esc = cancel, Enter = confirm)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter") onConfirm?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // 🎨 Icon & Color Variants
  const variants = {
    danger: {
      icon: <AlertTriangle className="text-red-600 w-6 h-6" />,
      confirmClass: "bg-red-600 hover:bg-red-700",
    },
    success: {
      icon: <CheckCircle className="text-green-600 w-6 h-6" />,
      confirmClass: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
      confirmClass: "bg-yellow-500 hover:bg-yellow-600",
    },
    info: {
      icon: <Info className="text-[#169698] w-6 h-6" />,
      confirmClass: "bg-[#169698] hover:bg-[#128083]",
    },
  };

  const { icon, confirmClass } = variants[type] || variants.info;

  // 🩵 Handle backdrop click (optional)
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-xs animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-[90%] sm:w-full sm:max-w-sm p-6 border border-gray-100 transform animate-modalPop relative">
        {/* ❌ Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 🔹 Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        {/* 🔸 Message */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {/* 🔘 Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-all active:scale-[0.98] cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm active:scale-[0.98] transition-all cursor-pointer ${confirmClass}`}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
