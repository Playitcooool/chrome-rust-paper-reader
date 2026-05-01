import { DEFAULT_CONNECTOR_URL } from "./constants.js";

function normalizeBaseUrl(baseUrl = DEFAULT_CONNECTOR_URL) {
  return baseUrl.replace(/\/$/, "");
}

async function request(baseUrl, path, { token, method = "GET", body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${normalizeBaseUrl(baseUrl)}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `${response.status} ${response.statusText}`.trim());
  }

  return data;
}

export async function checkHealth(baseUrl) {
  return request(baseUrl, "/v1/health");
}

export async function fetchCollections(baseUrl, token) {
  return request(baseUrl, "/v1/collections", { token });
}

export async function importPath(baseUrl, token, payload) {
  return request(baseUrl, "/v1/import-path", {
    method: "POST",
    token,
    body: payload
  });
}
