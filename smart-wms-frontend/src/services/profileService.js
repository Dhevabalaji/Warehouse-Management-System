import api from "./api";

export const profileService = {
  getProfile: async () =>
    (await api.get("/profile")).data,

  updateProfile: async (data) =>
    (await api.put("/profile", data)).data,

  changePassword: async (data) =>
    (await api.put("/profile/password", data)).data,
};