const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const getSessionStorage = () => {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
};

export const clearLegacyLocalAuthTokens = () => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore storage access errors from private mode or blocked storage.
  }
};

export const getStoredAccessToken = () => getSessionStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;

export const getStoredRefreshToken = () => getSessionStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;

export const setStoredAuthTokens = (accessToken: string, refreshToken?: string | null) => {
  clearLegacyLocalAuthTokens();

  const storage = getSessionStorage();
  if (!storage) return;

  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    storage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const setStoredAccessToken = (accessToken: string) => {
  clearLegacyLocalAuthTokens();
  getSessionStorage()?.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearStoredAuthTokens = () => {
  const storage = getSessionStorage();
  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
  clearLegacyLocalAuthTokens();
};
