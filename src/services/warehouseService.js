import api from "./api";

export async function getWarehouses() {
  const response = await api.get("/warehouses");
  return response.data;
}

export async function createWarehouse(payload) {
  const response = await api.post("/warehouses", payload);
  return response.data;
}

export async function updateWarehouse(id, payload) {
  const response = await api.put(`/warehouses/${id}`, payload);
  return response.data;
}

export async function deleteWarehouse(id) {
  const response = await api.delete(`/warehouses/${id}`);
  return response.data;
}