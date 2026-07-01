import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import { notificationService } from "../../services/notificationService.js";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAsRead(id) {
    try {
      await notificationService.markRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, read: true } : item
        )
      );

      toast.success("Notification marked as read");
    } catch (error) {
      toast.error(error.message || "Failed to update notification");
    }
  }

  if (loading) return <PageLoader text="Loading notifications..." />;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="System alerts and warehouse updates from MongoDB"
      />

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-slate-400">
            No notifications found
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
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
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={item.read ? "Completed" : "Pending"} />

                  {!item.read && (
                    <button
                      onClick={() => markAsRead(item._id)}
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