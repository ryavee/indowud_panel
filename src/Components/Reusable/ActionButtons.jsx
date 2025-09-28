import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const ActionButtons = ({ onEdit, onDelete, loadingEdit, loadingDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        disabled={loadingEdit}
        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 flex items-center gap-1 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Edit2 size={14} />
        Edit
      </button>
      <button
        onClick={onDelete}
        disabled={loadingDelete}
        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 flex items-center gap-1 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
