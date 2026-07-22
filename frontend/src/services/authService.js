import api from "./axiosInstance";

// Customer auth — no token needed
export const registerCustomer = (data) => api.post("/auth/customer/register", data);
export const loginCustomer = (data) => api.post("/auth/customer/login", data);

// Provider auth — no token needed
export const registerProvider = (data) => api.post("/auth/provider/register", data);
export const loginProvider = (data) => api.post("/auth/provider/login", data);

// Admin auth
export const loginAdmin = (data) => api.post("/auth/admin/login", data);
