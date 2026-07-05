import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageHero } from "@/components/page-hero";
import { formatDate } from "@/lib/format";
import { getBlogPosts } from "@/lib/portfolio-api";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main>
      <PageHero
        description="Short technical notes about clean API design, full-stack projects, and portfolio thinking."
        eyebrow="Blog"
        title="Writing that explains the engineering choices."
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-5">
          {posts.length > 0 ? (
            posts.map((post) => {
              const slug = post.slug.trim();

              return (
                <article className="surface rounded-lg p-5 transition hover:border-electric-500/50" key={post.id}>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span aria-hidden="true">/</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-white">{post.title || "Untitled post"}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {slug ? (
                    <Link
                      className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md text-sm font-semibold text-electric-500 transition hover:text-white"
                      href={`/blog/${slug}`}
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </article>
              );
            })
          ) : (
            <EmptyState
              description="Insert blog records into PostgreSQL to populate this page through GET /blog."
              title="No blog posts found yet"
            />
          )}
        </div>
      </section>
    </main>
  );
}
