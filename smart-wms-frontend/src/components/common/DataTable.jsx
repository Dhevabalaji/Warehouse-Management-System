import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DataTable({
  columns = [],
  data = [],
  pageSize = 8,
  showPagination = true,
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = useMemo(() => {
    if (!showPagination) return data;

    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize, showPagination]);

  function previousPage() {
    setPage((current) => Math.max(current - 1, 1));
  }

  function nextPage() {
    setPage((current) => Math.min(current + 1, totalPages));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-5 py-4 font-semibold whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-5 py-4 text-slate-200 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && data.length > pageSize && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 border-t border-white/10">
          <p className="text-sm text-slate-400">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, data.length)} of {data.length} records
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={previousPage}
              disabled={page === 1}
              className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-slate-300 px-3">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}