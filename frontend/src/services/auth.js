import { api } from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  return data.user;
};

export const signup = async (name, email, password) => {
  const { data } = await api.post("/auth/signup", { name, email, password });
  localStorage.setItem("token", data.token);
  return data.user;
};
