import { useState } from "react";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage, setStorage } from "../../utils/storageService.js";

export default function NotificationsPage() {
  const { user } = useAuthContext();

  const [notifications, setNotifications] = useState(
    getStorage("wms_notifications", []).filter(
      (item) =>
        item.companyCode === user.companyCode &&
        (item.targetRole === "all" || item.targetRole === user.role)
    )
  );

  function markAsRead(id) {
    const all = getStorage("wms_notifications", []);

    const updatedAll = all.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );

    const updatedLocal = notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );

    setStorage("wms_notifications", updatedAll);
    setNotifications(updatedLocal);
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="System alerts and warehouse updates"
      />

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-slate-400">
            No notifications found
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 ${
                item.read
                  ? "bg-white/5 border-white/10"
                  : "bg-yellow-400/10 border-yellow-400/30"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black">{item.title}</h2>
                  <p className="text-slate-400 mt-1">{item.message}</p>

                  <p className="text-xs text-slate-500 mt-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={item.read ? "Completed" : "Pending"} />

                  {!item.read && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="btn-secondary"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}