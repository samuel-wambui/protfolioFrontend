import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="surface flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-1 hover:border-electric-500/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-electric-500/40 bg-electric-500/10 px-2.5 py-1 text-xs font-semibold text-electric-500">
          Case Study
        </span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-white">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{project.problem}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((technology) => (
          <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300" key={technology}>
            {technology}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2">
        <Link
          className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md bg-electric-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-electric-600"
          href={`/projects/${project.id}`}
        >
          Case Study
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        {project.githubUrl ? (
          <a
            aria-label={`${project.title} GitHub`}
            className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-300 transition hover:border-electric-500/70 hover:text-white"
            href={project.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Github className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
