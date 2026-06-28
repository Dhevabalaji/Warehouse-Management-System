import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-950 border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black">{title}</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}