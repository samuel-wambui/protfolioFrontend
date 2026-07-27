"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ProjectVisualProps = {
  screenshots: string[];
};

export function ProjectVisual({ screenshots }: ProjectVisualProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const imageScreenshots = useMemo(
    () => screenshots.map((screenshot, index) => ({ index, screenshot })).filter(({ screenshot }) => isImageUrl(screenshot)),
    [screenshots],
  );
  const activeScreenshot = activeIndex === null ? null : screenshots[activeIndex];
  const activeScreenshotLabel = activeIndex === null ? "" : `Screenshot ${activeIndex + 1}`;
  const canNavigate = imageScreenshots.length > 1;

  function showPreviousScreenshot() {
    setActiveIndex((currentIndex) => getAdjacentImageIndex(imageScreenshots, currentIndex, -1));
  }

  function showNextScreenshot() {
    setActiveIndex((currentIndex) => getAdjacentImageIndex(imageScreenshots, currentIndex, 1));
  }

  useEffect(() => {
    if (activeScreenshot === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        showPreviousScreenshot();
      }

      if (event.key === "ArrowRight") {
        showNextScreenshot();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScreenshot, imageScreenshots]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {screenshots.map((screenshot, index) => (
          <figure className="surface overflow-hidden rounded-lg" key={`${screenshot}-${index}`}>
            {isImageUrl(screenshot) ? (
              <button
                aria-label={`Open project screenshot ${index + 1}`}
                className="focus-ring grid h-40 w-full place-items-center bg-black/30 p-3 transition hover:bg-black/40 sm:h-44"
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <img alt={`Project screenshot ${index + 1}`} className="max-h-full max-w-full object-contain" src={screenshot} />
              </button>
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
              {isImageUrl(screenshot) ? `Screenshot ${index + 1}` : screenshot}
            </figcaption>
          </figure>
        ))}
      </div>

      {activeScreenshot && isImageUrl(activeScreenshot) ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
          role="dialog"
        >
          <div className="grid w-full max-w-6xl gap-3" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">{activeScreenshotLabel}</p>
              <button
                aria-label="Close screenshot preview"
                className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                onClick={() => setActiveIndex(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative grid max-h-[82vh] min-h-52 place-items-center overflow-hidden rounded-lg border border-white/10 bg-black/40 p-3">
              <img alt={activeScreenshotLabel} className="max-h-[78vh] max-w-full object-contain" src={activeScreenshot} />
              {canNavigate ? (
                <>
                  <button
                    aria-label="Previous screenshot"
                    className="focus-ring absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md border border-white/15 bg-black/55 text-white transition hover:bg-black/75"
                    onClick={showPreviousScreenshot}
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Next screenshot"
                    className="focus-ring absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md border border-white/15 bg-black/55 text-white transition hover:bg-black/75"
                    onClick={showNextScreenshot}
                    type="button"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function isImageUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/");
}

function getAdjacentImageIndex(
  imageScreenshots: Array<{ index: number; screenshot: string }>,
  currentIndex: number | null,
  direction: -1 | 1,
): number | null {
  if (currentIndex === null || imageScreenshots.length === 0) {
    return currentIndex;
  }

  const currentPosition = imageScreenshots.findIndex(({ index }) => index === currentIndex);

  if (currentPosition === -1) {
    return currentIndex;
  }

  const nextPosition = (currentPosition + direction + imageScreenshots.length) % imageScreenshots.length;
  return imageScreenshots[nextPosition].index;
}
