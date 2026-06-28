import { getStorage, setStorage } from "./storageService.js";

export function addActivity({ title, description, type = "info", user }) {
  const logs = getStorage("wms_activity_logs", []);

  const log = {
    id: `ACT-${Date.now()}`,
    title,
    description,
    type,
    userName: user?.name || "System",
    role: user?.role || "system",
    companyCode: user?.companyCode || "GLOBAL",
    tenantId: user?.tenantId || null,
    createdAt: new Date().toISOString(),
  };

  setStorage("wms_activity_logs", [log, ...logs]);
  return log;
}

export function addNotification({
  title,
  message,
  type = "info",
  user,
  targetRole = "all",
}) {
  const notifications = getStorage("wms_notifications", []);

  const notification = {
    id: `NOTI-${Date.now()}`,
    title,
    message,
    type,
    targetRole,
    companyCode: user?.companyCode || "GLOBAL",
    tenantId: user?.tenantId || null,
    read: false,
    createdAt: new Date().toISOString(),
  };

  setStorage("wms_notifications", [notification, ...notifications]);
  return notification;
}