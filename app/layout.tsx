import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { AuthProvider } from "@/components/auth-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "SamuelNgari",
    template: "%s | SamuelNgari",
  },
  description:
    "A full-stack developer portfolio built with Next.js, TypeScript, Tailwind CSS, Spring Boot, PostgreSQL, Docker, and GitHub Actions.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <AuthProvider>{children}</AuthProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
