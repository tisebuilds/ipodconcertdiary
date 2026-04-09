"use client";

import { cn } from "@/lib/cn";
import { ConcertListView } from "@/components/ConcertListView";
import { MenuView } from "@/components/MenuView";
import { NowPlayingView } from "@/components/NowPlayingView";
import { useIpod } from "@/components/IpodContext";

type IpodScreenProps = {
  className?: string;
  /** When true, no inner bezel — use when the screen is already inside a framed card (e.g. mobile). */
  embedded?: boolean;
};

export function IpodScreen({ className, embedded = false }: IpodScreenProps) {
  const { view, transitionDir } = useIpod();

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden bg-black",
        embedded
          ? "rounded-none border-0"
          : "rounded-[3px] border border-[#222]",
        className,
      )}
    >
      <div
        key={view}
        className={cn(
          "relative z-0 flex min-h-0 flex-1 flex-col",
          transitionDir === "forward"
            ? "animate-slide-forward"
            : "animate-slide-back",
        )}
      >
        {view === "menu" ? <MenuView /> : null}
        {view === "list" ? <ConcertListView /> : null}
        {view === "nowPlaying" ? <NowPlayingView /> : null}
      </div>
      {/* Glass cover: diagonal highlight like physical LCD stack */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1]",
          embedded ? "rounded-none" : "rounded-[2px]",
        )}
        style={{
          background: `linear-gradient(
            128deg,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.16) 22%,
            rgba(255, 255, 255, 0.05) 36%,
            transparent 52%
          )`,
          boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        }}
        aria-hidden
      />
    </div>
  );
}
