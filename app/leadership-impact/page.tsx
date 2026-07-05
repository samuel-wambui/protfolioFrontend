import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/page-hero";
import { getLeadershipImpact } from "@/lib/portfolio-api";
import type { LeadershipImpact } from "@/types/portfolio";

export const metadata = {
  title: "Leadership & Impact",
};

export default async function LeadershipImpactPage() {
  const items = await getLeadershipImpact();
  const introduction = firstByCategory(items, "Introduction");
  const leadershipItems = byCategory(items, "Leadership Experience");
  const mentorshipItems = byCategory(items, "Mentorship");
  const impactItems = byCategory(items, "Community Impact");
  const philosophy = firstByCategory(items, "Leadership Philosophy");

  return (
    <main>
      <PageHero
        description="Leadership, mentorship, and measurable community impact across school, technology, and digital transformation work."
        eyebrow="Leadership & Impact"
        title="Leadership & Impact"
      />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12">
          {items.length > 0 ? (
            <>
              {introduction ? (
                <section className="max-w-4xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-300">Introduction</p>
                  <p className="mt-4 text-base leading-8 text-slate-300">{introduction.description}</p>
                </section>
              ) : null}

              {leadershipItems.length > 0 ? (
                <section>
                  <SectionHeading title="Leadership Experience" />
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {leadershipItems.map((item) => (
                      <LeadershipCard item={item} key={item.id} />
                    ))}
                  </div>
                </section>
              ) : null}

              {mentorshipItems.length > 0 ? (
                <section>
                  <SectionHeading title="Mentorship" />
                  <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                    {mentorshipItems.map((item) => (
                      <article className="surface rounded-lg p-5" key={item.id}>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                          {item.metricValue || item.category}
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-white">{item.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                        {item.impact ? <p className="mt-4 text-sm leading-7 text-teal-200">{item.impact}</p> : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {impactItems.length > 0 ? (
                <section>
                  <SectionHeading title="Community Impact" />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {impactItems.map((item) => (
                      <ImpactCard item={item} key={item.id} />
                    ))}
                  </div>
                </section>
              ) : null}

              {philosophy ? (
                <section>
                  <SectionHeading title="Leadership Philosophy" />
                  <figure className="surface rounded-lg p-6">
                    <blockquote className="mt-5 max-w-5xl text-lg leading-9 text-white">
                      {philosophy.description || philosophy.impact}
                    </blockquote>
                  </figure>
                </section>
              ) : null}
            </>
          ) : (
            <EmptyState
              description="Published leadership, mentorship, and outcome records will appear here."
              title="No leadership impact records found yet"
            />
          )}
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function LeadershipCard({ item }: { item: LeadershipImpact }) {
  return (
    <article className="surface rounded-lg p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
        {item.metricLabel || item.category}
      </p>
      <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
    </article>
  );
}

function ImpactCard({ item }: { item: LeadershipImpact }) {
  return (
    <article className="surface rounded-lg p-5">
      <p className="text-3xl font-bold text-white">{item.metricValue}</p>
      <p className="mt-2 text-sm font-semibold text-slate-300">{item.metricLabel || item.title}</p>
    </article>
  );
}

function byCategory(items: LeadershipImpact[], category: string): LeadershipImpact[] {
  return items.filter((item) => item.category.trim().toLowerCase() === category.toLowerCase());
}

function firstByCategory(items: LeadershipImpact[], category: string): LeadershipImpact | undefined {
  return byCategory(items, category)[0];
}
