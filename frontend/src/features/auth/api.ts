import { api } from "@/src/shared/api/client";
import { useAuthStore, type SessionUser } from "@/src/features/auth/store";
import { setRememberMode } from "@/src/features/auth/store";

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export async function login(
  email: string,
  password: string,
  remember = true,
): Promise<SessionUser> {
  setRememberMode(remember);
  const tokens = await api.post<TokenPair>("/auth/login", { email, password });
  useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
  const me = await api.get<SessionUser>("/auth/me");
  useAuthStore.getState().setUser(me);
  return me;
}

export async function tokenLogin(
  tokenNo: string,
  pin: string,
  remember = true,
): Promise<SessionUser> {
  setRememberMode(remember);
  const tokens = await api.post<TokenPair>("/auth/token-login", {
    token_no: tokenNo,
    pin,
  });
  useAuthStore.getState().setTokens(tokens.access_token, tokens.refresh_token);
  const me = await api.get<SessionUser>("/auth/me");
  useAuthStore.getState().setUser(me);
  return me;
}

export async function logout(): Promise<void> {
  const { refreshToken, clearSession } = useAuthStore.getState();
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refresh_token: refreshToken });
    } catch {
      /* best-effort */
    }
  }
  clearSession();
}
