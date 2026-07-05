import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
};

const variants = {
  primary:
    "bg-electric-500 text-white shadow-glow hover:bg-electric-600 border-transparent",
  secondary:
    "border-slate-600/70 bg-slate-900/72 text-white hover:border-electric-500/80 hover:text-white",
  ghost:
    "border-transparent bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
};

export function ButtonLink({
  href,
  children,
  icon: Icon,
  variant = "primary",
  external = false,
}: ButtonLinkProps) {
  const className = `focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition ${variants[variant]}`;

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
      <span>{children}</span>
    </Link>
  );
}
