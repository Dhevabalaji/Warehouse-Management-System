import api from "./api";

export const damagedGoodsService = {
  getAll: async () =>
    (await api.get("/damaged-goods")).data,

  create: async (data) =>
    (await api.post("/damaged-goods", data)).data,

  update: async (id, data) =>
    (await api.put(`/damaged-goods/${id}`, data)).data,

  remove: async (id) =>
    (await api.delete(`/damaged-goods/${id}`)).data,
};