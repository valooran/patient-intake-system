export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Appointment {
  _id: string;
  userId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  doctor: string;
  time: string;
  hospital: string;
  status: "pending" | "approved" | "rejected";
  diseaseConclusion?: string;
  severity?: string;
  medications?: string[];
  createdAt?: string;
  __v?: number;
}

export interface Feedback {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export interface ChatResponse {
  reply: string;
  isConclusion: boolean;
  disease?: string;
  severity?: string;
  medications?: string[];
  hospitals?: string[];
}

export interface AIConclusion {
  disease: string;
  severity: string;
  medications: string[];
  hospitals: string[];
}
