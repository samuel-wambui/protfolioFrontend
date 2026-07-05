import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/portfolio-api";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <PageHero
        description="Each project includes problem, architecture, screenshots, technologies, challenges, results, lessons learned, GitHub, and live demo. Some may lack all of this due to copyright restrictions."
        eyebrow="Projects"
        title="Project work explained like engineering evidence."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="After the PostgreSQL seed runs, each record will appear here through GET /projects."
              title="No projects found in the database yet"
            />
          )}
        </div>
      </section>
    </main>
  );
}
