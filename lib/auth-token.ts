export interface JwtPayload {
  sub?: unknown;
  exp?: unknown;
  role?: unknown;
  roles?: unknown;
  authority?: unknown;
  authorities?: unknown;
  [key: string]: unknown;
}

export const decodeJwtPayload = (token: string | null | undefined): JwtPayload | null => {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${("00" + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

const collectRoleValues = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(collectRoleValues);
  }

  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return collectRoleValues(record.name ?? record.role ?? record.authority ?? record.roleName);
  }

  return [];
};

export const normalizeRoleValues = (...values: unknown[]): string[] => {
  const seen = new Set<string>();

  for (const value of values) {
    for (const role of collectRoleValues(value)) {
      if (!seen.has(role)) seen.add(role);
    }
  }

  return Array.from(seen);
};

export const extractRolesFromPayload = (
  payload: JwtPayload | Record<string, unknown> | null | undefined,
): string[] => {
  if (!payload) return [];

  return normalizeRoleValues(payload.role, payload.roles, payload.authority, payload.authorities);
};

export const getJwtSubject = (token: string | null | undefined): string | undefined => {
  const payload = decodeJwtPayload(token);
  return typeof payload?.sub === "string" ? payload.sub : undefined;
};

export const getJwtExpirationMs = (token: string | null | undefined): number | null => {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
};

export const isJwtExpired = (token: string | null | undefined, leewayMs = 0) => {
  const expirationMs = getJwtExpirationMs(token);
  return expirationMs !== null && Date.now() + leewayMs >= expirationMs;
};
