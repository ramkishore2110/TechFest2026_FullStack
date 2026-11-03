const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

let csrfToken = null;

async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    method: "GET",
    credentials: "include"
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.csrfToken) {
    throw new Error(data.message || "Could not start a secure session with the backend.");
  }

  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { ...(options.headers || {}) };
  let body = options.body;

  if (body && typeof body !== "string") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers["X-CSRF-Token"] = await getCsrfToken();
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    body,
    credentials: "include"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 403 && String(data.message || "").includes("CSRF")) {
      csrfToken = null;
    }
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export { API_BASE_URL };
