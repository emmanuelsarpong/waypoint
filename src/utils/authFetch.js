const API_BASE = import.meta.env.PROD
  ? "https://waypoint-production-5b75.up.railway.app"
  : "http://localhost:3000";

export function authFetch(path, options = {}) {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  if (import.meta.env.DEV) {
    console.log(`API Call: ${API_BASE}${path}`, {
      token: !!token,
      env: import.meta.env.MODE,
    });
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
}
