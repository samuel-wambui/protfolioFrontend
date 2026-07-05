"use client";

import { LoaderCircle, Menu, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/leadership-impact", label: "Leadership & Impact" },
  { href: "/skills", label: "Skills" },
  { href: "/education", label: "Education" },
  { href: "/certifications", label: "Certifications" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

type SiteNavigationProps = {
  fullName: string;
};

export function SiteNavigation({ fullName }: SiteNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pathname = usePathname();
  const displayName = fullName || "Profile";
  const nameParts = splitDisplayName(displayName);
  const initials = getInitials(displayName);
  const isRouteLoading = pendingHref !== null;

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  function handleNavigate(href: string, event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    if (!isActivePath(pathname, href)) {
      setPendingHref(href);
    }

    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/92 backdrop-blur-xl">
      {isRouteLoading ? (
        <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-blue-500/10" role="status">
          <span className="block h-full w-1/2 animate-pulse bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.75)]" />
        </div>
      ) : null}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link className="focus-ring group flex items-center gap-3 rounded-md" href="/" onClick={(event) => handleNavigate("/", event)}>
          <span className="grid h-8 w-8 place-items-center rounded-md border border-teal-300/40 bg-teal-300/10 text-xs font-bold text-teal-300">
            {initials}
          </span>
          <span className="hidden text-sm font-bold text-white sm:block">
            {nameParts.first} <span className="text-teal-300">{nameParts.rest}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => (
            <NavigationLink
              href={link.href}
              isActive={isActivePath(pathname, link.href)}
              key={link.href}
              onClick={(event) => handleNavigate(link.href, event)}
            >
              {link.label}
            </NavigationLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isRouteLoading ? (
            <span
              aria-label="Loading page"
              className="grid h-8 w-8 place-items-center rounded-md border border-blue-400/25 bg-blue-400/10 text-blue-200"
              role="status"
            >
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </span>
          ) : null}
          <Link
            className="focus-ring inline-flex min-h-8 items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-300 px-3 text-xs font-bold text-[#031017] transition hover:bg-teal-200"
            href="/contact"
            onClick={(event) => handleNavigate("/contact", event)}
          >
            <Send className="h-3.5 w-3.5" />
            Contact Me
          </Link>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          className="focus-ring inline-grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-white lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#030712] px-4 py-3 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <NavigationLink
                href={link.href}
                isActive={isActivePath(pathname, link.href)}
                key={link.href}
                onClick={(event) => handleNavigate(link.href, event)}
              >
                {link.label}
              </NavigationLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavigationLink({
  children,
  href,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  isActive: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      className={`focus-ring inline-flex min-h-8 items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold transition ${
        isActive ? "bg-white/8 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
      href={href}
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] transition ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
      {children}
    </Link>
  );
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function splitDisplayName(value: string): { first: string; rest: string } {
  const [first, ...rest] = value.split(" ").filter(Boolean);
  return {
    first: first || "Samuel",
    rest: rest.join(" ") || "Ngari",
  };
}

function getInitials(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
