import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-success-500">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you opened does not exist in this portfolio.</p>
        <Link
          className="focus-ring mt-8 inline-flex min-h-11 items-center rounded-md bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-electric-600"
          href="/"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}
