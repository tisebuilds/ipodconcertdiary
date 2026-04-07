"use client";

import Image from "next/image";
import { ProgressBar } from "@/components/ProgressBar";
import { useIpod } from "@/components/IpodContext";

export function NowPlayingView() {
  const {
    currentConcert,
    positionLabel,
    isPlaying,
    elapsedMs,
    durationMs,
    progress,
  } = useIpod();

  if (!currentConcert) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-[11px] text-white/50">
        No concerts
      </div>
    );
  }

  const { artist, highlightSong, photo, accentColor, emoji, bg } = currentConcert;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black text-white">
      <div
        className="relative z-10 flex shrink-0 items-center justify-between px-2 py-1"
        style={{
          background: "linear-gradient(180deg, #4a90d9 0%, #2770c8 100%)",
        }}
      >
        <span className="text-[11px] font-bold text-white">Now Playing</span>
        <span className="text-[9px] font-normal text-white/40">
          {positionLabel}
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {photo ? (
          <div className="relative h-full w-full bg-black">
            <Image
              src={photo.startsWith("/") ? photo : `/concerts/${photo}`}
              alt={artist}
              fill
              className="object-contain"
              sizes="220px"
              priority
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: bg }}
          >
            <span className="select-none text-[56px] leading-none drop-shadow-md">
              {emoji}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-2 pb-2 pt-3">
        <div className="text-[12px] font-bold leading-tight text-white">
          {artist}
        </div>
        <div className="mt-0.5 text-[10px] font-normal text-white/50">
          {highlightSong}
        </div>
        <div className="mt-2">
          <ProgressBar
            accentColor={accentColor}
            progress={progress}
            elapsedMs={elapsedMs}
            durationMs={durationMs}
          />
        </div>
        {!isPlaying ? (
          <div className="mt-1 text-center text-[8px] text-white/35">Paused</div>
        ) : null}
      </div>
    </div>
  );
}
