import { useEffect, useMemo, useState } from "react";

import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { activityLogService } from "../../services/activityLogService.js";
import toast from "react-hot-toast";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    try {
      setLoading(true);
      const data = await activityLogService.getAll();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

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
      render: (value) => (value ? new Date(value).toLocaleString() : "-"),
    },
  ];

  if (loading) return <PageLoader text="Loading activity logs..." />;

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description="MongoDB audit logs for system operations"
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