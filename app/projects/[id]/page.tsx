import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { ProjectVisual } from "@/components/project-visual";
import { getProjectById, getProjects } from "@/lib/portfolio-api";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    id: String(project.id),
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  return {
    title: project?.title ?? "Project",
    description: project?.problem,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <section className="border-b border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-semibold text-slate-300 transition hover:text-white"
            href="/projects"
          >
            <ArrowLeft className="h-4 w-4" />
            Projects
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md border border-electric-500/40 bg-electric-500/10 px-2.5 py-1 text-xs font-semibold text-electric-500">
                  Case Study
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">{project.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{project.problem}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {project.githubUrl ? (
                  <ButtonLink external href={project.githubUrl} icon={Github} variant="secondary">
                    GitHub
                  </ButtonLink>
                ) : null}
                {project.liveDemoUrl ? (
                  <ButtonLink external href={project.liveDemoUrl} icon={ExternalLink}>
                    Live Demo
                  </ButtonLink>
                ) : null}
              </div>
            </div>
            <aside className="surface rounded-lg p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-success-500">
                Technologies
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span className="rounded-md bg-white/5 px-2.5 py-1 text-sm text-slate-300" key={technology}>
                    {technology}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10">
          <ProjectVisual screenshots={project.screenshots} />

          <div className="grid gap-5 lg:grid-cols-2">
            {[
              { title: "Problem", body: project.problem },
              { title: "Architecture", body: project.architecture },
            ].map((section) => (
              <article className="surface rounded-lg p-5" key={section.title}>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { title: "Challenges", items: project.challenges },
              { title: "Results", items: project.results },
              { title: "Lessons Learned", items: project.lessonsLearned },
            ].map((section) => (
              <article className="surface rounded-lg p-5" key={section.title}>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
                <ul className="mt-4 grid gap-3">
                  {section.items.map((item) => (
                    <li className="flex gap-3 text-sm leading-6 text-slate-300" key={item}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
