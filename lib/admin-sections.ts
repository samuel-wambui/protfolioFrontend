export const adminSections = [
  {
    description: "Update the main profile details, hero copy, social links, CV link, and profile image.",
    id: "profile",
    label: "Profile",
    title: "Profile and Hero Text",
  },
  {
    description: "Create, edit, order, and soft-delete portfolio case studies.",
    id: "projects",
    label: "Projects",
    title: "Projects",
  },
  {
    description: "Manage work history and life journey entries shown across the portfolio.",
    id: "journey",
    label: "Life Journey",
    title: "Life Journey",
  },
  {
    description: "Maintain education records, dates, grades, and supporting descriptions.",
    id: "education",
    label: "Education",
    title: "Education",
  },
  {
    description: "Organize technical skills by category and strength level.",
    id: "skills",
    label: "Skills",
    title: "Skills",
  },
  {
    description: "Add and update certifications, issuers, dates, and credential links.",
    id: "certifications",
    label: "Certifications",
    title: "Certifications",
  },
  {
    description: "Manage leadership, community, and measurable impact records.",
    id: "leadership-impact",
    label: "Leadership",
    title: "Leadership and Impact",
  },
  {
    description: "Create, update, and soft-delete portfolio blog posts.",
    id: "blog",
    label: "Blog",
    title: "Blog Posts",
  },
  {
    description: "Review recent portfolio page views, clicks, downloads, referrers, locations, and devices.",
    id: "visitors",
    label: "Visitors",
    title: "Visitors",
  },
] as const;

export type AdminSectionId = (typeof adminSections)[number]["id"];

export function getAdminSection(sectionId: string) {
  return adminSections.find((section) => section.id === sectionId);
}
