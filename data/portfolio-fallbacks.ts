import type {
  BlogPost,
  Certification,
  Education,
  Experience,
  LeadershipImpact,
  Profile,
  Project,
  ResolvedProfile,
  Skill,
} from "@/types/portfolio";

export const defaultProfile: ResolvedProfile = {
  id: 0,
  portfolioId: "PORT001",
  fullName: "Samuel Ngari",
  title: "Full-Stack Developer",
  roles: ["Automation Engineer", "AI Enthusiast", "Backend Developer"],
  specializedIn: ["Java", "Spring Boot", "React", "Next.js", "PostgreSQL", "AI & Automation"],
  currentlyFocusedOn: ["AI-powered automation systems", "Building production-grade products that scale"],
  heroText: "Building intelligent solutions that create impact.",
  summary: "I build scalable web systems, automate business processes, and explore AI to solve real-world problems.",
  email: "samuelngari254@gmail.com",
  phone: "",
  location: "Nairobi, Kenya",
  githubUrl: "https://github.com/samuelngari",
  linkedinUrl: "https://www.linkedin.com/",
  portfolioUrl: "http://localhost:3000",
  cvUrl: "#",
  photoUrl: "/images/samuel-ngari-profile.png",
  projectsCompleted: 20,
  yearsExperience: 3,
  learningLabel: "Continuous Learning",
  collaborationLabel: "Open to Collaboration",
};

export const emptyProfile: Profile | null = defaultProfile;
export const emptyProjects: Project[] = [];
export const emptySkills: Skill[] = [];
export const emptyExperience: Experience[] = [];
export const emptyEducation: Education[] = [];
export const emptyCertifications: Certification[] = [];
export const emptyLeadershipImpact: LeadershipImpact[] = [];
export const emptyBlogPosts: BlogPost[] = [];

export function resolveProfile(
  profile: Profile | null,
  fallback: ResolvedProfile = defaultProfile,
): ResolvedProfile {
  if (!profile) {
    return fallback;
  }

  return {
    id: profile.id ?? fallback.id,
    portfolioId: textOrFallback(profile.portfolioId, fallback.portfolioId),
    fullName: textOrFallback(profile.fullName, fallback.fullName),
    title: textOrFallback(profile.title, fallback.title),
    roles: listOrFallback(profile.roles, fallback.roles),
    specializedIn: listOrFallback(profile.specializedIn, fallback.specializedIn),
    currentlyFocusedOn: listOrFallback(profile.currentlyFocusedOn, fallback.currentlyFocusedOn),
    heroText: textOrFallback(profile.heroText, fallback.heroText),
    summary: textOrFallback(profile.summary, fallback.summary),
    email: textOrFallback(profile.email, fallback.email),
    phone: textOrFallback(profile.phone, fallback.phone),
    location: textOrFallback(profile.location, fallback.location),
    githubUrl: textOrFallback(profile.githubUrl, fallback.githubUrl),
    linkedinUrl: textOrFallback(profile.linkedinUrl, fallback.linkedinUrl),
    portfolioUrl: textOrFallback(profile.portfolioUrl, fallback.portfolioUrl),
    cvUrl: textOrFallback(profile.cvUrl, fallback.cvUrl),
    photoUrl: textOrFallback(profile.photoUrl, fallback.photoUrl),
    projectsCompleted: numberOrFallback(profile.projectsCompleted, fallback.projectsCompleted),
    yearsExperience: numberOrFallback(profile.yearsExperience, fallback.yearsExperience),
    learningLabel: textOrFallback(profile.learningLabel, fallback.learningLabel),
    collaborationLabel: textOrFallback(profile.collaborationLabel, fallback.collaborationLabel),
  };
}

function textOrFallback(value: string | null | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized || fallback;
}

function listOrFallback(value: string[] | null | undefined, fallback: string[]): string[] {
  const normalized = value?.map((item) => item.trim()).filter(Boolean) ?? [];
  return normalized.length > 0 ? normalized : fallback;
}

function numberOrFallback(value: number | null | undefined, fallback: number): number {
  return value ?? fallback;
}
