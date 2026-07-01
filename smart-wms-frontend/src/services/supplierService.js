import api from "./api";

export const supplierService = {
  getAll: async () => {
    const res = await api.get("/suppliers");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/suppliers", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/suppliers/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/suppliers/${id}`);
    return res.data;
  },
};