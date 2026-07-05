import { Bot, Code2, Database, GitBranch, LayoutDashboard, Server, ShieldCheck } from "lucide-react";
import { groupBy } from "@/lib/format";
import type { Skill } from "@/types/portfolio";

const categoryIcons = {
  Languages: Code2,
  Frontend: LayoutDashboard,
  Backend: Server,
  Database: Database,
  Databases: Database,
  DevOps: GitBranch,
  "DevOps & Tools": GitBranch,
  Testing: ShieldCheck,
  Workflow: Code2,
  "Artificial Intelligence": Bot,
  "AI & Data": Bot,
};

type SkillMatrixProps = {
  skills: Skill[];
};

export function SkillMatrix({ skills }: SkillMatrixProps) {
  const grouped = groupBy(skills, (skill) => skill.category);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(grouped).map(([category, items]) => {
        const Icon = categoryIcons[category as Skill["category"]] ?? Code2;
        return (
          <section className="surface rounded-lg p-5" key={category}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-electric-500/12 text-electric-500">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-white">{category}</h3>
            </div>
            <div className="mt-5 grid gap-4">
              {items.map((skill) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.03] p-4" key={skill.id}>
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-white">{skill.name}</h4>
                    <span className="rounded-md bg-success-500/10 px-2 py-1 text-xs font-semibold text-success-500">
                      {skill.level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {skill.name} is grouped under {skill.category} with a {skill.level.toLowerCase()} level.
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
