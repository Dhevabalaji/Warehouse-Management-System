import api from "./api";

export const notificationService = {
  getAll: async () =>
    (await api.get("/notifications")).data,

  markRead: async (id) =>
    (await api.patch(`/notifications/${id}/read`)).data,

  clearAll: async () =>
    (await api.delete("/notifications")).data,
};