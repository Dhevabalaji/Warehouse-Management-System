import api from "./api";

export const warehouseService = {
  getAll: async () => {
    const res = await api.get("/warehouses");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/warehouses", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/warehouses/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/warehouses/${id}`);
    return res.data;
  },
};