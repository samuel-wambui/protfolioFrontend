import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { resolveProfile } from "@/data/portfolio-fallbacks";
import { getProfile } from "@/lib/portfolio-api";

export async function SiteFooter() {
  const profile = resolveProfile(await getProfile());

  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold text-white">{profile.fullName}</p>
          <p className="mt-1 text-sm text-slate-400">
            {profile.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            aria-label="GitHub"
            className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-electric-500/70 hover:text-white"
            href={profile.githubUrl}
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            aria-label="LinkedIn"
            className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-electric-500/70 hover:text-white"
            href={profile.linkedinUrl}
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            aria-label="Email"
            className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-electric-500/70 hover:text-white"
            href={`mailto:${profile.email}`}
          >
            <Mail className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
