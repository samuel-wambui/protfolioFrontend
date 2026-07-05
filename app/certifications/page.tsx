import { Award, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/page-hero";
import { getCertifications } from "@/lib/portfolio-api";

export const metadata = {
  title: "Certifications",
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <main>
      <PageHero
        description="Certifications and structured learning records that support the portfolio project work."
        eyebrow="Certifications"
        title="Credentials connected to practical implementation."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {certifications.length > 0 ? (
            certifications.map((certification) => (
              <article className="surface rounded-lg p-5" key={certification.id}>
                <span className="grid h-11 w-11 place-items-center rounded-md bg-success-500/12 text-success-500">
                  <Award className="h-5 w-5" />
                </span>
              <h2 className="mt-5 text-xl font-bold text-white">{certification.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{certification.issuer}</p>
                <p className="mt-1 text-sm text-slate-400">{certification.dateIssued}</p>
                {certification.credentialUrl ? (
                  <a
                    className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-electric-500 transition hover:text-white"
                    href={certification.credentialUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Credential
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </article>
            ))
          ) : (
            <div className="md:col-span-2">
              <EmptyState
                description="Insert certification records into PostgreSQL to populate this page through GET /certifications."
                title="No certifications found yet"
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
