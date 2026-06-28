import { useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage } from "../../utils/storageService.js";
import { searchRows, filterRows } from "../../utils/filterUtils.js";

export default function ActivityLogsPage() {
  const { user } = useAuthContext();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const logs = getStorage("wms_activity_logs", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const filteredLogs = useMemo(() => {
    const searched = searchRows(logs, search, [
      "title",
      "description",
      "userName",
      "role",
      "type",
    ]);

    return filterRows(searched, typeFilter, "type");
  }, [logs, search, typeFilter]);

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "userName", label: "User" },
    { key: "role", label: "Role" },
    { key: "type", label: "Type" },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description="Track important actions inside the company workspace"
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={typeFilter}
        onFilterChange={setTypeFilter}
        filterPlaceholder="All Types"
        filterOptions={["info", "success", "warning", "danger"]}
      />

      <DataTable columns={columns} data={filteredLogs} />
    </div>
  );
}