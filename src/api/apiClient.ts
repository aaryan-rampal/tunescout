import axios from "axios";

// const API_BASE_URL = "http://localhost:3001/spotify";
const API_BASE_URL = "http://127.0.0.1:8000/spotify";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Wrapper for requests
const apiRequest = async <T>(
  method: "GET" | "POST",
  endpoint: string,
  body: any = {},
  accessToken?: string,
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: method === "POST" ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
  return res.json();
};

export default apiRequest;
