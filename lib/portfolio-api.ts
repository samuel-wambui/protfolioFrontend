import {
  emptyBlogPosts,
  emptyCertifications,
  emptyEducation,
  emptyExperience,
  emptyLeadershipImpact,
  emptyProfile,
  emptyProjects,
  emptySkills,
} from "@/data/portfolio-fallbacks";
import { logApiAction } from "@/lib/api-debug";
import { sortByDisplayDateDesc } from "@/lib/date-order";
import { getConfiguredPortfolioId, withPortfolioId } from "@/lib/portfolio-id";
import type {
  ApiResponse,
  BlogPost,
  Certification,
  ContactPayload,
  Education,
  Experience,
  LeadershipImpact,
  Profile,
  Project,
  Skill,
} from "@/types/portfolio";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  // Local backend:
  // "http://localhost:8080/api";
  "https://portfoliobackend-ltak.onrender.com/api";

async function requestResource<T>(
  path: string,
  fallback: T,
  portfolioId: string = getConfiguredPortfolioId(),
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${withPortfolioId(path, portfolioId)}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as ApiResponse<T> | T;
    return isApiResponse(payload) ? payload.data : payload;
  } catch {
    return fallback;
  }
}

function isApiResponse<T>(payload: ApiResponse<T> | T): payload is ApiResponse<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    "code" in payload &&
    "data" in payload
  );
}

export async function getProfile(portfolioId?: string): Promise<Profile | null> {
  return requestResource<Profile | null>("/profile", emptyProfile, portfolioId);
}

export async function getProjects(portfolioId?: string): Promise<Project[]> {
  return requestResource<Project[]>("/projects", emptyProjects, portfolioId);
}

export async function getProjectById(id: string, portfolioId?: string): Promise<Project | undefined> {
  const items = await getProjects(portfolioId);
  return items.find((project) => String(project.id) === id);
}

export async function getSkills(portfolioId?: string): Promise<Skill[]> {
  return requestResource<Skill[]>("/skills", emptySkills, portfolioId);
}

export async function getExperience(portfolioId?: string): Promise<Experience[]> {
  const items = await requestResource<Experience[]>("/experience", emptyExperience, portfolioId);
  return sortByDisplayDateDesc(items);
}

export async function getEducation(portfolioId?: string): Promise<Education[]> {
  const items = await requestResource<Education[]>("/education", emptyEducation, portfolioId);
  return sortByDisplayDateDesc(items);
}

export async function getCertifications(portfolioId?: string): Promise<Certification[]> {
  return requestResource<Certification[]>("/certifications", emptyCertifications, portfolioId);
}

export async function getLeadershipImpact(portfolioId?: string): Promise<LeadershipImpact[]> {
  const items = await requestResource<LeadershipImpact[]>("/leadership-impact", emptyLeadershipImpact, portfolioId);
  return sortByDisplayOrder(items);
}

export async function getBlogPosts(portfolioId?: string): Promise<BlogPost[]> {
  return requestResource<BlogPost[]>("/blog", emptyBlogPosts, portfolioId);
}

export async function getBlogPostBySlug(slug: string, portfolioId?: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts(portfolioId);
  return posts.find((post) => post.slug.trim() === slug.trim());
}

export async function sendContactMessage(payload: ContactPayload): Promise<ApiResponse<null>> {
  const method = "POST";
  const path = "/contact";
  logApiAction("request", { body: payload, method, path });

  const response = await fetch(`${API_BASE_URL}/contact`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = (await response.json()) as ApiResponse<null>;

  if (!response.ok) {
    logApiAction("error", { body: payload, method, path, payload: responsePayload, status: response.status });
    throw new Error("Contact request failed");
  }

  logApiAction("success", { method, path, payload: responsePayload, status: response.status });
  return responsePayload;
}

function sortByDisplayOrder<TItem extends { displayOrder?: number | null; id: number }>(items: TItem[]): TItem[] {
  return [...items].sort((left, right) => {
    const leftOrder = left.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.displayOrder ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.id - right.id;
  });
}
