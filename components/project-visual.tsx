type ProjectVisualProps = {
  screenshots: string[];
};

export function ProjectVisual({ screenshots }: ProjectVisualProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {screenshots.map((screenshot, index) => (
        <figure className="surface overflow-hidden rounded-lg" key={`${screenshot}-${index}`}>
          {isImageUrl(screenshot) ? (
            <img alt={`Project screenshot ${index + 1}`} className="h-56 w-full object-cover" src={screenshot} />
          ) : (
            <>
              <div className="flex h-9 items-center gap-1.5 border-b border-white/10 bg-navy-900 px-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-success-500" />
              </div>
              <div className="min-h-44 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="h-3 w-24 rounded-sm bg-electric-500/60" />
                  <span className="h-7 w-7 rounded-md bg-success-500/20" />
                </div>
                <div className="grid gap-3">
                  <span className="h-16 rounded-md bg-white/8" />
                  <span className="h-3 w-10/12 rounded-sm bg-white/10" />
                  <span className="h-3 w-8/12 rounded-sm bg-white/10" />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[1, 2, 3].map((item) => (
                      <span
                        className={`h-12 rounded-md ${item === index + 1 ? "bg-electric-500/30" : "bg-white/8"}`}
                        key={item}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          <figcaption className="border-t border-white/10 px-4 py-3 text-sm font-semibold text-white">
            {screenshot}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function isImageUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/");
}
