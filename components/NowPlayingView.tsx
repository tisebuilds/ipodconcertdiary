"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { AudioMuteButton } from "@/components/AudioMuteButton";
import { ConcertYoutubePlayer } from "@/components/ConcertYoutubePlayer";
import { useIpod } from "@/components/IpodContext";
import { concertPhotoSrc, parseYoutubeVideoId } from "@/lib/concert-utils";

export function NowPlayingView() {
  const {
    currentConcert,
    positionLabel,
    isPlaying,
    elapsedMs,
    durationMs,
    progress,
    playPause,
    advanceNowPlayingTrack,
  } = useIpod();

  const photoSrc = concertPhotoSrc(currentConcert?.photo ?? null);
  const [artBroken, setArtBroken] = useState(false);
  const [ytTimes, setYtTimes] = useState({ elapsedMs: 0, durationMs: 0 });

  const ytId = currentConcert
    ? parseYoutubeVideoId(currentConcert.youtubeVideoId)
    : null;

  useEffect(() => {
    setArtBroken(false);
  }, [currentConcert?.id, photoSrc]);

  useEffect(() => {
    setYtTimes({ elapsedMs: 0, durationMs: 0 });
  }, [currentConcert?.id, ytId]);

  const onYoutubeEnded = useCallback(() => {
    advanceNowPlayingTrack();
  }, [advanceNowPlayingTrack]);

  const onYoutubeProgress = useCallback(
    (eMs: number, dMs: number) => {
      setYtTimes({ elapsedMs: eMs, durationMs: dMs });
    },
    [],
  );

  if (!currentConcert) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-[11px] text-white/50">
        No concerts
      </div>
    );
  }

  const { artist, highlightSong, accentColor, emoji, bg } = currentConcert;
  const showArt = Boolean(photoSrc) && !artBroken;

  const useYtProgress = Boolean(ytId && ytTimes.durationMs > 0);
  const progressForBar = useYtProgress
    ? Math.min(1, ytTimes.elapsedMs / ytTimes.durationMs)
    : progress;
  const elapsedForBar = useYtProgress ? ytTimes.elapsedMs : elapsedMs;
  const durationForBar = useYtProgress ? ytTimes.durationMs : durationMs;

  const tapClass =
    "cursor-pointer border-0 bg-transparent p-0 text-left font-inherit text-inherit transition-colors duration-150 ease-out hover:bg-white/[0.04] active:bg-white/[0.07]";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black text-white">
      <div className="relative z-10 flex shrink-0 items-center justify-between bg-[#2770c8] px-2 py-1">
        <span className="flex min-w-0 items-center gap-0.5">
          <AudioMuteButton variant="dark" />
          <span className="text-[11px] font-bold text-white">Now Playing</span>
        </span>
        <span className="text-[9px] font-normal text-white/40">
          {positionLabel}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <button
          type="button"
          className={`relative flex min-h-0 flex-1 flex-col ${tapClass}`}
          onClick={playPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <div className="relative min-h-0 flex-1">
            {showArt && photoSrc ? (
              <div className="relative h-full w-full bg-black">
                <Image
                  key={`${currentConcert.id}:${photoSrc}`}
                  src={photoSrc}
                  alt={artist}
                  fill
                  className="object-contain"
                  sizes="220px"
                  priority
                  unoptimized
                  onError={() => setArtBroken(true)}
                />
              </div>
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: bg }}
              >
                <span className="select-none text-[56px] leading-none">
                  {emoji}
                </span>
              </div>
            )}
          </div>
        </button>

        {ytId ? (
          <ConcertYoutubePlayer
            videoId={ytId}
            isPlaying={isPlaying}
            onEnded={onYoutubeEnded}
            onProgress={onYoutubeProgress}
          />
        ) : null}

        <button
          type="button"
          className={`relative z-10 shrink-0 bg-black/90 px-2 pb-2 pt-3 ${tapClass}`}
          onClick={playPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <div className="text-[12px] font-bold leading-tight text-white">
            {artist}
          </div>
          <div className="mt-0.5 text-[10px] font-normal text-white/50">
            {highlightSong}
          </div>
          <div className="mt-2">
            <ProgressBar
              accentColor={accentColor}
              progress={progressForBar}
              elapsedMs={elapsedForBar}
              durationMs={durationForBar}
            />
          </div>
          {!isPlaying ? (
            <div className="mt-1 text-center text-[8px] text-white/35">
              Paused
            </div>
          ) : null}
        </button>
      </div>
    </div>
  );
}
