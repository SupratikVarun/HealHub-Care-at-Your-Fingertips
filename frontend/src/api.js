const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildHeaders = (token, hasBody = false) => {
  const headers = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (endpoint, { method = 'GET', body, token } = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: buildHeaders(token, Boolean(body)),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
};

export const api = {
  get: (endpoint, token) => request(endpoint, { method: 'GET', token }),
  post: (endpoint, body, token) => request(endpoint, { method: 'POST', body, token }),
  patch: (endpoint, body, token) => request(endpoint, { method: 'PATCH', body, token }),
};
