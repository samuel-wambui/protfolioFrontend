import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { resolveProfile } from "@/data/portfolio-fallbacks";
import { getProfile } from "@/lib/portfolio-api";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const profile = resolveProfile(await getProfile());

  return (
    <main>
      <PageHero
        description="Use the form for scholarship, recruiter, collaboration, or project conversations. The frontend posts to the Spring Boot contact endpoint."
        eyebrow="Contact"
        title="Start a conversation about the work."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="surface h-fit rounded-lg p-5">
            <h2 className="text-xl font-bold text-white">Contact Details</h2>
            <div className="mt-5 grid gap-4">
              {[
                { label: "Email", value: profile.email, icon: Mail },
                { label: "Location", value: profile.location, icon: MapPin },
                { label: "GitHub", value: profile.githubUrl, icon: Github },
                { label: "LinkedIn", value: profile.linkedinUrl, icon: Linkedin },
              ].map((item) => (
                <div className="flex gap-3" key={item.label}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-electric-500/12 text-electric-500">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
