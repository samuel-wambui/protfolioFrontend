import { GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/page-hero";
import { formatDateRange } from "@/lib/format";
import { getEducation } from "@/lib/portfolio-api";

export const metadata = {
  title: "Education",
};

export default async function EducationPage() {
  const education = await getEducation();

  return (
    <main>
      <PageHero
        description="Academic and project-based learning focused on building deployable, maintainable web systems."
        eyebrow="Education"
        title="Learning centered on software engineering fundamentals."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-5">
          {education.length > 0 ? (
            education.map((item) => (
              <article className="surface flex gap-4 rounded-lg p-5" key={item.id}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-electric-500/12 text-electric-500">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">{item.course || "Course not set"}</h2>
                  <p className="mt-1 text-sm font-semibold text-electric-500">
                    {item.institution || "Institution not set"}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{formatDateRange(item.startDate, item.endDate)}</p>
                  {item.grade ? <p className="mt-1 text-sm text-slate-400">Grade: {item.grade}</p> : null}
                  {item.description ? <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p> : null}
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              description="Insert education records into PostgreSQL to populate this page through GET /education."
              title="No education records found yet"
            />
          )}
        </div>
      </section>
    </main>
  );
}
