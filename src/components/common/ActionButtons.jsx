import { Edit, Trash2 } from "lucide-react";

export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
      >
        <Edit size={16} />
      </button>

      <button
        onClick={onDelete}
        className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}