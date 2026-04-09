const IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

let loadPromise: Promise<void> | null = null;

/** Loads the YouTube IFrame API once; safe to call from multiple components. */
export function ensureYoutubeIframeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const w = window as Window & {
    YT?: { Player: new (id: string, options: unknown) => unknown };
    onYouTubeIframeAPIReady?: () => void;
  };

  if (w.YT?.Player) return Promise.resolve();

  if (!loadPromise) {
    loadPromise = new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        prev?.();
        finish();
      };

      const existing = document.querySelector(
        `script[src="${IFRAME_API_SRC}"]`,
      );
      if (!existing) {
        const tag = document.createElement("script");
        tag.src = IFRAME_API_SRC;
        document.head.appendChild(tag);
      }

      if (w.YT?.Player) {
        finish();
        return;
      }

      const poll = window.setInterval(() => {
        if (w.YT?.Player) {
          window.clearInterval(poll);
          finish();
        }
      }, 50);

      window.setTimeout(() => window.clearInterval(poll), 20_000);
    });
  }

  return loadPromise;
}
