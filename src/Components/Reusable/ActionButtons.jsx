import React from "react";
import { SquarePen , Trash2, Loader2 } from "lucide-react";

const ActionButtons = ({
  onEdit,
  onDelete,
  loadingEdit,
  loadingDelete,
  disableAll,
}) => { 
  const baseClass =
    "flex items-center justify-center p-2 rounded-md transition-all duration-200 cursor-pointer";

  const editClass = `
    ${baseClass} 
    text-[#169698] hover:bg-[#169698]/10 
    hover:text-[#0f7d7f] active:scale-[0.97]
  `;

  const deleteClass = `
    ${baseClass} 
    text-red-600 hover:bg-red-50 
    hover:text-red-700 active:scale-[0.97]
  `;

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <button
        onClick={onEdit}
        disabled={disableAll || loadingEdit || loadingDelete}
        className={`${editClass} ${
          (disableAll || loadingEdit || loadingDelete) &&
          "opacity-60 cursor-not-allowed"
        }`}
      >
        {loadingEdit ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#169698]" />
        ) : (
          <SquarePen  className="w-4 h-4" />
        )}
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        disabled={disableAll || loadingEdit || loadingDelete}
        className={`${deleteClass} ${
          (disableAll || loadingEdit || loadingDelete) &&
          "opacity-60 cursor-not-allowed"
        }`}
      >
        {loadingDelete ? (
          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
