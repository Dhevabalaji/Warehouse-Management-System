import api from "./api";

export const stockRequestService = {
  getAll: async () => {
    const res = await api.get("/stock-requests");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/stock-requests/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/stock-requests", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/stock-requests/${id}`, data);
    return res.data;
  },

  approve: async (id) => {
    const res = await api.patch(`/stock-requests/${id}/approve`);
    return res.data;
  },

  reject: async (id) => {
    const res = await api.patch(`/stock-requests/${id}/reject`);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/stock-requests/${id}`);
    return res.data;
  },
};