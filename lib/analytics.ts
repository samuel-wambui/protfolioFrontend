"use client";

import type { AnalyticsEventPayload, AnalyticsEventType } from "@/types/analytics";

const ANALYTICS_ENDPOINT = "/api/analytics/events";
const VISITOR_ID_KEY = "portfolio_visitor_id";

type TrackAnalyticsInput = Partial<AnalyticsEventPayload> & {
  eventType: AnalyticsEventType;
};

export function trackAnalyticsEvent(input: TrackAnalyticsInput) {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  if (navigator.doNotTrack === "1") {
    return;
  }

  const payload = buildAnalyticsPayload(input);
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    body,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
    method: "POST",
  }).catch(() => {
    // Analytics should never interrupt the portfolio experience.
  });
}

function buildAnalyticsPayload(input: TrackAnalyticsInput): AnalyticsEventPayload {
  const url = new URL(window.location.href);

  return {
    browser: detectBrowser(),
    deviceType: detectDeviceType(),
    eventType: input.eventType,
    language: navigator.language || null,
    os: detectOs(),
    pageTitle: document.title || null,
    pageUrl: window.location.href,
    path: `${url.pathname}${url.search}`,
    referrer: document.referrer || null,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    targetLabel: input.targetLabel ?? null,
    targetUrl: input.targetUrl ?? null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    utmCampaign: url.searchParams.get("utm_campaign"),
    utmMedium: url.searchParams.get("utm_medium"),
    utmSource: url.searchParams.get("utm_source") ?? url.searchParams.get("ref"),
    visitorId: getVisitorId(),
  };
}

function getVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) {
      return existing;
    }

    const nextId = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(VISITOR_ID_KEY, nextId);
    return nextId;
  } catch {
    return "storage-unavailable";
  }
}

function detectDeviceType(): string {
  const userAgent = navigator.userAgent;
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobi|android|iphone|ipod/i.test(userAgent)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  const userAgent = navigator.userAgent;
  if (/edg/i.test(userAgent)) return "Edge";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/chrome|chromium|crios/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Unknown";
}

function detectOs(): string {
  const userAgent = navigator.userAgent;
  if (/windows/i.test(userAgent)) return "Windows";
  if (/mac os|macintosh/i.test(userAgent)) return "macOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}
