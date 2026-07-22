import api from "./axiosInstance";

export const getAllProviders = () => api.get("/providers");
export const getProviderById = (id) => api.get(`/providers/${id}`);
export const createProvider = (data) => api.post("/providers", data);
export const updateProvider = (id, data) => api.put(`/providers/${id}`, data);
export const deleteProvider = (id) => api.delete(`/providers/${id}`);
export const getProvidersByCategory = (category) => api.get(`/providers/category/${category}`);
export const getProvidersByCity = (city) => api.get(`/providers/city/${city}`);
export const approveProvider = (id) => api.put(`/providers/${id}/approve`);
export const rejectProvider = (id) => api.put(`/providers/${id}/reject`);
export const suspendProvider = (id) => api.put(`/providers/${id}/suspend`);
