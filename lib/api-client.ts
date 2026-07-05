import { logApiAction } from "@/lib/api-debug";
import { clearStoredAuthTokens, getStoredAccessToken } from "@/lib/auth-session";
import type { ApiResponse } from "@/types/portfolio";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: unknown;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  // Local backend:
  // "http://localhost:8080/api";
  "https://portfoliobackend-ltak.onrender.com/api";

export const AUTH_SESSION_EXPIRED_EVENT = "portfolio-auth-session-expired";

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, body, headers: initialHeaders, ...requestOptions } = options;
  const method = (requestOptions.method ?? "GET").toUpperCase();
  const headers = new Headers(initialHeaders);

  headers.set("Accept", "application/json");
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  logApiAction("request", { body, method, path });
  let responseErrorLogged = false;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });

    const payload = await readPayload<T>(response);

    if (response.status === 401) {
      clearStoredAuthTokens();
      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
    }

    if (!response.ok) {
      logApiAction("error", { body, method, path, payload, status: response.status });
      responseErrorLogged = true;
      const message = isApiResponse(payload) ? payload.message : "Request failed";
      throw new Error(message);
    }

    const data = isApiResponse(payload) ? payload.data : payload;
    logApiAction("success", { method, path, payload: data, status: response.status });
    return data;
  } catch (error) {
    if (!responseErrorLogged && error instanceof Error) {
      logApiAction("error", { method, path, payload: error.message });
    }

    throw error;
  }
}

async function readPayload<T>(response: Response): Promise<ApiResponse<T> | T> {
  const text = await response.text();
  if (!text) return null as T;

  try {
    return JSON.parse(text) as ApiResponse<T> | T;
  } catch {
    return text as T;
  }
}

function isApiResponse<T>(payload: ApiResponse<T> | T): payload is ApiResponse<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    "code" in payload &&
    "data" in payload
  );
}
