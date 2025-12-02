import axios from "axios";

const API_URL = "https://smart-wallet-backend-4ttg.onrender.com/api";

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

export const fetchBudgets = ({ skip, limit }) =>
  apiClient.get("/budgets", { params: { skip, limit } });
export const fetchBudgetDetail = (budgetId) =>
  apiClient.get(`/budgets/${budgetId}`);
export const createBudgetApi = (data) => apiClient.post("/budgets", data);

export const fetchCategoryStats = () => apiClient.get("/stats/categories");
export const fetchMonthlyFlow = () => apiClient.get("/stats/monthly-flow");

export const fetchHistoryRecords = ({ budgetId, skip = 0, limit = 20 }) => {
  return apiClient.get(`/budgets/${budgetId}/history`, {
    params: { skip, limit },
  });
};

export const fetchDailyRecords = ({ budgetId, skip = 0, limit = 20 }) => {
  return apiClient.get(`/budgets/${budgetId}/history`, {
    params: { skip, limit },
  });
};
