export type AnalyticsEventType = "page_view" | "click" | "download" | "contact_submit";

export type AnalyticsEventPayload = {
  browser?: string | null;
  deviceType?: string | null;
  eventType: AnalyticsEventType;
  language?: string | null;
  os?: string | null;
  pageTitle?: string | null;
  pageUrl?: string | null;
  path?: string | null;
  referrer?: string | null;
  screenSize?: string | null;
  targetLabel?: string | null;
  targetUrl?: string | null;
  timezone?: string | null;
  utmCampaign?: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
  visitorId?: string | null;
};

export type AnalyticsEvent = AnalyticsEventPayload & {
  city?: string | null;
  country?: string | null;
  createdAt: string;
  id: number;
  ipAddress?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  region?: string | null;
  userAgent?: string | null;
};
