import api from "./api";

export const tenantService = {
  getProfile: async () =>
    (await api.get("/tenant")).data,

  updateProfile: async (data) =>
    (await api.put("/tenant", data)).data,
};