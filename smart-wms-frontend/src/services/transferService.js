import api from "./api";

export const transferService = {
  getAll: async () => {
    const res = await api.get("/transfers");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/transfers/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/transfers", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/transfers/${id}`, data);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/transfers/${id}/status`, {
      status,
    });
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/transfers/${id}`);
    return res.data;
  },
};