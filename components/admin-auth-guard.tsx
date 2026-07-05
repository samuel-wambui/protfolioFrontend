"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = Boolean(user?.roles.some((role) => role === "ADMIN" || role === "SUPERUSER"));

  useEffect(() => {
    if (!loading && (!accessToken || !isAdmin)) {
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, isAdmin, loading, pathname, router]);

  if (loading || !accessToken || !isAdmin) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4">
        <div className="surface grid max-w-md gap-4 rounded-lg p-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-electric-500/12 text-electric-500">
            {loading ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Checking admin access</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Please sign in with an admin account to manage portfolio content.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
