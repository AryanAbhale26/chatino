// Use the same origin for API requests.
// NGINX will proxy /auth and /api requests to the backend.
export const BASE_API_URL = process.env.REACT_APP_API_URL || "";