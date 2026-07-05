import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/portfolio-api";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts
    .map((post) => post.slug.trim())
    .filter(Boolean)
    .map((slug) => ({
      slug,
    }));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-semibold text-slate-300 transition hover:text-white"
          href="/blog"
        >
          <ArrowLeft className="h-4 w-4" />
          Blog
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden="true">/</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">{post.excerpt}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="surface mt-10 rounded-lg p-6">
          <p className="text-base leading-8 text-slate-300">{post.body}</p>
        </div>
      </article>
    </main>
  );
}
