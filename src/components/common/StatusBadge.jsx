const styles = {
  Active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Inactive: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  "In Stock": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "Low Stock": "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  "Out of Stock": "bg-red-500/10 text-red-300 border-red-500/20",
  Pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  Approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-300 border-red-500/20",
  Completed: "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status] || "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}