import axios from "axios";

const API_BASE_URL = "http://localhost:3001/spotify";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Wrapper for requests
const apiRequest = async <T>(method: string, endpoint: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.request<T>({ method, url: endpoint, data });
    return response.data;
  } catch (error: any) {
    console.error(`API error on ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

export default apiRequest;