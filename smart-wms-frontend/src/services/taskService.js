import api from "./api";

export const taskService = {
  getAll: async () => {
    const res = await api.get("/tasks");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/tasks", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/tasks/${id}`, payload);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};