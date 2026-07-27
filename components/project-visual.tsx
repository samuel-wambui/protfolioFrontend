type ProjectVisualProps = {
  screenshots: string[];
};

export function ProjectVisual({ screenshots }: ProjectVisualProps) {
  const isSingleScreenshot = screenshots.length === 1;

  return (
    <div className={isSingleScreenshot ? "grid justify-items-center gap-5" : "grid gap-5 md:grid-cols-2 xl:grid-cols-3"}>
      {screenshots.map((screenshot, index) => (
        <figure
          className={`surface w-full overflow-hidden rounded-lg ${isSingleScreenshot ? "max-w-3xl" : ""}`}
          key={`${screenshot}-${index}`}
        >
          {isImageUrl(screenshot) ? (
            <a
              aria-label={`Open project screenshot ${index + 1}`}
              className="grid h-64 place-items-center bg-black/30 p-3 sm:h-80 lg:h-96"
              href={screenshot}
              rel="noreferrer"
              target="_blank"
            >
              <img alt={`Project screenshot ${index + 1}`} className="max-h-full max-w-full object-contain" src={screenshot} />
            </a>
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
          <figcaption className="break-all border-t border-white/10 px-4 py-3 text-sm font-semibold text-white">
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
