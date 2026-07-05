import type { Experience } from "@/types/portfolio";
import { formatDateRange } from "@/lib/format";

type TimelineProps = {
  items: Experience[];
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="grid gap-5">
      {items.map((item) => (
        <article className="surface rounded-lg p-5" key={item.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{item.role}</h3>
              <p className="mt-1 text-sm font-semibold text-electric-500">{item.company}</p>
            </div>
            <span className="w-fit rounded-md border border-white/10 px-3 py-1 text-sm text-slate-300">
              {formatDateRange(item.startDate, item.current ? undefined : item.endDate)}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{item.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.technologies.map((technology) => (
              <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300" key={technology}>
                {technology}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
