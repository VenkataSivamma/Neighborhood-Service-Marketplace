import api from "./axiosInstance";

export const getAllNotifications = () => api.get("/notifications");
export const getNotificationById = (id) => api.get(`/notifications/${id}`);
export const createNotification = (data) => api.post("/notifications", data);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const getNotificationsByCustomer = (customerId) =>
  api.get(`/notifications/customer/${customerId}`).catch((e) => {
    if (e.response?.status === 403 || e.response?.status === 404) return { data: [] };
    return Promise.reject(e);
  });
export const getNotificationsByProvider = (providerId) =>
  api.get(`/notifications/provider/${providerId}`).catch((e) => {
    if (e.response?.status === 403 || e.response?.status === 404) return { data: [] };
    return Promise.reject(e);
  });
