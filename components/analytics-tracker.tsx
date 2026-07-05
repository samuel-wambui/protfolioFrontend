"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const trackedPageRef = useRef<string | null>(null);

  useEffect(() => {
    if (isExcludedPath(pathname)) {
      return;
    }

    const currentPage = `${pathname}?${queryString}`;
    if (trackedPageRef.current === currentPage) {
      return;
    }

    trackedPageRef.current = currentPage;
    trackAnalyticsEvent({ eventType: "page_view" });
  }, [pathname, queryString]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (isExcludedPath(window.location.pathname) || !(event.target instanceof Element)) {
        return;
      }

      const target = event.target.closest("a,button");
      if (!target || target.closest("[data-analytics-ignore='true']")) {
        return;
      }

      if (target instanceof HTMLAnchorElement) {
        const href = target.href || target.getAttribute("href") || "";
        const eventType = isDownloadLink(target, href) ? "download" : "click";

        trackAnalyticsEvent({
          eventType,
          targetLabel: getTargetLabel(target),
          targetUrl: href,
        });
        return;
      }

      if (target instanceof HTMLButtonElement) {
        trackAnalyticsEvent({
          eventType: "click",
          targetLabel: getTargetLabel(target),
          targetUrl: target.form?.action || null,
        });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}

function isExcludedPath(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/auth");
}

function isDownloadLink(anchor: HTMLAnchorElement, href: string): boolean {
  const value = href.toLowerCase();
  return anchor.hasAttribute("download") || value.includes("cv") || value.includes("resume") || value.endsWith(".pdf");
}

function getTargetLabel(element: Element): string {
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const title = element.getAttribute("title");
  if (title) return title;

  return element.textContent?.replace(/\s+/g, " ").trim().slice(0, 140) || element.tagName.toLowerCase();
}
