import { notFound } from "next/navigation";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { PageHero } from "@/components/page-hero";
import { adminSections, getAdminSection } from "@/lib/admin-sections";

type AdminSectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

export function generateStaticParams() {
  return adminSections.map((section) => ({
    section: section.id,
  }));
}

export async function generateMetadata({ params }: AdminSectionPageProps) {
  const { section } = await params;
  const adminSection = getAdminSection(section);

  return {
    title: adminSection ? `Admin ${adminSection.label}` : "Admin",
    description: adminSection?.description,
  };
}

export default async function AdminSectionPage({ params }: AdminSectionPageProps) {
  const { section } = await params;
  const adminSection = getAdminSection(section);

  if (!adminSection) {
    notFound();
  }

  return (
    <AdminAuthGuard>
      <main>
        <PageHero
          description={adminSection.description}
          eyebrow="Admin"
          title={`${adminSection.label} admin.`}
        />
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AdminDashboard activeSection={adminSection.id} />
          </div>
        </section>
      </main>
    </AdminAuthGuard>
  );
}
