import axios from "axios";
import type { Appointment, Feedback, ChatResponse, User } from "./types";

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  baseURL: "https://healthyai-dev-api-app.azurewebsites.net/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/auth/login", data),
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post<{ token: string; user: User }>("/auth/register", data),
};

export const appointmentAPI = {
  getUserAppointments: () => api.get<Appointment[]>("/appointments/user"),
  getAllAppointments: () => api.get<Appointment[]>("/appointments"),
  book: (data: Partial<Appointment>) =>
    api.post<Appointment>("/appointments", data),
  updateStatus: (id: string, status: "approved" | "rejected") =>
    api.patch<Appointment>(`/appointments/${id}`, { status }),
};

export const feedbackAPI = {
  submit: (data: { rating: number; comment?: string }) =>
    api.post<Feedback>("/feedback", data),
  getAll: () => api.get<Feedback[]>("/feedback"),
};

export const chatAPI = {
  send: (message: string) => api.post<ChatResponse>("/chat", { message }),
};
