type ApiDebugPhase = "request" | "success" | "error";

type ApiDebugDetails = {
  body?: unknown;
  method: string;
  path: string;
  payload?: unknown;
  status?: number;
};

const redactedKeys = new Set([
  "accesstoken",
  "authorization",
  "password",
  "refreshtoken",
  "token",
]);

export function logApiAction(phase: ApiDebugPhase, details: ApiDebugDetails) {
  if (typeof window === "undefined") {
    return;
  }

  const { body, method, path, payload, status } = details;
  console.log(`[Portfolio API] ${phase}`, {
    body: sanitizeForLog(body),
    method,
    path,
    payload: sanitizeForLog(payload),
    status,
  });
}

function sanitizeForLog(value: unknown): unknown {
  if (value instanceof FormData) {
    return sanitizeRecord(Object.fromEntries(value.entries()));
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForLog(item));
  }

  if (value && typeof value === "object") {
    return sanitizeRecord(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      redactedKeys.has(key.toLowerCase()) ? "[redacted]" : sanitizeForLog(value),
    ]),
  );
}
