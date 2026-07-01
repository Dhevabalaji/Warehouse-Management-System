import api from "./api";

export const stockMovementService = {
  getAll: async () => (await api.get("/stock-movements")).data,

  create: async (data) =>
    (await api.post("/stock-movements", data)).data,

  remove: async (id) =>
    (await api.delete(`/stock-movements/${id}`)).data,
};