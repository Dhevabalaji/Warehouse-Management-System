import api from "./api";

export const inventoryService = {
  getAll: async () => {
    const res = await api.get("/inventory");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/inventory", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/inventory/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/inventory/${id}`);
    return res.data;
  },
};