import { useState } from "react";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage, setStorage } from "../../utils/storageService.js";

export default function StockRequestsPage() {
  const { user } = useAuthContext();

  const [requests, setRequests] = useState(
    getStorage("wms_stock_requests", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

  function updateStatus(id, status) {
    const all = getStorage("wms_stock_requests", []);

    const updatedAll = all.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    const updatedLocal = requests.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    setStorage("wms_stock_requests", updatedAll);
    setRequests(updatedLocal);
  }

  const columns = [
    { key: "itemName", label: "Item" },
    { key: "sku", label: "SKU" },
    { key: "quantity", label: "Requested Qty" },
    { key: "requestedBy", label: "Requested By" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    {
      key: "action",
      label: "Action",
      render: (_, row) =>
        row.status === "Pending" ? (
          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(row.id, "Approved")}
              className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300"
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(row.id, "Rejected")}
              className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-slate-500">Done</span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Stock Requests"
        description="Approve or reject staff stock requests"
      />

      <DataTable columns={columns} data={requests} />
    </>
  );
}