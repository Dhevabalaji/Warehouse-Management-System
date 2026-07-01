import { Search } from "lucide-react";

export default function SearchFilterBar({
  search,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "All",
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-5">
      <div className="flex items-center gap-3 flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none flex-1 text-sm"
        />
      </div>

      {filterOptions.length > 0 && (
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-yellow-400 text-sm"
        >
          <option value="">{filterPlaceholder}</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}