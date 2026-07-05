import {
  BarChart3,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Goal,
  Layers3,
  Mail,
  MapPin,
  Network,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PortfolioAskPanel } from "@/components/portfolio-ask-panel";
import { resolveProfile } from "@/data/portfolio-fallbacks";
import { getExperience, getLeadershipImpact, getProfile, getProjects, getSkills } from "@/lib/portfolio-api";
import type { Experience, LeadershipImpact, Project, ResolvedProfile, Skill } from "@/types/portfolio";

export const metadata = {
  title: "About",
};

const projectVisuals = [
  { icon: Building2, accent: "text-teal-300", border: "border-teal-300/50", glow: "from-teal-300/14" },
  { icon: BrainCircuit, accent: "text-blue-400", border: "border-blue-400/50", glow: "from-blue-400/14" },
  { icon: Code2, accent: "text-violet-300", border: "border-violet-300/50", glow: "from-violet-300/14" },
  { icon: Workflow, accent: "text-amber-300", border: "border-amber-300/50", glow: "from-amber-300/14" },
  { icon: BarChart3, accent: "text-pink-300", border: "border-pink-300/50", glow: "from-pink-300/14" },
];

const principleIcons = [Goal, Cpu, ShieldCheck, UsersRound];

const skillCategoryStyles: Record<string, { icon: LucideIcon; badge: string; accent: string }> = {
  Languages: { icon: Code2, badge: "bg-teal-300/14 text-teal-200", accent: "text-teal-300" },
  Backend: { icon: Boxes, badge: "bg-blue-400/14 text-blue-200", accent: "text-blue-300" },
  Frontend: { icon: Layers3, badge: "bg-violet-400/14 text-violet-200", accent: "text-violet-300" },
  Databases: { icon: Database, badge: "bg-teal-300/14 text-teal-200", accent: "text-teal-300" },
  Database: { icon: Database, badge: "bg-teal-300/14 text-teal-200", accent: "text-teal-300" },
  "DevOps & Tools": { icon: GitBranch, badge: "bg-amber-300/14 text-amber-200", accent: "text-amber-300" },
  DevOps: { icon: GitBranch, badge: "bg-amber-300/14 text-amber-200", accent: "text-amber-300" },
  "AI & Data": { icon: Bot, badge: "bg-pink-300/14 text-pink-200", accent: "text-pink-300" },
  "Artificial Intelligence": { icon: Bot, badge: "bg-pink-300/14 text-pink-200", accent: "text-pink-300" },
  Workflow: { icon: Network, badge: "bg-blue-400/14 text-blue-200", accent: "text-blue-300" },
};

const skillCategoryOrder = [
  "Languages",
  "Backend",
  "Frontend",
  "Databases",
  "Database",
  "DevOps & Tools",
  "DevOps",
  "AI & Data",
  "Artificial Intelligence",
  "Workflow",
];

export default async function AboutPage() {
  const [profileResult, projectsResult, skills, experienceResult, leadershipImpact] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getExperience(),
    getLeadershipImpact(),
  ]);

  const profile = resolveProfile(profileResult);
  const projects = orderByDisplayOrder(projectsResult).slice(0, 5);
  const experience = orderJourneyByStartDate(experienceResult).slice(0, 3);
  const philosophy = firstByCategory(leadershipImpact, "Engineering Philosophy");
  const principles = byCategory(leadershipImpact, "Engineering Principle").slice(0, 4);
  const impactMetrics = byCategory(leadershipImpact, "Impact Metric").slice(0, 4);
  const groupedSkills = groupSkills(skills);
  const heroLines = splitTextLines(profile.heroText);
  const summaryParagraphs = splitTextLines(profile.summary);
  const quote = profile.currentlyFocusedOn[1] ?? profile.heroText;
  const closingLine = profile.currentlyFocusedOn[2] ?? profile.collaborationLabel;
  const closingTitle = profile.currentlyFocusedOn[3] ?? "Let's build something meaningful together.";

  return (
    <main className="relative isolate overflow-hidden border-b border-white/10 bg-[#030712] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_8%,rgba(20,184,166,0.16),transparent_28rem),radial-gradient(circle_at_82%_6%,rgba(59,130,246,0.12),transparent_30rem),linear-gradient(180deg,#030712_0%,#07111f_46%,#030712_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(45,212,191,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.045)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50"
      />

      <div className="mx-auto grid max-w-7xl gap-5">
        <section className="grid gap-8 py-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <SectionKicker icon={UserRound}>Who I Am</SectionKicker>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              {profile.fullName}
            </h1>
            <p className="mt-2 text-base font-semibold text-teal-200">{profile.title}</p>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-snug text-slate-100 sm:text-xl">
              {heroLines.map((line, index) => (
                <span className="block" key={`${line}-${index}`}>
                  {highlightPurpose(line)}
                </span>
              ))}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.roles.slice(0, 3).map((role) => (
                <span
                  className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-200"
                  key={role}
                >
                  {role}
                </span>
              ))}
            </div>

            <div className="mt-4 grid max-w-2xl gap-3 text-sm leading-6 text-slate-300">
              {summaryParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-5 max-w-3xl">
              <PortfolioAskPanel portfolioId={profile.portfolioId} profileName={profile.fullName} />
            </div>
          </div>

          <ProfileSignalCard profile={profile} quote={quote} />
        </section>

        {experience.length > 0 ? (
          <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#071321]/72 p-5">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(160deg,transparent_42%,rgba(20,184,166,0.1)_42.4%,transparent_43%),linear-gradient(150deg,transparent_48%,rgba(96,165,250,0.08)_48.4%,transparent_49%)] opacity-80"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 h-52 w-[52%] bg-[radial-gradient(circle_at_82%_56%,rgba(45,212,191,0.24),transparent_0.55rem),linear-gradient(145deg,transparent_54%,rgba(45,212,191,0.72)_54.4%,transparent_55%),linear-gradient(155deg,transparent_45%,rgba(59,130,246,0.16)_45.4%,transparent_46%)]"
            />
            <div className="relative">
              <SectionKicker icon={CheckCircle2}>Life Journey</SectionKicker>
              <div className="mt-5 grid max-w-4xl gap-5 border-l border-teal-300/45 pl-6">
                {experience.map((item) => (
                  <JourneyItem item={item} key={item.id} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {projects.length > 0 ? (
          <section className="rounded-lg border border-white/10 bg-[#071321]/72 p-5 shadow-2xl shadow-black/20">
            <SectionKicker icon={Boxes}>What I&apos;ve Built</SectionKicker>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {projects.map((project, index) => (
                <BuildCard index={index} key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-lg border border-white/10 bg-[#071321]/72 p-5">
            <SectionKicker icon={Sparkles}>My Engineering Philosophy</SectionKicker>
            {philosophy ? (
              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
                {splitTextLines(philosophy.description || philosophy.impact).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {principles.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {principles.map((principle, index) => (
                  <PrincipleCard index={index} item={principle} key={principle.id} />
                ))}
              </div>
            ) : null}
          </section>

          {impactMetrics.length > 0 ? (
            <section className="rounded-lg border border-white/10 bg-[#071321]/72 p-5">
              <SectionKicker icon={BarChart3}>Impact At A Glance</SectionKicker>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {impactMetrics.map((metric, index) => (
                  <ImpactMetricCard index={index} item={metric} key={metric.id} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {groupedSkills.length > 0 ? (
          <section className="rounded-lg border border-white/10 bg-[#071321]/72 p-5">
            <SectionKicker icon={Code2}>Technologies I Work With</SectionKicker>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {groupedSkills.map((group) => (
                <SkillGroup group={group} key={group.category} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 rounded-lg border border-white/10 bg-[#071321]/72 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-teal-300 text-[#031017]">
            <Send className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">{closingTitle}</h2>
            <p className="mt-1 text-sm text-slate-300">{closingLine}</p>
          </div>
          <a
            className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-300 px-5 text-sm font-bold text-[#031017] transition hover:bg-teal-200"
            href="/contact"
          >
            <Send className="h-4 w-4" />
            Let&apos;s Connect
          </a>
        </section>
      </div>
    </main>
  );
}

function ProfileSignalCard({ profile, quote }: { profile: ResolvedProfile; quote: string }) {
  const rows = [
    { icon: UserRound, label: "Role", value: profile.roles[0] ?? profile.title },
    { icon: MapPin, label: "Location", value: profile.location },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
    { icon: ShieldCheck, label: "Focus", value: profile.currentlyFocusedOn[0] ?? profile.learningLabel },
    { icon: CheckCircle2, label: "Availability", value: profile.collaborationLabel },
  ];

  return (
    <aside className="rounded-lg border border-white/10 bg-[#071321]/82 p-4 shadow-2xl shadow-black/20">
      <div className="grid gap-5 md:grid-cols-[0.9fr_1fr] md:items-center">
        <div className="grid gap-3 border-white/10 md:border-r md:pr-5">
          {rows.map((row) => {
            const Icon = row.icon;
            const value = (
              <span className="text-sm font-medium text-white transition group-hover:text-teal-100">{row.value}</span>
            );

            return (
              <div className="grid grid-cols-[1.4rem_1fr] gap-3" key={row.label}>
                <Icon className="mt-1 h-4 w-4 text-teal-300" />
                <div>
                  <p className="text-xs text-slate-500">{row.label}</p>
                  {row.href ? (
                    <a className="group" href={row.href}>
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-52 overflow-hidden rounded-lg border border-white/[0.06] bg-[#06111f] p-5">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(45,212,191,0.26)_1px,transparent_1.5px)] bg-[size:14px_14px] opacity-25"
          />
          <Code2 className="relative mx-auto h-14 w-14 text-teal-300/70" />
          <blockquote className="relative mt-6 text-base font-bold leading-snug text-white sm:text-lg">
            <span className="mr-2 text-3xl leading-none text-teal-300">&ldquo;</span>
            {quote}
            <span className="ml-2 text-3xl leading-none text-teal-300">&rdquo;</span>
          </blockquote>
        </div>
      </div>
    </aside>
  );
}

function BuildCard({ index, project }: { index: number; project: Project }) {
  const visual = projectVisuals[index % projectVisuals.length];
  const Icon = visual.icon;
  const bullets = project.results.length > 0 ? project.results : project.technologies;

  return (
    <article className={`min-h-64 rounded-lg border ${visual.border} bg-gradient-to-b ${visual.glow} to-[#071321] p-4`}>
      <Icon className={`h-9 w-9 ${visual.accent}`} />
      <h3 className="mt-5 text-sm font-bold text-white">{project.title}</h3>
      <ul className="mt-3 grid gap-1.5 text-xs leading-5 text-slate-300">
        {bullets.slice(0, 5).map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PrincipleCard({ index, item }: { index: number; item: LeadershipImpact }) {
  const Icon = principleIcons[index % principleIcons.length];

  return (
    <article className="border-r border-white/10 pr-3 last:border-r-0">
      <Icon className="mx-auto h-5 w-5 text-teal-300" />
      <p className="mt-3 text-center text-sm font-bold leading-5 text-white">{item.title}</p>
    </article>
  );
}

function ImpactMetricCard({ index, item }: { index: number; item: LeadershipImpact }) {
  const tones = ["text-teal-300", "text-blue-400", "text-violet-300", "text-amber-300"];

  return (
    <article className="rounded-lg border border-white/10 bg-[#06111f]/80 p-5 text-center">
      <p className={`text-3xl font-bold ${tones[index % tones.length]}`}>{item.metricValue}</p>
      <p className="mt-4 text-sm leading-6 text-white">{item.metricLabel || item.title}</p>
    </article>
  );
}

function JourneyItem({ item }: { item: Experience }) {
  return (
    <article className="relative">
      <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full border border-teal-200 bg-teal-300 shadow-[0_0_18px_rgba(45,212,191,0.8)]" />
      <p className="text-sm font-bold text-sky-400">{formatJourneyRange(item)}</p>
      <h3 className="mt-1 text-sm font-bold text-white">{item.company} - {item.role}</h3>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-300">{item.description}</p>
    </article>
  );
}

function SkillGroup({ group }: { group: SkillGroupData }) {
  const style = skillCategoryStyles[group.category] ?? {
    icon: Code2,
    badge: "bg-white/10 text-slate-200",
    accent: "text-slate-200",
  };
  const Icon = style.icon;

  return (
    <section className="border-white/10 xl:border-r xl:pr-4 xl:last:border-r-0">
      <span className={`inline-flex min-h-7 items-center gap-2 rounded-full px-3 text-xs font-bold ${style.badge}`}>
        <Icon className={`h-3.5 w-3.5 ${style.accent}`} />
        {group.category}
      </span>
      <ul className="mt-3 grid gap-1 text-sm text-slate-300">
        {group.items.map((skill) => (
          <li className="flex gap-2" key={skill.id}>
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span>{skill.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionKicker({ children, icon: Icon }: { children: React.ReactNode; icon: LucideIcon }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-teal-300">
      <Icon className="h-4 w-4" />
      {children}
    </p>
  );
}

function highlightPurpose(text: string) {
  const target = "purpose";
  const lower = text.toLowerCase();
  const start = lower.indexOf(target);

  if (start === -1) {
    return text;
  }

  const end = start + target.length;
  return (
    <>
      {text.slice(0, start)}
      <span className="text-blue-400">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  );
}

function splitTextLines(value: string): string[] {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatJourneyRange(item: Experience): string {
  const start = formatJourneyDate(item.startDate);
  const end = item.current ? "Present" : formatJourneyDate(item.endDate);
  return end ? `${start} - ${end}` : start;
}

function formatJourneyDate(value?: string | null): string {
  const normalized = value?.trim();
  if (!normalized) return "";

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function orderByDisplayOrder<T extends { displayOrder?: number | null; id: number }>(items: T[]): T[] {
  return [...items].sort((first, second) => {
    const firstOrder = first.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = second.displayOrder ?? Number.MAX_SAFE_INTEGER;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return first.id - second.id;
  });
}

function orderJourneyByStartDate(items: Experience[]): Experience[] {
  return [...items].sort((first, second) => {
    const dateDifference = dateSortValue(first.startDate) - dateSortValue(second.startDate);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return first.id - second.id;
  });
}

function dateSortValue(value?: string | null): number {
  const normalized = value?.trim();
  if (!normalized) return Number.MAX_SAFE_INTEGER;

  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function byCategory(items: LeadershipImpact[], category: string): LeadershipImpact[] {
  return items.filter((item) => item.category.trim().toLowerCase() === category.toLowerCase());
}

function firstByCategory(items: LeadershipImpact[], category: string): LeadershipImpact | undefined {
  return byCategory(items, category)[0];
}

type SkillGroupData = {
  category: string;
  items: Skill[];
};

function groupSkills(skills: Skill[]): SkillGroupData[] {
  const groups = new Map<string, Skill[]>();

  skills.forEach((skill) => {
    const category = skill.category.trim();
    if (!category) return;
    groups.set(category, [...(groups.get(category) ?? []), skill]);
  });

  return [...groups.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((first, second) => skillCategorySortValue(first.category) - skillCategorySortValue(second.category));
}

function skillCategorySortValue(category: string): number {
  const index = skillCategoryOrder.findIndex((item) => item.toLowerCase() === category.toLowerCase());
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
