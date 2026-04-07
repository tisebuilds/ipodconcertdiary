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
          "flex min-h-0 flex-1 flex-col",
          transitionDir === "forward"
            ? "animate-slide-forward"
            : "animate-slide-back",
        )}
      >
        {view === "menu" ? <MenuView /> : null}
        {view === "list" ? <ConcertListView /> : null}
        {view === "nowPlaying" ? <NowPlayingView /> : null}
      </div>
    </div>
  );
}
