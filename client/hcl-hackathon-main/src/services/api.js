import axios from "axios";
import { storageKeys } from "../data/mockData";
import { logError, logInfo } from "../utils/logger";

function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return import.meta.env.DEV ? "http://localhost:3000" : "";
}

const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(storageKeys.token);

    logInfo(`API request start: ${config.method?.toUpperCase()} ${config.url}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    logError("Failed to prepare API request", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    logInfo(`API response received: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    logError("API response error", error);
    return Promise.reject(error);
  }
);

export async function registerUser(payload) {
  try {
    logInfo("Submitting registration request", payload.email);

    const response = await apiClient.post("/api/v1/users/register", payload);

    return response.data;
  } catch (error) {
    logError("Registration failed", error);
    throw error.response?.data || error;
  }
}

export async function loginUser(payload) {
  try {
    logInfo("Submitting login request", payload.email);

    const response = await apiClient.post("/api/v1/users/login", payload);

    return response.data;
  } catch (error) {
    logError("Login failed", error);
    throw error.response?.data || error;
  }
}

export async function getDashboardData() {
  try {
    logInfo("Fetching dashboard data");

    const response = await apiClient.get("/api/dashboard");

    return response.data;
  } catch (error) {
    logError("Failed to fetch dashboard data", error);
    throw error.response?.data || error;
  }
}

export async function getGoals() {
  try {
    logInfo("Fetching goal history");

    const response = await apiClient.get("/api/goals");

    return response.data;
  } catch (error) {
    logError("Failed to fetch goals", error);
    throw error.response?.data || error;
  }
}

export async function createGoalEntry(payload) {
  try {
    logInfo("Saving goal entry", payload);

    const response = await apiClient.post("/api/goals", payload);

    return response.data;
  } catch (error) {
    logError("Failed to create goal entry", error);
    throw error.response?.data || error;
  }
}

export async function getProfile() {
  try {
    logInfo("Fetching profile");

    const response = await apiClient.get("/api/profile");

    return response.data;
  } catch (error) {
    logError("Failed to fetch profile", error);
    throw error.response?.data || error;
  }
}

export async function updateProfile(payload) {
  try {
    logInfo("Updating profile", payload);

    const response = await apiClient.put("/api/profile", payload);

    return response.data;
  } catch (error) {
    logError("Failed to update profile", error);
    throw error.response?.data || error;
  }
}

export async function getProviderPatients() {
  try {
    logInfo("Fetching provider patient list");

    const response = await apiClient.get("/api/provider/patients");

    return response.data;
  } catch (error) {
    logError("Failed to fetch assigned patients", error);
    throw error.response?.data || error;
  }
}

export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}