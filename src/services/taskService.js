import api from "./api";

export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}

export async function createTask(payload) {
  const response = await api.post("/tasks", payload);
  return response.data;
}

export async function updateTaskStatus(id, status) {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
}