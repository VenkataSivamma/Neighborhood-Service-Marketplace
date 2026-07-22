import api from "./axiosInstance";

export const getAllCustomers = () => api.get("/customers");
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const getCustomersByCity = (city) => api.get(`/customers/city/${city}`);
