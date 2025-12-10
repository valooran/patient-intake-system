import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "../lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (userData: { token: string; user: User }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        login: (userData) => {
          const { token, user } = userData;
          localStorage.setItem("token", token);
          set({ user, token });
        },
        logout: () => {
          localStorage.removeItem("token");
          set({ user: null, token: null });
        },
      }),
      { name: "auth-store" }
    )
  )
);
