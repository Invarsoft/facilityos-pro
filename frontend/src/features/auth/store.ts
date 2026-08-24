import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export interface SessionUser {
  id: string;
  org_id: string | null;
  email: string;
  full_name: string;
  role: "requester" | "worker" | "manager" | "admin" | "super_admin";
  skills?: string[];
}

/**
 * "Remember session" is real:
 *  - remembered  → session persists in localStorage (survives browser restart, 7-day refresh)
 *  - not remembered → session lives in sessionStorage only (cleared when browser closes)
 */
let rememberSession = true;

export function setRememberMode(remember: boolean) {
  rememberSession = remember;
}

const sessionAwareStorage: StateStorage = {
  getItem: (name) =>
    sessionStorage.getItem(name) ?? localStorage.getItem(name),
  setItem: (name, value) => {
    if (rememberSession) {
      localStorage.setItem(name, value);
    } else {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
    localStorage.removeItem(name);
  },
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: SessionUser | null) => void;
  clearSession: () => void;
}

/**
 * Client-only session state (tokens + profile).
 * Server data lives in TanStack Query — never duplicated here.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearSession: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "facilityos-session",
      storage: createJSONStorage(() => sessionAwareStorage),
    },
  ),
);
