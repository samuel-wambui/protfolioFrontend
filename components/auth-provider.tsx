"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_SESSION_EXPIRED_EVENT, apiFetch } from "@/lib/api-client";
import {
  decodeJwtPayload,
  extractRolesFromPayload,
  getJwtExpirationMs,
  getJwtSubject,
  isJwtExpired,
  normalizeRoleValues,
} from "@/lib/auth-token";
import {
  clearLegacyLocalAuthTokens,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  setStoredAuthTokens,
} from "@/lib/auth-session";
import type { AuthUser, LoginResponse, LoginResult } from "@/types/auth";

type AuthContextType = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUserAndToken: (token: string, user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const TOKEN_REFRESH_BUFFER_MS = 15 * 1000;

const toAuthUser = (source: LoginResponse, token?: string | null): AuthUser => {
  const tokenPayload = decodeJwtPayload(token);
  const firstName = source.firstName ?? source.firstname ?? undefined;
  const lastName = source.lastName ?? source.lastname ?? undefined;
  const roles = normalizeRoleValues(
    source.roles,
    source.role,
    source.authorities,
    source.authority,
    extractRolesFromPayload(tokenPayload),
  );

  return {
    id: source.username,
    username: source.username,
    firstName,
    lastName,
    email: source.email,
    name: firstName && lastName ? `${firstName} ${lastName}` : source.username,
    roles,
    loggedIn: source.loggedIn,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    clearLegacyLocalAuthTokens();
    return getStoredAccessToken();
  });
  const [loading, setLoading] = useState(true);
  const expiredSessionHandledRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const clearSession = useCallback(() => {
    clearStoredAuthTokens();
    setAccessToken(null);
    setUser(null);
  }, []);

  const handleExpiredSession = useCallback(() => {
    if (expiredSessionHandledRef.current) return;
    expiredSessionHandledRef.current = true;
    clearSession();
    if (pathname.startsWith("/admin")) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [clearSession, pathname, router]);

  const setAuthenticatedSession = useCallback(
    (token: string, refreshToken: string | null | undefined, source: LoginResponse) => {
      expiredSessionHandledRef.current = false;
      setStoredAuthTokens(token, refreshToken);
      setAccessToken(token);
      setUser(toAuthUser(source, token));
    },
    [],
  );

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken || isJwtExpired(refreshToken)) {
      handleExpiredSession();
      return false;
    }

    try {
      const data = await apiFetch<LoginResponse>("/auth/refresh", {
        method: "POST",
        auth: false,
        body: { refreshToken },
      });
      const entity = data.entity ?? data;

      if (!entity.accessToken) {
        throw new Error("No accessToken returned from refresh");
      }

      setAuthenticatedSession(entity.accessToken, entity.refreshToken ?? refreshToken, entity.user ?? entity);
      return true;
    } catch {
      handleExpiredSession();
      return false;
    }
  }, [handleExpiredSession, setAuthenticatedSession]);

  const refreshUser = useCallback(async () => {
    const token = getStoredAccessToken();
    const username = getJwtSubject(token);

    if (!token || !username) {
      clearSession();
      return;
    }

    if (isJwtExpired(token)) {
      await refreshAccessToken();
      return;
    }

    expiredSessionHandledRef.current = false;
    setAccessToken(token);
    setUser(
      toAuthUser(
        {
          accessToken: token,
          username,
          loggedIn: true,
          roles: extractRolesFromPayload(decodeJwtPayload(token)),
        },
        token,
      ),
    );
  }, [clearSession, refreshAccessToken]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      await refreshUser();
      if (mounted) {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      setLoading(true);
      try {
        const data = await apiFetch<LoginResponse>("/auth/login", {
          method: "POST",
          auth: false,
          body: { username, password },
        });
        const entity = data.entity ?? data;

        if (entity.passwordChangeRequired) {
          clearSession();
          return { passwordChangeRequired: true };
        }

        if (!entity.accessToken) {
          throw new Error("No accessToken returned from server");
        }

        setAuthenticatedSession(entity.accessToken, entity.refreshToken, entity.user ?? entity);
        return { passwordChangeRequired: false };
      } finally {
        setLoading(false);
      }
    },
    [clearSession, setAuthenticatedSession],
  );

  const signOut = useCallback(async () => {
    const username = user?.username ?? getJwtSubject(accessToken);
    try {
      if (username) {
        await apiFetch<null>(`/auth/logout/${encodeURIComponent(username)}`, {
          method: "POST",
        });
      }
    } finally {
      clearSession();
      router.push("/auth");
    }
  }, [accessToken, clearSession, router, user?.username]);

  const setUserAndToken = useCallback((token: string, nextUser: AuthUser) => {
    expiredSessionHandledRef.current = false;
    setStoredAccessToken(token);
    setAccessToken(token);
    setUser({
      ...nextUser,
      roles:
        nextUser.roles.length > 0
          ? nextUser.roles
          : extractRolesFromPayload(decodeJwtPayload(token)),
    });
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      handleExpiredSession();
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
  }, [handleExpiredSession]);

  useEffect(() => {
    if (!accessToken) return;

    const expirationMs = getJwtExpirationMs(accessToken);
    if (expirationMs === null) return;

    const hasRefreshToken = Boolean(getStoredRefreshToken());
    const delay = Math.max(
      expirationMs - Date.now() - (hasRefreshToken ? TOKEN_REFRESH_BUFFER_MS : 0),
      0,
    );

    const timeout = window.setTimeout(() => {
      if (hasRefreshToken) {
        refreshAccessToken();
        return;
      }

      handleExpiredSession();
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [accessToken, handleExpiredSession, refreshAccessToken]);

  useEffect(() => {
    if (!accessToken || !user?.username) return;

    let timeout: number | undefined;
    const resetInactivityTimer = () => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        clearSession();
        router.push("/auth");
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((eventName) =>
      window.addEventListener(eventName, resetInactivityTimer, { passive: true }),
    );
    resetInactivityTimer();

    return () => {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
      events.forEach((eventName) => window.removeEventListener(eventName, resetInactivityTimer));
    };
  }, [accessToken, clearSession, router, user?.username]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, signOut, refreshUser, setUserAndToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
