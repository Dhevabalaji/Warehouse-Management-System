import api from "./api";

export const userService = {
  getAll: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/users", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};