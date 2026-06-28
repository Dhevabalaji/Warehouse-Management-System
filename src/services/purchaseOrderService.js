import api from "./api";

export async function getPurchaseOrders() {
  const response = await api.get("/purchase-orders");
  return response.data;
}

export async function createPurchaseOrder(payload) {
  const response = await api.post("/purchase-orders", payload);
  return response.data;
}

export async function updatePurchaseOrderStatus(id, status) {
  const response = await api.patch(`/purchase-orders/${id}/status`, { status });
  return response.data;
}