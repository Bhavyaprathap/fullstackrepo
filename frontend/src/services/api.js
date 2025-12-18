import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // proxied by Vite in dev, direct in prod
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
