import api from "./axiosInstance";

export const getDashboardStats = () => api.get("/admin/dashboard");
export const getAdminReports = () => api.get("/admin/reports");
export const getAdminCustomers = () => api.get("/admin/customers");
export const getAdminProviders = () => api.get("/admin/providers");
export const getAdminBookings = () => api.get("/admin/bookings");
export const getAdminReviews = () => api.get("/admin/reviews");

// POST /admin/notifications/customers  { customerId, message, read }
export const sendNotificationToCustomers = (data) =>
  api.post("/admin/notifications/customers", { read: false, ...data });

// POST /admin/notifications/providers  { providerId, message, read }
export const sendNotificationToProviders = (data) =>
  api.post("/admin/notifications/providers", { read: false, ...data });
