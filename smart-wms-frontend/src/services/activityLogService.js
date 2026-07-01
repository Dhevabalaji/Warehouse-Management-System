import api from "./api";

export const activityLogService = {
  getAll: async () =>
    (await api.get("/activity-logs")).data,
};