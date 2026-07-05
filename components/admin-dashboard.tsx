"use client";

import { FormEvent, useEffect, useState } from "react";
import { LogOut, Pencil, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api-client";
import { adminSections, type AdminSectionId } from "@/lib/admin-sections";
import { sortByDisplayDateDesc } from "@/lib/date-order";
import { formatDateRange } from "@/lib/format";
import { getConfiguredPortfolioId, normalizePortfolioId, withPortfolioId } from "@/lib/portfolio-id";
import type { AnalyticsEvent } from "@/types/analytics";
import type {
  BlogPost,
  Certification,
  Education,
  Experience,
  LeadershipImpact,
  Profile,
  Project,
  Skill,
} from "@/types/portfolio";

type SaveState = {
  section: string;
  status: "idle" | "saving" | "saved" | "error";
  message: string;
};

type AdminCollections = {
  analyticsEvents: AnalyticsEvent[];
  blogPosts: BlogPost[];
  certifications: Certification[];
  education: Education[];
  experience: Experience[];
  leadershipImpact: LeadershipImpact[];
  projects: Project[];
  skills: Skill[];
};

type ProfileFormValues = {
  collaborationLabel: string;
  currentlyFocusedOn: string;
  cvUrl: string;
  email: string;
  fullName: string;
  githubUrl: string;
  heroText: string;
  learningLabel: string;
  linkedinUrl: string;
  location: string;
  phone: string;
  photoUrl: string;
  portfolioUrl: string;
  projectsCompleted: string;
  roles: string;
  specializedIn: string;
  summary: string;
  title: string;
  yearsExperience: string;
};

type ProjectFormValues = {
  architecture: string;
  challenges: string;
  displayOrder: string;
  githubUrl: string;
  id: string;
  lessonsLearned: string;
  liveDemoUrl: string;
  problem: string;
  results: string;
  screenshots: string;
  technologies: string;
  title: string;
};

type ExperienceFormValues = {
  company: string;
  current: boolean;
  description: string;
  endDate: string;
  id: string;
  role: string;
  startDate: string;
  technologies: string;
};

type EducationFormValues = {
  course: string;
  description: string;
  endDate: string;
  grade: string;
  id: string;
  institution: string;
  startDate: string;
};

type SkillFormValues = {
  category: Skill["category"];
  id: string;
  level: Skill["level"];
  name: string;
};

type CertificationFormValues = {
  credentialUrl: string;
  dateIssued: string;
  id: string;
  issuer: string;
  name: string;
};

type BlogPostFormValues = {
  body: string;
  excerpt: string;
  id: string;
  publishedAt: string;
  readTime: string;
  slug: string;
  tags: string;
  title: string;
};

type LeadershipImpactFormValues = {
  category: string;
  description: string;
  displayOrder: string;
  id: string;
  impact: string;
  metricLabel: string;
  metricValue: string;
  tags: string;
  title: string;
};

const skillCategories: Skill["category"][] = [
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Databases",
  "DevOps",
  "DevOps & Tools",
  "Testing",
  "Workflow",
  "Artificial Intelligence",
  "AI & Data",
];
const skillLevels: Skill["level"][] = ["Advanced", "Strong", "Growing"];

const emptyCollections: AdminCollections = {
  analyticsEvents: [],
  blogPosts: [],
  certifications: [],
  education: [],
  experience: [],
  leadershipImpact: [],
  projects: [],
  skills: [],
};

const emptyProfileFormValues: ProfileFormValues = {
  collaborationLabel: "",
  currentlyFocusedOn: "",
  cvUrl: "",
  email: "",
  fullName: "",
  githubUrl: "",
  heroText: "",
  learningLabel: "",
  linkedinUrl: "",
  location: "",
  phone: "",
  photoUrl: "",
  portfolioUrl: "",
  projectsCompleted: "",
  roles: "",
  specializedIn: "",
  summary: "",
  title: "",
  yearsExperience: "",
};

const emptyProjectFormValues: ProjectFormValues = {
  architecture: "",
  challenges: "",
  displayOrder: "",
  githubUrl: "",
  id: "",
  lessonsLearned: "",
  liveDemoUrl: "",
  problem: "",
  results: "",
  screenshots: "",
  technologies: "",
  title: "",
};

const emptyExperienceFormValues: ExperienceFormValues = {
  company: "",
  current: false,
  description: "",
  endDate: "",
  id: "",
  role: "",
  startDate: "",
  technologies: "",
};

const emptyEducationFormValues: EducationFormValues = {
  course: "",
  description: "",
  endDate: "",
  grade: "",
  id: "",
  institution: "",
  startDate: "",
};

const emptySkillFormValues: SkillFormValues = {
  category: "Backend",
  id: "",
  level: "Strong",
  name: "",
};

const emptyCertificationFormValues: CertificationFormValues = {
  credentialUrl: "",
  dateIssued: "",
  id: "",
  issuer: "",
  name: "",
};

const emptyBlogPostFormValues: BlogPostFormValues = {
  body: "",
  excerpt: "",
  id: "",
  publishedAt: "",
  readTime: "",
  slug: "",
  tags: "",
  title: "",
};

const emptyLeadershipImpactFormValues: LeadershipImpactFormValues = {
  category: "",
  description: "",
  displayOrder: "",
  id: "",
  impact: "",
  metricLabel: "",
  metricValue: "",
  tags: "",
  title: "",
};

export function AdminDashboard({ activeSection }: { activeSection: AdminSectionId }) {
  const { signOut, user } = useAuth();
  const [portfolioId, setPortfolioId] = useState(() => getConfiguredPortfolioId());
  const [portfolioInput, setPortfolioInput] = useState(() => getConfiguredPortfolioId());
  const [collections, setCollections] = useState<AdminCollections>(emptyCollections);
  const [profileFormVersion, setProfileFormVersion] = useState(0);
  const [projectFormVersion, setProjectFormVersion] = useState(0);
  const [experienceFormVersion, setExperienceFormVersion] = useState(0);
  const [educationFormVersion, setEducationFormVersion] = useState(0);
  const [skillFormVersion, setSkillFormVersion] = useState(0);
  const [certificationFormVersion, setCertificationFormVersion] = useState(0);
  const [blogPostFormVersion, setBlogPostFormVersion] = useState(0);
  const [leadershipImpactFormVersion, setLeadershipImpactFormVersion] = useState(0);
  const [profileValues, setProfileValues] = useState<ProfileFormValues>(emptyProfileFormValues);
  const [projectValues, setProjectValues] = useState<ProjectFormValues>(emptyProjectFormValues);
  const [experienceValues, setExperienceValues] = useState<ExperienceFormValues>(emptyExperienceFormValues);
  const [educationValues, setEducationValues] = useState<EducationFormValues>(emptyEducationFormValues);
  const [skillValues, setSkillValues] = useState<SkillFormValues>(emptySkillFormValues);
  const [certificationValues, setCertificationValues] = useState<CertificationFormValues>(emptyCertificationFormValues);
  const [blogPostValues, setBlogPostValues] = useState<BlogPostFormValues>(emptyBlogPostFormValues);
  const [leadershipImpactValues, setLeadershipImpactValues] = useState<LeadershipImpactFormValues>(emptyLeadershipImpactFormValues);
  const [state, setState] = useState<SaveState>({
    section: "",
    status: "idle",
    message: "",
  });

  useEffect(() => {
    let active = true;

    async function loadInitialContent() {
      setState({ section: "Dashboard", status: "saving", message: `Loading ${portfolioId} content for editing...` });

      try {
        const [profile, resources] = await Promise.all([
          apiFetch<Profile | null>(withPortfolioId("/profile", portfolioId), { auth: false }),
          fetchAdminCollections(portfolioId),
        ]);

        if (!active) {
          return;
        }

        setProfileValues(toProfileFormValues(profile));
        setCollections(resources);
        setProjectValues(emptyProjectFormValues);
        setExperienceValues(emptyExperienceFormValues);
        setEducationValues(emptyEducationFormValues);
        setSkillValues(emptySkillFormValues);
        setCertificationValues(emptyCertificationFormValues);
        setBlogPostValues(emptyBlogPostFormValues);
        setLeadershipImpactValues(emptyLeadershipImpactFormValues);
        setProfileFormVersion((current) => current + 1);
        setProjectFormVersion((current) => current + 1);
        setExperienceFormVersion((current) => current + 1);
        setEducationFormVersion((current) => current + 1);
        setSkillFormVersion((current) => current + 1);
        setCertificationFormVersion((current) => current + 1);
        setBlogPostFormVersion((current) => current + 1);
        setLeadershipImpactFormVersion((current) => current + 1);
        setState({
          section: "Dashboard",
          status: "idle",
          message: `${portfolioId} content loaded. Pick any saved record to edit or delete it.`,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          section: "Dashboard",
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Backend content could not be loaded. Check that the backend is running.",
        });
      }
    }

    loadInitialContent();

    return () => {
      active = false;
    };
  }, [portfolioId]);

  async function refreshCollections() {
    setCollections(await fetchAdminCollections(portfolioId));
  }

  function applyPortfolioForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPortfolioId = normalizePortfolioId(portfolioInput);
    setPortfolioInput(nextPortfolioId);
    setPortfolioId(nextPortfolioId);
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ section: "Profile", status: "saving", message: "Saving profile..." });

    const formData = new FormData(event.currentTarget);

    try {
      const profile = await apiFetch<Profile>(withPortfolioId("/profile", portfolioId), {
        method: "PUT",
        body: {
          portfolioId,
          fullName: nullableTextValue(formData, "fullName"),
          title: nullableTextValue(formData, "title"),
          roles: nullableListValue(formData, "roles"),
          specializedIn: nullableListValue(formData, "specializedIn"),
          currentlyFocusedOn: nullableListValue(formData, "currentlyFocusedOn"),
          heroText: nullableTextValue(formData, "heroText"),
          summary: nullableTextValue(formData, "summary"),
          email: nullableTextValue(formData, "email"),
          phone: nullableTextValue(formData, "phone"),
          location: nullableTextValue(formData, "location"),
          githubUrl: nullableTextValue(formData, "githubUrl"),
          linkedinUrl: nullableTextValue(formData, "linkedinUrl"),
          portfolioUrl: nullableTextValue(formData, "portfolioUrl"),
          cvUrl: nullableTextValue(formData, "cvUrl"),
          photoUrl: nullableTextValue(formData, "photoUrl"),
          projectsCompleted: nullableNumberValue(formData, "projectsCompleted"),
          yearsExperience: nullableNumberValue(formData, "yearsExperience"),
          learningLabel: nullableTextValue(formData, "learningLabel"),
          collaborationLabel: nullableTextValue(formData, "collaborationLabel"),
        },
      });

      setProfileValues(toProfileFormValues(profile));
      setProfileFormVersion((current) => current + 1);
      setState({ section: "Profile", status: "saved", message: "Profile saved successfully." });
    } catch (error) {
      setState({
        section: "Profile",
        status: "error",
        message: error instanceof Error ? error.message : "Profile could not be saved.",
      });
    }
  }

  async function submitResource<T>(
    event: FormEvent<HTMLFormElement>,
    section: string,
    path: string,
    buildPayload: (formData: FormData) => Record<string, unknown>,
    applySavedRecord: (record: T) => void,
  ) {
    event.preventDefault();
    setState({ section, status: "saving", message: `Saving ${section.toLowerCase()}...` });

    const formData = new FormData(event.currentTarget);
    const id = textValue(formData, "id");
    const method = id ? "PUT" : "POST";
    const endpoint = withPortfolioId(id ? `${path}/${id}` : path, portfolioId);

    try {
      const record = await apiFetch<T>(endpoint, {
        method,
        body: {
          portfolioId,
          ...buildPayload(formData),
        },
      });

      applySavedRecord(record);
      await refreshCollections();
      setState({ section, status: "saved", message: `${section} saved successfully.` });
    } catch (error) {
      setState({
        section,
        status: "error",
        message: error instanceof Error ? error.message : `${section} could not be saved.`,
      });
    }
  }

  async function deleteResource(section: string, path: string, id: number, afterDelete: () => void) {
    const confirmed = window.confirm(`Delete this ${section.toLowerCase()}? It will be hidden but kept in the database.`);
    if (!confirmed) {
      return;
    }

    setState({ section, status: "saving", message: `Deleting ${section.toLowerCase()}...` });

    try {
      await apiFetch<null>(withPortfolioId(`${path}/${id}`, portfolioId), { method: "DELETE" });
      afterDelete();
      await refreshCollections();
      setState({ section, status: "saved", message: `${section} deleted. The row was soft-deleted in the database.` });
    } catch (error) {
      setState({
        section,
        status: "error",
        message: error instanceof Error ? error.message : `${section} could not be deleted.`,
      });
    }
  }

  function editProject(project: Project) {
    setProjectValues(toProjectFormValues(project));
    setProjectFormVersion((current) => current + 1);
  }

  function clearProject() {
    setProjectValues(emptyProjectFormValues);
    setProjectFormVersion((current) => current + 1);
  }

  function editExperience(experience: Experience) {
    setExperienceValues(toExperienceFormValues(experience));
    setExperienceFormVersion((current) => current + 1);
  }

  function clearExperience() {
    setExperienceValues(emptyExperienceFormValues);
    setExperienceFormVersion((current) => current + 1);
  }

  function editEducation(education: Education) {
    setEducationValues(toEducationFormValues(education));
    setEducationFormVersion((current) => current + 1);
  }

  function clearEducation() {
    setEducationValues(emptyEducationFormValues);
    setEducationFormVersion((current) => current + 1);
  }

  function editSkill(skill: Skill) {
    setSkillValues(toSkillFormValues(skill));
    setSkillFormVersion((current) => current + 1);
  }

  function clearSkill() {
    setSkillValues(emptySkillFormValues);
    setSkillFormVersion((current) => current + 1);
  }

  function editCertification(certification: Certification) {
    setCertificationValues(toCertificationFormValues(certification));
    setCertificationFormVersion((current) => current + 1);
  }

  function clearCertification() {
    setCertificationValues(emptyCertificationFormValues);
    setCertificationFormVersion((current) => current + 1);
  }

  function editBlogPost(post: BlogPost) {
    setBlogPostValues(toBlogPostFormValues(post));
    setBlogPostFormVersion((current) => current + 1);
  }

  function clearBlogPost() {
    setBlogPostValues(emptyBlogPostFormValues);
    setBlogPostFormVersion((current) => current + 1);
  }

  function editLeadershipImpact(item: LeadershipImpact) {
    setLeadershipImpactValues(toLeadershipImpactFormValues(item));
    setLeadershipImpactFormVersion((current) => current + 1);
  }

  function clearLeadershipImpact() {
    setLeadershipImpactValues(emptyLeadershipImpactFormValues);
    setLeadershipImpactFormVersion((current) => current + 1);
  }

  return (
    <div className="grid gap-6">
      <div className="surface flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-electric-500/12 text-electric-500">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Authenticated admin session</p>
            <p className="mt-1 text-sm text-slate-400">
              Signed in as {user?.name ?? user?.username ?? "admin"}
            </p>
          </div>
        </div>
        <button
          className="focus-ring inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-electric-500/70 hover:text-white"
          onClick={() => {
            signOut();
          }}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>

      <form
        className="surface flex flex-col gap-4 rounded-lg p-5 md:flex-row md:items-end md:justify-between"
        onSubmit={applyPortfolioForm}
      >
        <label className="grid flex-1 gap-2 text-sm font-semibold text-white">
          Portfolio ID
          <input
            className="focus-ring min-h-11 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
            onChange={(event) => setPortfolioInput(event.target.value)}
            placeholder="PORT001"
            value={portfolioInput}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-white/10 bg-navy-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Active {portfolioId}
          </span>
          <button
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-electric-600"
            type="submit"
          >
            <Save className="h-4 w-4" />
            <span>Load Portfolio</span>
          </button>
        </div>
      </form>

      <AdminSectionNavigation activeSection={activeSection} collections={collections} />

      <StatusBar state={state} />

      <AdminSection activeSection={activeSection} sectionId="visitors" title="Visitors">
        <VisitEventList events={collections.analyticsEvents} />
      </AdminSection>

      <AdminSection activeSection={activeSection} sectionId="profile" title="Profile and Hero Text">
        <form className="grid gap-4" key={profileFormVersion} onSubmit={submitProfile}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField defaultValue={profileValues.fullName} name="fullName" placeholder="Full name" title="Full Name" />
            <TextField defaultValue={profileValues.title} name="title" placeholder="Professional title" title="Title" />
          </div>
          <TextField defaultValue={profileValues.roles} name="roles" placeholder="Automation Engineer, AI Engineer, Backend Developer" title="Roles" />
          <TextField defaultValue={profileValues.specializedIn} name="specializedIn" placeholder="Java, Spring Boot, React, PostgreSQL" title="Specialized In" />
          <TextField defaultValue={profileValues.currentlyFocusedOn} name="currentlyFocusedOn" placeholder="AI platforms, automation systems, backend architecture" title="Currently Focused On" />
          <TextArea defaultValue={profileValues.heroText} name="heroText" placeholder="Main homepage hero line." title="Hero Text" />
          <TextArea defaultValue={profileValues.summary} name="summary" placeholder="Short profile summary for hero and about sections." title="Summary" />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField defaultValue={profileValues.email} name="email" placeholder="you@example.com" title="Email" type="email" />
            <TextField defaultValue={profileValues.phone} name="phone" placeholder="+254..." title="Phone" />
            <TextField defaultValue={profileValues.location} name="location" placeholder="Location" title="Location" />
            <TextField defaultValue={profileValues.githubUrl} name="githubUrl" placeholder="https://github.com/..." title="GitHub URL" type="url" />
            <TextField defaultValue={profileValues.linkedinUrl} name="linkedinUrl" placeholder="https://linkedin.com/in/..." title="LinkedIn URL" type="url" />
            <TextField defaultValue={profileValues.portfolioUrl} name="portfolioUrl" placeholder="https://..." title="Portfolio URL" type="url" />
            <TextField defaultValue={profileValues.cvUrl} name="cvUrl" placeholder="/files/cv.pdf or https://..." title="CV URL" />
            <TextField defaultValue={profileValues.photoUrl} name="photoUrl" placeholder="/images/samuel-ngari-profile.png" title="Photo URL" />
            <TextField defaultValue={profileValues.projectsCompleted} name="projectsCompleted" placeholder="20" title="Projects Completed" type="number" />
            <TextField defaultValue={profileValues.yearsExperience} name="yearsExperience" placeholder="3" title="Years Experience" type="number" />
            <TextField defaultValue={profileValues.learningLabel} name="learningLabel" placeholder="AI & Automation" title="Learning Label" />
            <TextField defaultValue={profileValues.collaborationLabel} name="collaborationLabel" placeholder="Automation Workflows" title="Collaboration Label" />
          </div>
          <SaveButton label="Save Profile" />
        </form>
      </AdminSection>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSection activeSection={activeSection} sectionId="projects" title="Projects">
          <EditableList
            emptyLabel="No projects saved yet."
            getMeta={(project) => `Order ${project.displayOrder ?? project.id} / ${project.technologies.join(", ")}`}
            getTitle={(project) => project.title}
            items={collections.projects}
            onDelete={(project) =>
              deleteResource("Project", "/projects", project.id, () => {
                if (projectValues.id === String(project.id)) {
                  clearProject();
                }
              })
            }
            onEdit={editProject}
          />
          <form
            className="grid gap-4"
            key={projectFormVersion}
            onSubmit={(event) =>
              submitResource<Project>(
                event,
                "Project",
                "/projects",
                (formData) => ({
                  title: textValue(formData, "title"),
                  problem: textValue(formData, "problem"),
                  architecture: textValue(formData, "architecture"),
                  displayOrder: nullableNumberValue(formData, "displayOrder"),
                  screenshots: listValue(formData, "screenshots"),
                  technologies: listValue(formData, "technologies"),
                  challenges: listValue(formData, "challenges"),
                  results: listValue(formData, "results"),
                  lessonsLearned: listValue(formData, "lessonsLearned"),
                  githubUrl: nullableTextValue(formData, "githubUrl"),
                  liveDemoUrl: nullableTextValue(formData, "liveDemoUrl"),
                }),
                editProject,
              )
            }
          >
            <FormModeLabel id={projectValues.id} label="project" onNew={clearProject} />
            <div className="grid gap-4 md:grid-cols-[1fr_9rem]">
              <TextField defaultValue={projectValues.title} name="title" title="Title" />
              <TextField defaultValue={projectValues.displayOrder} name="displayOrder" placeholder="1" title="Display Order" type="number" />
            </div>
            <HiddenId value={projectValues.id} />
            <TextArea defaultValue={projectValues.problem} name="problem" title="Problem" />
            <TextArea defaultValue={projectValues.architecture} name="architecture" title="Architecture" />
            <TextField defaultValue={projectValues.screenshots} name="screenshots" placeholder="/images/portfolio-hero.png, /images/project.png" title="Screenshot URLs" />
            <TextField defaultValue={projectValues.technologies} name="technologies" placeholder="Next.js, Spring Boot, PostgreSQL" title="Technologies" />
            <TextField defaultValue={projectValues.challenges} name="challenges" placeholder="Challenge one, Challenge two" title="Challenges" />
            <TextField defaultValue={projectValues.results} name="results" placeholder="Result one, Result two" title="Results" />
            <TextField defaultValue={projectValues.lessonsLearned} name="lessonsLearned" placeholder="Lesson one, Lesson two" title="Lessons Learned" />
            <TextField defaultValue={projectValues.githubUrl} name="githubUrl" title="GitHub URL" type="url" />
            <TextField defaultValue={projectValues.liveDemoUrl} name="liveDemoUrl" title="Live Demo URL" type="url" />
            <SaveButton label="Save Project" />
          </form>
        </AdminSection>

        <AdminSection activeSection={activeSection} sectionId="journey" title="Life Journey">
          <EditableList
            emptyLabel="No journey items saved yet."
            getMeta={(item) =>
              `${item.role || "Role not set"} / ${formatJourneyRange(item)}`
            }
            getTitle={(item) => item.company || "Company not set"}
            items={collections.experience}
            onDelete={(item) =>
              deleteResource("Experience", "/experience", item.id, () => {
                if (experienceValues.id === String(item.id)) {
                  clearExperience();
                }
              })
            }
            onEdit={editExperience}
          />
          <form
            className="grid gap-4"
            key={experienceFormVersion}
            onSubmit={(event) =>
              submitResource<Experience>(
                event,
                "Journey",
                "/experience",
                (formData) => ({
                  company: textValue(formData, "company"),
                  role: textValue(formData, "role"),
                  startDate: textValue(formData, "startDate"),
                  endDate: textValue(formData, "endDate"),
                  current: formData.get("current") === "on",
                  description: textValue(formData, "description"),
                  technologies: listValue(formData, "technologies"),
                }),
                editExperience,
              )
            }
          >
            <FormModeLabel id={experienceValues.id} label="life journey item" onNew={clearExperience} />
            <HiddenId value={experienceValues.id} />
            <TextField defaultValue={experienceValues.company} name="company" title="Company" />
            <TextField defaultValue={experienceValues.role} name="role" title="Role" />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField defaultValue={experienceValues.startDate} name="startDate" title="Start Date" type="date" />
              <TextField defaultValue={experienceValues.endDate} name="endDate" title="End Date" type="date" />
            </div>
            <CheckboxField defaultChecked={experienceValues.current} name="current" title="Current role" />
            <TextArea defaultValue={experienceValues.description} name="description" title="Description" />
            <TextField defaultValue={experienceValues.technologies} name="technologies" placeholder="Java, Spring Boot, PostgreSQL" title="Technologies" />
            <SaveButton label="Save Life Journey" />
          </form>
        </AdminSection>

        <AdminSection activeSection={activeSection} sectionId="education" title="Education">
          <EditableList
            emptyLabel="No education saved yet."
            getMeta={(item) =>
              `${item.course || "Course not set"} / ${item.grade || "Grade not set"} / ${formatDateRange(item.startDate, item.endDate)}`
            }
            getTitle={(item) => item.institution || "Institution not set"}
            items={collections.education}
            onDelete={(item) =>
              deleteResource("Education", "/education", item.id, () => {
                if (educationValues.id === String(item.id)) {
                  clearEducation();
                }
              })
            }
            onEdit={editEducation}
          />
          <form
            className="grid gap-4"
            key={educationFormVersion}
            onSubmit={(event) =>
              submitResource<Education>(
                event,
                "Education",
                "/education",
                (formData) => ({
                  institution: textValue(formData, "institution"),
                  course: textValue(formData, "course"),
                  grade: textValue(formData, "grade"),
                  startDate: textValue(formData, "startDate"),
                  endDate: textValue(formData, "endDate"),
                  description: textValue(formData, "description"),
                }),
                editEducation,
              )
            }
          >
            <FormModeLabel id={educationValues.id} label="education" onNew={clearEducation} />
            <HiddenId value={educationValues.id} />
            <TextField defaultValue={educationValues.institution} name="institution" title="Institution" />
            <TextField defaultValue={educationValues.course} name="course" title="Course" />
            <TextField defaultValue={educationValues.grade} name="grade" title="Grade" />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField defaultValue={educationValues.startDate} name="startDate" title="Start Date" type="date" />
              <TextField defaultValue={educationValues.endDate} name="endDate" title="End Date" type="date" />
            </div>
            <TextArea defaultValue={educationValues.description} name="description" title="Description" />
            <SaveButton label="Save Education" />
          </form>
        </AdminSection>

        <AdminSection activeSection={activeSection} sectionId="skills" title="Skills">
          <EditableList
            emptyLabel="No skills saved yet."
            getMeta={(skill) => `${skill.category} / ${skill.level}`}
            getTitle={(skill) => skill.name}
            items={collections.skills}
            onDelete={(skill) =>
              deleteResource("Skill", "/skills", skill.id, () => {
                if (skillValues.id === String(skill.id)) {
                  clearSkill();
                }
              })
            }
            onEdit={editSkill}
          />
          <form
            className="grid gap-4"
            key={skillFormVersion}
            onSubmit={(event) =>
              submitResource<Skill>(
                event,
                "Skill",
                "/skills",
                (formData) => ({
                  name: textValue(formData, "name"),
                  category: textValue(formData, "category"),
                  level: textValue(formData, "level"),
                }),
                editSkill,
              )
            }
          >
            <FormModeLabel id={skillValues.id} label="skill" onNew={clearSkill} />
            <HiddenId value={skillValues.id} />
            <TextField defaultValue={skillValues.name} name="name" title="Name" />
            <SelectField defaultValue={skillValues.category} name="category" options={skillCategories} title="Category" />
            <SelectField defaultValue={skillValues.level} name="level" options={skillLevels} title="Level" />
            <SaveButton label="Save Skill" />
          </form>
        </AdminSection>

        <AdminSection activeSection={activeSection} sectionId="certifications" title="Certifications">
          <EditableList
            emptyLabel="No certifications saved yet."
            getMeta={(item) => `${item.issuer} / ${item.dateIssued}`}
            getTitle={(item) => item.name}
            items={collections.certifications}
            onDelete={(item) =>
              deleteResource("Certification", "/certifications", item.id, () => {
                if (certificationValues.id === String(item.id)) {
                  clearCertification();
                }
              })
            }
            onEdit={editCertification}
          />
          <form
            className="grid gap-4"
            key={certificationFormVersion}
            onSubmit={(event) =>
              submitResource<Certification>(
                event,
                "Certification",
                "/certifications",
                (formData) => ({
                  name: textValue(formData, "name"),
                  issuer: textValue(formData, "issuer"),
                  dateIssued: textValue(formData, "dateIssued"),
                  credentialUrl: nullableTextValue(formData, "credentialUrl"),
                }),
                editCertification,
              )
            }
          >
            <FormModeLabel id={certificationValues.id} label="certification" onNew={clearCertification} />
            <HiddenId value={certificationValues.id} />
            <TextField defaultValue={certificationValues.name} name="name" title="Name" />
            <TextField defaultValue={certificationValues.issuer} name="issuer" title="Issuer" />
            <TextField defaultValue={certificationValues.dateIssued} name="dateIssued" title="Date Issued" type="date" />
            <TextField defaultValue={certificationValues.credentialUrl} name="credentialUrl" title="Credential URL" type="url" />
            <SaveButton label="Save Certification" />
          </form>
        </AdminSection>

        <AdminSection activeSection={activeSection} sectionId="leadership-impact" title="Leadership and Impact">
          <EditableList
            emptyLabel="No leadership impact records saved yet."
            getMeta={(item) =>
              `Order ${item.displayOrder ?? item.id} / ${item.category || "Category not set"} / ${
                item.metricValue && item.metricLabel ? `${item.metricValue} ${item.metricLabel}` : "No metric"
              }`
            }
            getTitle={(item) => item.title || "Impact item not set"}
            items={collections.leadershipImpact}
            onDelete={(item) =>
              deleteResource("Leadership Impact", "/leadership-impact", item.id, () => {
                if (leadershipImpactValues.id === String(item.id)) {
                  clearLeadershipImpact();
                }
              })
            }
            onEdit={editLeadershipImpact}
          />
          <form
            className="grid gap-4"
            key={leadershipImpactFormVersion}
            onSubmit={(event) =>
              submitResource<LeadershipImpact>(
                event,
                "Leadership Impact",
                "/leadership-impact",
                (formData) => ({
                  category: textValue(formData, "category"),
                  title: textValue(formData, "title"),
                  description: textValue(formData, "description"),
                  impact: textValue(formData, "impact"),
                  metricValue: textValue(formData, "metricValue"),
                  metricLabel: textValue(formData, "metricLabel"),
                  displayOrder: nullableNumberValue(formData, "displayOrder"),
                  tags: listValue(formData, "tags"),
                }),
                editLeadershipImpact,
              )
            }
          >
            <FormModeLabel id={leadershipImpactValues.id} label="leadership impact item" onNew={clearLeadershipImpact} />
            <HiddenId value={leadershipImpactValues.id} />
            <div className="grid gap-4 md:grid-cols-[1fr_9rem]">
              <TextField defaultValue={leadershipImpactValues.title} name="title" title="Title" />
              <TextField defaultValue={leadershipImpactValues.displayOrder} name="displayOrder" placeholder="1" title="Display Order" type="number" />
            </div>
            <TextField defaultValue={leadershipImpactValues.category} name="category" placeholder="Community Impact" title="Category" />
            <TextArea defaultValue={leadershipImpactValues.description} name="description" title="Description" />
            <TextArea defaultValue={leadershipImpactValues.impact} name="impact" title="Impact" />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField defaultValue={leadershipImpactValues.metricValue} name="metricValue" placeholder="4,000+" title="Metric Value" />
              <TextField defaultValue={leadershipImpactValues.metricLabel} name="metricLabel" placeholder="customers digitized" title="Metric Label" />
            </div>
            <TextField defaultValue={leadershipImpactValues.tags} name="tags" placeholder="Digital inclusion, Automation, Leadership" title="Tags" />
            <SaveButton label="Save Leadership Impact" />
          </form>
        </AdminSection>

        <AdminSection activeSection={activeSection} sectionId="blog" title="Blog Posts">
          <EditableList
            emptyLabel="No blog posts saved yet."
            getMeta={(post) => `${post.publishedAt} / ${post.readTime}`}
            getTitle={(post) => post.title}
            items={collections.blogPosts}
            onDelete={(post) =>
              deleteResource("Blog Post", "/blog", post.id, () => {
                if (blogPostValues.id === String(post.id)) {
                  clearBlogPost();
                }
              })
            }
            onEdit={editBlogPost}
          />
          <form
            className="grid gap-4"
            key={blogPostFormVersion}
            onSubmit={(event) =>
              submitResource<BlogPost>(
                event,
                "Blog Post",
                "/blog",
                (formData) => ({
                  slug: textValue(formData, "slug"),
                  title: textValue(formData, "title"),
                  excerpt: textValue(formData, "excerpt"),
                  publishedAt: textValue(formData, "publishedAt"),
                  readTime: textValue(formData, "readTime"),
                  tags: listValue(formData, "tags"),
                  body: textValue(formData, "body"),
                }),
                editBlogPost,
              )
            }
          >
            <FormModeLabel id={blogPostValues.id} label="blog post" onNew={clearBlogPost} />
            <HiddenId value={blogPostValues.id} />
            <TextField defaultValue={blogPostValues.slug} name="slug" placeholder="my-post-slug" title="Slug" />
            <TextField defaultValue={blogPostValues.title} name="title" title="Title" />
            <TextArea defaultValue={blogPostValues.excerpt} name="excerpt" title="Excerpt" />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField defaultValue={blogPostValues.publishedAt} name="publishedAt" title="Published At" type="date" />
              <TextField defaultValue={blogPostValues.readTime} name="readTime" placeholder="4 min read" title="Read Time" />
            </div>
            <TextField defaultValue={blogPostValues.tags} name="tags" placeholder="Spring Boot, API Design" title="Tags" />
            <TextArea defaultValue={blogPostValues.body} name="body" title="Body" />
            <SaveButton label="Save Blog Post" />
          </form>
        </AdminSection>
      </div>
    </div>
  );
}

async function fetchAdminCollections(portfolioId: string): Promise<AdminCollections> {
  const [projects, experience, education, skills, certifications, blogPosts, leadershipImpact, analyticsEvents] = await Promise.all([
    apiFetch<Project[]>(withPortfolioId("/projects", portfolioId), { auth: false }),
    apiFetch<Experience[]>(withPortfolioId("/experience", portfolioId), { auth: false }),
    apiFetch<Education[]>(withPortfolioId("/education", portfolioId), { auth: false }),
    apiFetch<Skill[]>(withPortfolioId("/skills", portfolioId), { auth: false }),
    apiFetch<Certification[]>(withPortfolioId("/certifications", portfolioId), { auth: false }),
    apiFetch<BlogPost[]>(withPortfolioId("/blog", portfolioId), { auth: false }),
    apiFetch<LeadershipImpact[]>(withPortfolioId("/leadership-impact", portfolioId), { auth: false }),
    apiFetch<AnalyticsEvent[]>("/analytics/events?limit=100").catch(() => []),
  ]);

  return {
    analyticsEvents,
    blogPosts,
    certifications,
    education: sortByDisplayDateDesc(education),
    experience: sortJourneyByStartDateAsc(experience),
    leadershipImpact: sortByDisplayOrder(leadershipImpact),
    projects,
    skills,
  };
}

function AdminSectionNavigation({
  activeSection,
  collections,
}: {
  activeSection: AdminSectionId;
  collections: AdminCollections;
}) {
  return (
    <nav aria-label="Admin sections" className="surface rounded-lg p-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {adminSections.map((section) => {
          const isActive = section.id === activeSection;
          const count = getSectionCount(section.id, collections);

          return (
            <Link
              className={`focus-ring flex min-h-12 items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-electric-500/70 bg-electric-500/12 text-white"
                  : "border-white/10 bg-navy-950/70 text-slate-300 hover:border-electric-500/50 hover:text-white"
              }`}
              href={`/admin/${section.id}`}
              key={section.id}
            >
              <span>{section.label}</span>
              {count === null ? null : (
                <span className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-slate-300">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function getSectionCount(sectionId: AdminSectionId, collections: AdminCollections): number | null {
  switch (sectionId) {
    case "blog":
      return collections.blogPosts.length;
    case "certifications":
      return collections.certifications.length;
    case "education":
      return collections.education.length;
    case "journey":
      return collections.experience.length;
    case "leadership-impact":
      return collections.leadershipImpact.length;
    case "profile":
      return null;
    case "projects":
      return collections.projects.length;
    case "skills":
      return collections.skills.length;
    case "visitors":
      return collections.analyticsEvents.length;
  }
}

function AdminSection({
  activeSection,
  children,
  sectionId,
  title,
}: {
  activeSection: AdminSectionId;
  children: React.ReactNode;
  sectionId: AdminSectionId;
  title: string;
}) {
  if (activeSection !== sectionId) {
    return null;
  }

  return (
    <section className="surface rounded-lg p-5">
      <h2 className="mb-5 text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function StatusBar({ state }: { state: SaveState }) {
  return (
    <div className="surface min-h-14 rounded-lg px-5 py-4 text-sm text-slate-300" role="status">
      {state.message || "Use the forms below to create, update, or soft-delete backend-managed portfolio content."}
    </div>
  );
}

function VisitEventList({ events }: { events: AnalyticsEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-white/10 px-3 py-3 text-sm text-slate-400">
        No visit events recorded yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {events.map((event) => (
        <article className="rounded-md border border-white/10 bg-navy-950/80 p-4" key={event.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-electric-500/40 bg-electric-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-electric-500">
                  {formatEventType(event.eventType)}
                </span>
                <span className="text-xs text-slate-400">{formatVisitDate(event.createdAt)}</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-white">{event.path || "/"}</h3>
              <p className="mt-1 text-sm text-slate-400">{event.pageTitle || "Untitled page"}</p>
            </div>
            <div className="grid gap-1 text-sm text-slate-300 lg:text-right">
              <span>{formatLocation(event)}</span>
              <span>{event.deviceType || "Unknown device"} / {event.browser || "Unknown browser"}</span>
            </div>
          </div>

          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
            <VisitDetail label="Referrer" value={formatReferrer(event.referrer)} />
            <VisitDetail label="IP" value={event.ipAddress || "Unknown"} />
            <VisitDetail label="Target" value={event.targetLabel || event.targetUrl || "None"} />
            <VisitDetail label="Visitor ID" value={event.visitorId || "Unknown"} />
          </dl>
        </article>
      ))}
    </div>
  );
}

function VisitDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-black/20 px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-slate-300" title={value}>{value}</dd>
    </div>
  );
}

function EditableList<T extends { id: number }>({
  emptyLabel,
  getMeta,
  getTitle,
  items,
  onDelete,
  onEdit,
}: {
  emptyLabel: string;
  getMeta: (item: T) => string;
  getTitle: (item: T) => string;
  items: T[];
  onDelete: (item: T) => void;
  onEdit: (item: T) => void;
}) {
  return (
    <div className="mb-5 grid gap-2">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 px-3 py-3 text-sm text-slate-400">
          {emptyLabel}
        </p>
      ) : (
        items.map((item) => (
          <article
            className="grid gap-3 rounded-md border border-white/10 bg-navy-950/80 p-3 sm:grid-cols-[1fr_auto]"
            key={item.id}
          >
            <div>
              <p className="text-sm font-semibold text-white">{getTitle(item)}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">{getMeta(item)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="focus-ring inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-xs font-semibold text-slate-200 transition hover:border-electric-500/70 hover:text-white"
                onClick={() => onEdit(item)}
                type="button"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                className="focus-ring inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-danger-500/30 px-3 text-xs font-semibold text-danger-200 transition hover:border-danger-500 hover:text-white"
                onClick={() => onDelete(item)}
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function FormModeLabel({ id, label, onNew }: { id: string; label: string; onNew: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-white/10 bg-navy-950/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {id ? `Editing ${label} #${id}` : `Create new ${label}`}
      </p>
      <button
        className="focus-ring inline-flex min-h-9 w-fit items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-xs font-semibold text-slate-200 transition hover:border-electric-500/70 hover:text-white"
        onClick={onNew}
        type="button"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New</span>
      </button>
    </div>
  );
}

function HiddenId({ value }: { value: string }) {
  return <input name="id" type="hidden" value={value} />;
}

function TextField({
  defaultValue,
  name,
  placeholder,
  required = false,
  title,
  type = "text",
}: {
  defaultValue?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  title: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-white">
      {title}
      <input
        className="focus-ring min-h-11 rounded-md border border-white/10 bg-navy-950 px-3 text-white placeholder:text-slate-500"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextArea({
  defaultValue,
  name,
  placeholder,
  required = false,
  title,
}: {
  defaultValue?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  title: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-white">
      {title}
      <textarea
        className="focus-ring min-h-28 resize-y rounded-md border border-white/10 bg-navy-950 px-3 py-3 text-white placeholder:text-slate-500"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SelectField({
  defaultValue,
  name,
  options,
  title,
}: {
  defaultValue: string;
  name: string;
  options: string[];
  title: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-white">
      {title}
      <select
        className="focus-ring min-h-11 rounded-md border border-white/10 bg-navy-950 px-3 text-white"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  defaultChecked,
  name,
  title,
}: {
  defaultChecked: boolean;
  name: string;
  title: string;
}) {
  return (
    <label className="flex items-center gap-3 text-sm font-semibold text-white">
      <input className="h-4 w-4 accent-electric-500" defaultChecked={defaultChecked} name={name} type="checkbox" />
      {title}
    </label>
  );
}

function SaveButton({ label }: { label: string }) {
  return (
    <button
      className="focus-ring inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-electric-600"
      type="submit"
    >
      <Save className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function formatEventType(value: string): string {
  return value.replace(/_/g, " ");
}

function formatVisitDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatLocation(event: AnalyticsEvent): string {
  return [event.city, event.region, event.country].filter(Boolean).join(", ") || "Unknown location";
}

function formatReferrer(value?: string | null): string {
  if (!value) {
    return "Direct";
  }

  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}

function textValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function listValue(formData: FormData, key: string): string[] {
  return textValue(formData, key)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullableTextValue(formData: FormData, key: string): string | null {
  const value = textValue(formData, key);
  return value || null;
}

function nullableListValue(formData: FormData, key: string): string[] | null {
  const value = listValue(formData, key);
  return value.length > 0 ? value : null;
}

function nullableNumberValue(formData: FormData, key: string): number | null {
  const value = textValue(formData, key);
  if (!value) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sortByDisplayOrder<T extends { displayOrder?: number | null; id: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftOrder = left.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.displayOrder ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.id - right.id;
  });
}

function sortJourneyByStartDateAsc(items: Experience[]): Experience[] {
  return [...items].sort((left, right) => {
    const dateDifference = dateSortValue(left.startDate) - dateSortValue(right.startDate);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return left.id - right.id;
  });
}

function formatJourneyRange(item: Experience): string {
  const start = formatJourneyDate(item.startDate);
  const end = item.current ? "Present" : formatJourneyDate(item.endDate);
  return end ? `${start} - ${end}` : start;
}

function formatJourneyDate(value?: string | null): string {
  const normalized = value?.trim();
  if (!normalized) return "";

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function dateSortValue(value?: string | null): number {
  const normalized = value?.trim();
  if (!normalized) return Number.MAX_SAFE_INTEGER;

  const timestamp = Date.parse(normalized);
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function toProfileFormValues(profile: Profile | null): ProfileFormValues {
  if (!profile) {
    return emptyProfileFormValues;
  }

  return {
    collaborationLabel: textFormValue(profile.collaborationLabel),
    currentlyFocusedOn: listFormValue(profile.currentlyFocusedOn),
    cvUrl: textFormValue(profile.cvUrl),
    email: textFormValue(profile.email),
    fullName: textFormValue(profile.fullName),
    githubUrl: textFormValue(profile.githubUrl),
    heroText: textFormValue(profile.heroText),
    learningLabel: textFormValue(profile.learningLabel),
    linkedinUrl: textFormValue(profile.linkedinUrl),
    location: textFormValue(profile.location),
    phone: textFormValue(profile.phone),
    photoUrl: textFormValue(profile.photoUrl),
    portfolioUrl: textFormValue(profile.portfolioUrl),
    projectsCompleted: numberFormValue(profile.projectsCompleted),
    roles: listFormValue(profile.roles),
    specializedIn: listFormValue(profile.specializedIn),
    summary: textFormValue(profile.summary),
    title: textFormValue(profile.title),
    yearsExperience: numberFormValue(profile.yearsExperience),
  };
}

function toProjectFormValues(project: Project): ProjectFormValues {
  return {
    architecture: project.architecture,
    challenges: listFormValue(project.challenges),
    displayOrder: numberFormValue(project.displayOrder),
    githubUrl: textFormValue(project.githubUrl),
    id: String(project.id),
    lessonsLearned: listFormValue(project.lessonsLearned),
    liveDemoUrl: textFormValue(project.liveDemoUrl),
    problem: project.problem,
    results: listFormValue(project.results),
    screenshots: listFormValue(project.screenshots),
    technologies: listFormValue(project.technologies),
    title: project.title,
  };
}

function toExperienceFormValues(experience: Experience): ExperienceFormValues {
  return {
    company: experience.company,
    current: experience.current,
    description: experience.description,
    endDate: textFormValue(experience.endDate),
    id: String(experience.id),
    role: experience.role,
    startDate: experience.startDate,
    technologies: listFormValue(experience.technologies),
  };
}

function toEducationFormValues(education: Education): EducationFormValues {
  return {
    course: education.course,
    description: education.description,
    endDate: textFormValue(education.endDate),
    grade: education.grade,
    id: String(education.id),
    institution: education.institution,
    startDate: education.startDate,
  };
}

function toSkillFormValues(skill: Skill): SkillFormValues {
  return {
    category: skill.category,
    id: String(skill.id),
    level: skill.level,
    name: skill.name,
  };
}

function toCertificationFormValues(certification: Certification): CertificationFormValues {
  return {
    credentialUrl: textFormValue(certification.credentialUrl),
    dateIssued: certification.dateIssued,
    id: String(certification.id),
    issuer: certification.issuer,
    name: certification.name,
  };
}

function toLeadershipImpactFormValues(item: LeadershipImpact): LeadershipImpactFormValues {
  return {
    category: item.category,
    description: item.description,
    displayOrder: numberFormValue(item.displayOrder),
    id: String(item.id),
    impact: item.impact,
    metricLabel: item.metricLabel,
    metricValue: item.metricValue,
    tags: listFormValue(item.tags),
    title: item.title,
  };
}

function toBlogPostFormValues(post: BlogPost): BlogPostFormValues {
  return {
    body: post.body,
    excerpt: post.excerpt,
    id: String(post.id),
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    slug: post.slug,
    tags: listFormValue(post.tags),
    title: post.title,
  };
}

function textFormValue(value: string | null | undefined): string {
  return value ?? "";
}

function listFormValue(value: string[] | null | undefined): string {
  return value?.join(", ") ?? "";
}

function numberFormValue(value: number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}
