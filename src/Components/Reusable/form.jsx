import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Transparent Backdrop with inline styles and small blur */}
      <div 
        className="fixed inset-0 z-40" 
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)' // For Safari compatibility
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-400"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 bg-white">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;