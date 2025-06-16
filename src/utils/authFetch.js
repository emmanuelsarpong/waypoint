const API_BASE = "http://localhost:3000";
export function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
}
