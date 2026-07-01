import api from "./api";

export const purchaseOrderService = {
  getAll: async () => {
    const res = await api.get("/purchase-orders");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/purchase-orders", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/purchase-orders/${id}`, payload);
    return res.data;
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/purchase-orders/${id}/status`, { status });
    return res.data;
  },

  receive: async (id) => {
    const res = await api.patch(`/purchase-orders/${id}/receive`);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/purchase-orders/${id}`);
    return res.data;
  },
};