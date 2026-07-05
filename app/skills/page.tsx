import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/page-hero";
import { SkillMatrix } from "@/components/skill-matrix";
import { getSkills } from "@/lib/portfolio-api";

export const metadata = {
  title: "Skills",
};

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <main>
      <PageHero
        description="The stack is organized by practical responsibility: user interface, backend services, persistence, delivery, and workflow."
        eyebrow="Skills"
        title="A full-stack skill set with clean code discipline."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {skills.length > 0 ? (
            <SkillMatrix skills={skills} />
          ) : (
            <EmptyState
              description="Insert skill records into PostgreSQL to populate this matrix through GET /skills."
              title="No skills found in the database yet"
            />
          )}
        </div>
      </section>
    </main>
  );
}
