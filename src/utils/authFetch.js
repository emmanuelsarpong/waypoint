const API_BASE = "http://localhost:3000"; // or use process.env for production

export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}
