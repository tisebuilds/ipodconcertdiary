"use client";

import { cn } from "@/lib/cn";
import { ConcertListView } from "@/components/ConcertListView";
import { MenuView } from "@/components/MenuView";
import { NowPlayingView } from "@/components/NowPlayingView";
import { useIpod } from "@/components/IpodContext";

type IpodScreenProps = {
  className?: string;
};

export function IpodScreen({ className }: IpodScreenProps) {
  const { view, transitionDir } = useIpod();

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden rounded-[3px] bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]",
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
