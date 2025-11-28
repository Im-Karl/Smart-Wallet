import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (data) => apiClient.post("/auth/login", data);
export const registerUser = (data) => apiClient.post("/auth/register", data);

export const fetchBudgets = () => apiClient.get("/budgets");
export const createBudgetApi = (data) => apiClient.post("/budgets", data);

export const fetchCategoryStats = () => apiClient.get("/stats/categories");
export const fetchMonthlyFlow = () => apiClient.get("/stats/monthly-flow");