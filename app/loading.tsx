import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-16">
      <div className="grid justify-items-center gap-4">
        <span
          aria-label="Loading page"
          className="grid h-12 w-12 place-items-center rounded-md border border-blue-400/25 bg-blue-400/10 text-blue-200"
          role="status"
        >
          <LoaderCircle className="h-6 w-6 animate-spin" />
        </span>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-1/2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.75)]" />
        </div>
      </div>
    </main>
  );
}
