import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach Bearer token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

export default axiosInstance;
