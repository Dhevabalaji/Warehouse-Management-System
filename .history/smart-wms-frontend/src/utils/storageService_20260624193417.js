export function getStorage(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function addStorageItem(key, item) {
  const existing = getStorage(key, []);
  const updated = [...existing, item];
  setStorage(key, updated);
  return updated;
}