import api from "./axiosInstance";

export const getAllReviews = () => api.get("/reviews");
export const getReviewById = (id) => api.get(`/reviews/${id}`);
export const createReview = (data) => api.post("/reviews", data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const getReviewsByProvider = (providerId) => api.get(`/reviews/provider/${providerId}`);
export const getReviewsByCustomer = (customerId) => api.get(`/reviews/customer/${customerId}`);
