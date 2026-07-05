import type { ResolvedProfile } from "@/types/portfolio";

export function ProfilePhotoCard({ profile }: { profile: ResolvedProfile }) {
  return (
    <div className="surface relative h-[360px] overflow-hidden rounded-lg p-0 sm:h-[505px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-35" />
      <div className="relative grid h-full place-items-center">
        {profile.photoUrl ? (
          <img
            alt={profile.fullName}
            className="-translate-y-5 h-[430px] w-auto max-w-none object-contain sm:-translate-y-8 sm:h-[610px]"
            src={profile.photoUrl}
          />
        ) : (
          <div className="grid h-48 w-48 place-items-center rounded-full border border-electric-500/30 bg-navy-950 text-6xl font-bold text-electric-500 shadow-glow sm:h-64 sm:w-64 sm:text-7xl">
            {getInitials(profile.fullName)}
          </div>
        )}
        <div className="absolute bottom-2 left-1/2 inline-flex w-[calc(100%-1rem)] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-white/10 bg-navy-950/90 px-4 py-2 text-center text-xs font-semibold text-slate-200 sm:bottom-1 sm:w-auto">
          <span className="h-2 w-2 rounded-full bg-success-500" />
          Available for opportunities
        </div>
      </div>
    </div>
  );
}

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
