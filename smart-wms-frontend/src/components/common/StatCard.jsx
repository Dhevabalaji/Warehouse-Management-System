export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="text-3xl font-black mt-2">{value}</h3>
        </div>

        {Icon && (
          <div className="h-12 w-12 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center">
            <Icon size={24} />
          </div>
        )}
      </div>

      {trend && (
        <p className="text-sm text-emerald-400 mt-4">{trend}</p>
      )}
    </div>
  );
}