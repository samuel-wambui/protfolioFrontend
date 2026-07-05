import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Quote,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { resolveProfile } from "@/data/portfolio-fallbacks";
import { getExperience, getLeadershipImpact, getProfile, getProjects, getSkills } from "@/lib/portfolio-api";
import type { Experience, LeadershipImpact, Project, ResolvedProfile, Skill } from "@/types/portfolio";

export const metadata = {
  title: "Experience",
};

const statVisuals = [
  { icon: CalendarDays, tone: "text-teal-300", background: "bg-teal-300/10" },
  { icon: Code2, tone: "text-blue-400", background: "bg-blue-400/10" },
  { icon: Sparkles, tone: "text-violet-300", background: "bg-violet-400/10" },
  { icon: BarChart3, tone: "text-amber-300", background: "bg-amber-300/10" },
  { icon: UsersRound, tone: "text-teal-300", background: "bg-teal-300/10" },
];

const projectIcons = [BriefcaseBusiness, Code2, GitBranch, Bot, Database];

const skillStyles: Record<string, { icon: LucideIcon; accent: string }> = {
  Backend: { icon: Code2, accent: "text-teal-300" },
  Frontend: { icon: Layers3, accent: "text-blue-400" },
  Databases: { icon: Database, accent: "text-teal-300" },
  Database: { icon: Database, accent: "text-teal-300" },
  "DevOps & Tools": { icon: GitBranch, accent: "text-amber-300" },
  DevOps: { icon: GitBranch, accent: "text-amber-300" },
  "AI & Data": { icon: Bot, accent: "text-violet-300" },
  "Artificial Intelligence": { icon: Bot, accent: "text-violet-300" },
};

const skillOrder = ["Backend", "Frontend", "Databases", "Database", "DevOps & Tools", "DevOps", "AI & Data", "Artificial Intelligence"];

export default async function ExperiencePage() {
  const [profileResult, experienceResult, projects, skills, leadershipImpact] = await Promise.all([
    getProfile(),
    getExperience(),
    getProjects(),
    getSkills(),
    getLeadershipImpact(),
  ]);

  const profile = resolveProfile(profileResult);
  const experience = orderExperienceByRecent(experienceResult);
  const approach = firstByCategory(leadershipImpact, "Experience Approach");
  const strengths = preferredCategory(leadershipImpact, "Core Strength", "Engineering Principle").slice(0, 5);
  const metrics = getStats(profile, leadershipImpact);
  const groupedSkills = groupSkills(skills);
  const quote = profile.currentlyFocusedOn[1] ?? profile.heroText;

  return (
    <main className="relative isolate overflow-x-hidden border-b border-white/10 bg-[#030712] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_8%,rgba(20,184,166,0.15),transparent_28rem),radial-gradient(circle_at_80%_6%,rgba(59,130,246,0.13),transparent_32rem),linear-gradient(180deg,#030712_0%,#07111f_46%,#030712_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(45,212,191,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
      />

      <div className="mx-auto grid max-w-7xl gap-6">
        <section className="grid gap-8 py-4 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div>
            <SectionKicker icon={BriefcaseBusiness}>Experience</SectionKicker>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
              Experience shaped by practical <span className="text-teal-300">systems work.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              A concise view of full-stack responsibilities, backend architecture habits, and project outcomes across organizations.
            </p>
          </div>

          <ApproachCard item={approach} profile={profile} />
        </section>

        <section className="rounded-lg border border-white/10 bg-[#071321]/76 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric, index) => (
              <StatCard index={index} key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        {experience.length > 0 ? (
          <section className="grid gap-5 lg:grid-cols-[1fr_26rem]">
            <div className="relative grid gap-5 border-l border-teal-300/45 pl-8">
              {experience.map((item) => (
                <ExperienceCard item={item} key={item.id} projects={projects} />
              ))}
            </div>

            <aside className="grid h-fit gap-5">
              <StrengthsCard strengths={strengths} />
              <TechnologiesCard groups={groupedSkills} />
              <QuoteCard quote={quote} />
            </aside>
          </section>
        ) : (
          <EmptyState
            description="Insert experience records into PostgreSQL to populate this page through GET /experience."
            title="No experience records found yet"
          />
        )}
      </div>
    </main>
  );
}

function ApproachCard({ item, profile }: { item?: LeadershipImpact; profile: ResolvedProfile }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#071321]/82 p-6 shadow-2xl shadow-black/20">
      <div className="grid gap-4 sm:grid-cols-[3.75rem_1fr]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-300/10 text-teal-300">
          <BriefcaseBusiness className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">{item?.title || "My Approach"}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {item?.description || profile.summary.split("\n")[0]}
          </p>
        </div>
      </div>
    </article>
  );
}

function StatCard({ index, metric }: { index: number; metric: { label: string; note: string; value: string } }) {
  const visual = statVisuals[index % statVisuals.length];
  const Icon = visual.icon;

  return (
    <article className="grid grid-cols-[3rem_1fr] items-center gap-3 border-white/10 xl:border-r xl:pr-4 xl:last:border-r-0">
      <span className={`grid h-12 w-12 place-items-center rounded-full ${visual.background} ${visual.tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className={`text-2xl font-bold leading-none ${visual.tone}`}>{metric.value}</p>
        <p className="mt-1 text-sm font-semibold text-white">{metric.label}</p>
        {metric.note ? <p className="mt-1 text-xs text-slate-400">{metric.note}</p> : null}
      </div>
    </article>
  );
}

function ExperienceCard({ item, projects }: { item: Experience; projects: Project[] }) {
  const evidence = getExperienceEvidence(item, projects);
  const impacts = getImpactItems(item);

  return (
    <article className="relative rounded-lg border border-white/10 bg-[#071321]/86 p-6 shadow-2xl shadow-black/20">
      <span className="absolute -left-[2.62rem] top-7 h-4 w-4 rounded-full border border-teal-100 bg-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.82)]" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-teal-300 sm:text-2xl">{item.company}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-base font-bold text-white">{item.role}</p>
            <span className="rounded-md bg-teal-300/10 px-2.5 py-1 text-xs font-bold text-teal-300">Full-time</span>
          </div>
        </div>
        <span className="w-fit rounded-md border border-teal-300/20 bg-teal-300/5 px-3 py-1.5 text-xs font-bold text-teal-300">
          {formatExperienceRange(item)}
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-300">{item.description}</p>

      {evidence.items.length > 0 ? (
        <section className="mt-6">
          <h3 className="text-sm font-bold text-teal-300">{evidence.title}</h3>
          {evidence.variant === "projects" ? (
            <div className="mt-4 grid gap-4">
              {evidence.items.map((entry, index) => (
                <ProjectEvidence iconIndex={index} item={entry} key={entry.title} />
              ))}
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
              {evidence.items.map((entry) => (
                <li className="flex gap-3" key={entry.title}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                  <span>{entry.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {impacts.length > 0 ? (
        <section className="mt-7">
          <h3 className="text-sm font-bold text-teal-300">Impact</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {impacts.map((impact, index) => (
              <ImpactChip index={index} item={impact} key={impact} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function ProjectEvidence({ iconIndex, item }: { iconIndex: number; item: EvidenceItem }) {
  const Icon = projectIcons[iconIndex % projectIcons.length];

  return (
    <article className="grid grid-cols-[2.25rem_1fr] gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-300/10 text-teal-300">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h4 className="text-sm font-bold text-white">{item.title}</h4>
        {item.description ? <p className="mt-1 text-xs leading-5 text-slate-400">{item.description}</p> : null}
      </div>
    </article>
  );
}

function ImpactChip({ index, item }: { index: number; item: string }) {
  const icons = [Zap, ShieldCheck, UsersRound, BarChart3];
  const Icon = icons[index % icons.length];

  return (
    <article className="grid grid-cols-[1.6rem_1fr] gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <Icon className="mt-1 h-4 w-4 text-teal-300" />
      <p className="text-xs leading-5 text-slate-300">{item}</p>
    </article>
  );
}

function StrengthsCard({ strengths }: { strengths: LeadershipImpact[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#071321]/86 p-6">
      <SectionKicker icon={Sparkles}>Core Strengths</SectionKicker>
      <div className="mt-5 grid gap-5">
        {strengths.map((strength) => (
          <article className="grid grid-cols-[1.25rem_1fr] gap-3" key={strength.id}>
            <CheckCircle2 className="mt-1 h-4 w-4 text-teal-300" />
            <div>
              <h3 className="text-sm font-bold text-white">{strength.title}</h3>
              {strength.description ? <p className="mt-1 text-xs leading-5 text-slate-400">{strength.description}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TechnologiesCard({ groups }: { groups: SkillGroup[] }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#071321]/86 p-6">
      <SectionKicker icon={Code2}>Technologies I Work With</SectionKicker>
      <div className="mt-5 grid gap-5">
        {groups.map((group) => {
          const style = skillStyles[group.category] ?? { icon: Code2, accent: "text-slate-300" };
          const Icon = style.icon;
          return (
            <section key={group.category}>
              <h3 className={`inline-flex items-center gap-2 text-sm font-bold ${style.accent}`}>
                <Icon className="h-4 w-4" />
                {group.category}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span className="rounded-md bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-slate-300" key={skill.id}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function QuoteCard({ quote }: { quote: string }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#071321]/86 p-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-0 h-36 bg-[radial-gradient(circle,rgba(148,163,184,0.34)_1px,transparent_1.5px)] bg-[size:10px_10px] opacity-20"
      />
      <span className="relative grid h-12 w-12 place-items-center rounded-full bg-teal-300/10 text-teal-300">
        <Quote className="h-6 w-6" />
      </span>
      <blockquote className="relative mt-8 text-xl font-semibold leading-snug text-white sm:text-2xl">
        {highlightRealImpact(quote)}
      </blockquote>
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

function getStats(profile: ResolvedProfile, items: LeadershipImpact[]) {
  const impactMetrics = byCategory(items, "Impact Metric");
  const systems = findMetric(impactMetrics, "Systems Delivered")?.metricValue ?? `${profile.projectsCompleted}+`;
  const workflows = findMetric(impactMetrics, "Automation Workflows")?.metricValue ?? "90+";
  const transactions = findMetric(impactMetrics, "Transactions Monitored")?.metricValue ?? "Millions";
  const realImpactMetric = findMetric(impactMetrics, "Real Impact");

  return [
    { label: "Years Experience", note: "", value: `${profile.yearsExperience}+` },
    { label: "Systems Delivered", note: "", value: systems },
    { label: "Automation Workflows", note: "", value: workflows },
    { label: "Transactions Monitored", note: "", value: transactions },
    {
      label: realImpactMetric?.metricLabel ?? "Across Banking & Communities",
      note: "",
      value: realImpactMetric?.metricValue ?? "Real Impact",
    },
  ];
}

function getExperienceEvidence(item: Experience, projects: Project[]): ExperienceEvidence {
  const company = item.company.toLowerCase();
  const role = item.role.toLowerCase();

  if (company.includes("emtech") || company.includes("e&m")) {
    const project = findProject(projects, "Enterprise Software");
    return {
      title: "Key Projects Delivered",
      variant: "projects",
      items: (project?.results ?? []).map(parseEvidenceItem),
    };
  }

  if (role.includes("automation") || role.includes("ai")) {
    const titles = ["Enterprise Banking", "Automation & Integration", "Data & Observability", "Artificial Intelligence"];
    return {
      title: "Key Work",
      variant: "bullets",
      items: titles
        .flatMap((title) => findProject(projects, title)?.results ?? [])
        .slice(0, 8)
        .map((title) => ({ title })),
    };
  }

  return {
    title: "Key Work",
    variant: "bullets",
    items: item.technologies.map((technology) => ({ title: `Supported ${technology.toLowerCase()} initiatives and digital banking platforms.` })),
  };
}

function getImpactItems(item: Experience): string[] {
  if (item.current) {
    return [
      "Improved operational efficiency through intelligent automation",
      "Enhanced fraud detection and incident response",
      "Better customer experience via AI and self-service",
      "Real-time visibility with interactive dashboards",
    ];
  }

  if (item.company.toLowerCase().includes("emtech") || item.company.toLowerCase().includes("e&m")) {
    return ["Delivered 5+ enterprise systems", "Built practical business workflows", "Connected data, users, and operations"];
  }

  return ["Enhanced digital channels", "Improved self-service adoption", "Supported digital banking growth"];
}

function parseEvidenceItem(value: string): EvidenceItem {
  const [title, ...descriptionParts] = value.split(":");
  return {
    title: title.trim(),
    description: descriptionParts.join(":").trim(),
  };
}

function highlightRealImpact(text: string) {
  const target = "real impact";
  const index = text.toLowerCase().indexOf(target);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="text-teal-300">{text.slice(index, index + target.length)}</span>
      {text.slice(index + target.length)}
    </>
  );
}

function formatExperienceRange(item: Experience): string {
  const start = formatExperienceDate(item.startDate);
  const end = item.current ? "Present" : formatExperienceDate(item.endDate);
  return end ? `${start} - ${end}` : start;
}

function formatExperienceDate(value?: string | null): string {
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

function orderExperienceByRecent(items: Experience[]): Experience[] {
  return [...items].sort((first, second) => {
    const difference = experienceSortValue(second) - experienceSortValue(first);
    return difference || first.id - second.id;
  });
}

function experienceSortValue(item: Experience): number {
  return dateSortValue(item.current ? item.startDate : item.endDate || item.startDate);
}

function dateSortValue(value?: string | null): number {
  const normalized = value?.trim();
  if (!normalized) return Number.NEGATIVE_INFINITY;

  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function groupSkills(skills: Skill[]): SkillGroup[] {
  const groups = new Map<string, Skill[]>();

  skills
    .filter((skill) => skill.category !== "Languages")
    .forEach((skill) => {
      groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]);
    });

  return [...groups.entries()]
    .map(([category, items]) => ({ category, items }))
    .sort((first, second) => skillCategorySortValue(first.category) - skillCategorySortValue(second.category));
}

function skillCategorySortValue(category: string): number {
  const index = skillOrder.findIndex((item) => item.toLowerCase() === category.toLowerCase());
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function preferredCategory(items: LeadershipImpact[], preferred: string, fallback: string): LeadershipImpact[] {
  const preferredItems = byCategory(items, preferred);
  return preferredItems.length > 0 ? preferredItems : byCategory(items, fallback);
}

function byCategory(items: LeadershipImpact[], category: string): LeadershipImpact[] {
  return items.filter((item) => item.category.trim().toLowerCase() === category.toLowerCase());
}

function firstByCategory(items: LeadershipImpact[], category: string): LeadershipImpact | undefined {
  return byCategory(items, category)[0];
}

function findMetric(items: LeadershipImpact[], title: string): LeadershipImpact | undefined {
  return items.find((item) => item.title.trim().toLowerCase() === title.toLowerCase());
}

function findProject(projects: Project[], title: string): Project | undefined {
  return projects.find((project) => project.title.trim().toLowerCase() === title.toLowerCase());
}

type SkillGroup = {
  category: string;
  items: Skill[];
};

type EvidenceItem = {
  description?: string;
  title: string;
};

type ExperienceEvidence = {
  items: EvidenceItem[];
  title: string;
  variant: "bullets" | "projects";
};
