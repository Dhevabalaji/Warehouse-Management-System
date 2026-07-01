export function searchRows(rows, search, keys = []) {
  const query = String(search || "").toLowerCase().trim();

  if (!query) return rows;

  return rows.filter((row) =>
    keys.some((key) =>
      String(row[key] || "")
        .toLowerCase()
        .includes(query)
    )
  );
}

export function filterRows(rows, filterValue, key) {
  if (!filterValue || !key) return rows;

  return rows.filter((row) => String(row[key]) === String(filterValue));
}