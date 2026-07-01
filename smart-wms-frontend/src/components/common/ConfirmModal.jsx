import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-950 border border-white/10 p-6">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 text-red-300 flex items-center justify-center mb-5">
          <AlertTriangle />
        </div>

        <h2 className="text-xl font-black text-white">{title}</h2>

        <p className="text-slate-400 mt-2">{message}</p>

        <div className="flex justify-end gap-3 mt-7">
          <button type="button" onClick={onCancel} className="btn-secondary">
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}