export type ApiResponse<T> = {
  message: string;
  code: string;
  data: T;
  timestamp?: string;
};

export type Profile = {
  id: number;
  portfolioId: string;
  fullName: string | null;
  title: string | null;
  roles: string[] | null;
  specializedIn: string[] | null;
  currentlyFocusedOn: string[] | null;
  heroText: string | null;
  summary: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  cvUrl?: string | null;
  photoUrl?: string | null;
  projectsCompleted: number | null;
  yearsExperience: number | null;
  learningLabel: string | null;
  collaborationLabel: string | null;
};

export type ResolvedProfile = Required<{
  [Key in keyof Profile]: NonNullable<Profile[Key]>;
}>;

export type Project = {
  id: number;
  portfolioId: string;
  title: string;
  problem: string;
  architecture: string;
  displayOrder?: number | null;
  screenshots: string[];
  technologies: string[];
  challenges: string[];
  results: string[];
  lessonsLearned: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
};

export type Skill = {
  id: number;
  portfolioId: string;
  name: string;
  category:
    | "Languages"
    | "Frontend"
    | "Backend"
    | "Database"
    | "Databases"
    | "DevOps"
    | "DevOps & Tools"
    | "Testing"
    | "Workflow"
    | "Artificial Intelligence"
    | "AI & Data";
  level: "Advanced" | "Strong" | "Growing";
};

export type Experience = {
  id: number;
  portfolioId: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  displayOrder?: number | null;
  technologies: string[];
};

export type Education = {
  id: number;
  portfolioId: string;
  institution: string;
  course: string;
  grade: string;
  startDate: string;
  endDate?: string;
  description: string;
  displayOrder?: number | null;
};

export type Certification = {
  id: number;
  portfolioId: string;
  name: string;
  issuer: string;
  dateIssued: string;
  credentialUrl?: string;
};

export type LeadershipImpact = {
  id: number;
  portfolioId: string;
  category: string;
  title: string;
  description: string;
  impact: string;
  metricValue: string;
  metricLabel: string;
  displayOrder?: number | null;
  tags: string[];
};

export type BlogPost = {
  id: number;
  portfolioId: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  body: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
