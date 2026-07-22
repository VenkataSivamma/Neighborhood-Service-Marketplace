import api from "./axiosInstance";

export const getAllBookings = () => api.get("/bookings");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post("/bookings", data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const getBookingsByCustomer = (customerId) => api.get(`/bookings/customer/${customerId}`);
export const getBookingsByProvider = (providerId) => api.get(`/bookings/provider/${providerId}`);
export const acceptBooking = (id) => api.put(`/bookings/${id}/accept`);
export const rejectBooking = (id) => api.put(`/bookings/${id}/reject`);
export const inProgressBooking = (id) => api.put(`/bookings/${id}/in-progress`);
export const completeBooking = (id) => api.put(`/bookings/${id}/completed`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
