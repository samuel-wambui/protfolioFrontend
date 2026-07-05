import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Code2,
  Download,
  Mail,
  Rocket,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProfilePhotoCard } from "@/components/profile-photo-card";
import { resolveProfile } from "@/data/portfolio-fallbacks";
import { getProfile, getProjects, getSkills } from "@/lib/portfolio-api";
import { getOrderedSkillNames } from "@/lib/skill-stack";
import type { Project, ResolvedProfile } from "@/types/portfolio";

const projectIconVariants = [
  { icon: Bot, tone: "text-emerald-300", background: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { icon: Zap, tone: "text-amber-300", background: "bg-amber-400/10", border: "border-amber-400/20" },
  { icon: Workflow, tone: "text-violet-300", background: "bg-violet-400/10", border: "border-violet-400/20" },
  { icon: Rocket, tone: "text-teal-300", background: "bg-teal-400/10", border: "border-teal-400/20" },
];

export default async function HomePage() {
  const [profileResult, projectResult, skillResult] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ]);
  const profile = resolveProfile(profileResult);
  const projects = orderProjects(projectResult).slice(0, 4);
  const techStack = getOrderedSkillNames(skillResult, 12);
  const stats = getStats(profile, projectResult.length, skillResult.length);

  return (
    <main className="relative isolate overflow-hidden px-4 pb-10 pt-5 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[#030712]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/images/portfolio-hero.png')] bg-cover bg-center opacity-20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#030712_0%,rgba(3,7,18,0.82)_42%,rgba(3,7,18,0.96)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-0 top-12 -z-10 h-[480px] w-[42rem] bg-[radial-gradient(circle_at_left,rgba(20,184,166,0.18),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-1/2 bg-[linear-gradient(rgba(20,184,166,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30"
      />

      <section className="mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl grid-rows-[1fr_auto] gap-6">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex min-h-7 w-fit items-center gap-2 rounded-md border border-teal-400/20 bg-teal-400/10 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              {profile.title}
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-none text-white sm:text-5xl lg:text-5xl">
              {profile.fullName}
            </h1>

            <p className="mt-4 max-w-3xl text-lg font-bold leading-tight text-slate-100 sm:text-xl lg:text-2xl">
              {highlightHero(profile.heroText)}
            </p>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {profile.summary}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <HeroButton href="/projects" icon={ArrowRight} variant="primary">
                View Projects
              </HeroButton>
              <HeroButton external href={profile.cvUrl || "#"} icon={Download} variant="secondary">
                Download CV
              </HeroButton>
              <HeroButton href="/contact" icon={Mail} variant="ghost">
                Contact Me
              </HeroButton>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <HeroStat key={stat.label} {...stat} />
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Technologies I Work With</p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((technology) => (
                  <span
                    className="inline-flex min-h-7 items-center rounded-md border border-white/10 bg-white/[0.04] px-2.5 text-[11px] font-semibold text-slate-200"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[490px] justify-self-center lg:justify-self-end">
            <ProfilePhotoCard profile={profile} />
          </div>
        </div>

        <section className="rounded-lg border border-white/10 bg-[#07111f]/88 p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-white">Featured Projects</h2>
            <a className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 transition hover:text-white" href="/projects">
              View all projects <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectMiniCard index={index} key={project.id} project={project} />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400 md:col-span-2 xl:col-span-4">
                No featured projects have been saved yet.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function highlightHero(text: string) {
  return splitHeroText(text).map((part) => {
    if (part.kind === "ai") {
      return (
        <span className="text-teal-300" key={part.value}>
          {part.value}
        </span>
      );
    }

    if (part.kind === "africa") {
      return (
        <span className="text-violet-300" key={part.value}>
          {part.value}
        </span>
      );
    }

    return part.value;
  });
}

function splitHeroText(text: string): Array<{ kind: "plain" | "ai" | "africa"; value: string }> {
  const targets = [
    { kind: "ai" as const, value: "AI-powered systems" },
    { kind: "africa" as const, value: "Africa's digital transformation" },
  ];

  return targets.reduce<Array<{ kind: "plain" | "ai" | "africa"; value: string }>>(
    (parts, target) =>
      parts.flatMap((part) => {
        if (part.kind !== "plain" || !part.value.includes(target.value)) {
          return [part];
        }

        const [before, after] = part.value.split(target.value);
        return [
          before ? { kind: "plain", value: before } : null,
          { kind: target.kind, value: target.value },
          after ? { kind: "plain", value: after } : null,
        ].filter(Boolean) as Array<{ kind: "plain" | "ai" | "africa"; value: string }>;
      }),
    [{ kind: "plain", value: text }],
  );
}

function getStats(profile: ResolvedProfile, projectCount: number, technologyCount: number) {
  const primaryFocus = profile.currentlyFocusedOn[0] ?? profile.learningLabel;
  const primaryRoles = profile.roles.slice(0, 2).join(" / ");

  return [
    {
      icon: Workflow,
      label: "Focus Areas",
      note: primaryRoles || profile.collaborationLabel,
      value: `${profile.roles.length}`,
    },
    {
      icon: Code2,
      label: "Featured Projects",
      note: `${profile.projectsCompleted}+ total completed`,
      value: `${projectCount}`,
    },
    {
      icon: Rocket,
      label: "Years Experience",
      note: primaryFocus,
      value: `${profile.yearsExperience}+`,
    },
    {
      icon: BrainCircuit,
      label: "Skills Listed",
      note: "Advanced / Strong / Growing",
      value: `${technologyCount}`,
    },
  ];
}

function HeroButton({
  children,
  external = false,
  href,
  icon: Icon,
  variant,
}: {
  children: React.ReactNode;
  external?: boolean;
  href: string;
  icon: LucideIcon;
  variant: "primary" | "secondary" | "ghost";
}) {
  const classes = {
    primary: "border-teal-300 bg-teal-300 text-[#031017] hover:bg-teal-200",
    secondary: "border-white/12 bg-white/[0.04] text-white hover:border-teal-300/70 hover:text-teal-200",
    ghost: "border-white/12 bg-transparent text-slate-200 hover:border-white/30 hover:text-white",
  };
  const className = `focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 text-xs font-bold transition ${classes[variant]}`;

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        <span>{children}</span>
        <Icon className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <a className={className} href={href}>
      <span>{children}</span>
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}

function HeroStat({
  icon: Icon,
  label,
  note,
  value,
}: {
  icon: LucideIcon;
  label: string;
  note: string;
  value: string;
}) {
  return (
    <article className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-lg border border-white/10 bg-[#06111f]/82 p-3">
      <span className="grid h-9 w-9 place-items-center rounded-md border border-teal-300/20 bg-teal-300/10 text-teal-300">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-base font-bold leading-none text-teal-200">{value}</p>
        <p className="mt-1 text-[11px] font-bold text-white">{label}</p>
        <p className="mt-0.5 text-[10px] text-slate-500">{note}</p>
      </div>
    </article>
  );
}

function ProjectMiniCard({ index, project }: { index: number; project: Project }) {
  const variant = projectIconVariants[index % projectIconVariants.length];
  const Icon = variant.icon;

  return (
    <a
      className={`group rounded-lg border ${variant.border} ${variant.background} p-3 transition hover:-translate-y-0.5 hover:border-teal-300/70 hover:bg-white/[0.06]`}
      href={`/projects/${project.id}`}
    >
      <div className="mb-3 flex items-start gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border ${variant.border} bg-black/18 ${variant.tone}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-400">{project.problem}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 4).map((technology) => (
          <span className="rounded-sm bg-black/22 px-2 py-1 text-[10px] font-semibold text-slate-300" key={technology}>
            {technology}
          </span>
        ))}
      </div>

      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 transition group-hover:text-white">
        View Project <ArrowRight className="h-3 w-3" />
      </span>
    </a>
  );
}

function orderProjects(projects: Project[]): Project[] {
  return [...projects].sort((first, second) => {
    const firstOrder = first.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = second.displayOrder ?? Number.MAX_SAFE_INTEGER;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return first.id - second.id;
  });
}
