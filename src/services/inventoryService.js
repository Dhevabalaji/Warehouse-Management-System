import api from "./api";

export async function getInventory() {
  const response = await api.get("/inventory");
  return response.data;
}

export async function createInventoryItem(payload) {
  const response = await api.post("/inventory", payload);
  return response.data;
}

export async function updateInventoryItem(id, payload) {
  const response = await api.put(`/inventory/${id}`, payload);
  return response.data;
}

export async function deleteInventoryItem(id) {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
}