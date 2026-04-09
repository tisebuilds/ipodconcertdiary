"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ensureYoutubeIframeAPI } from "@/lib/youtube-iframe-api";

const PLAYER_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

type YTPlayerLike = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
};

type YTNamespace = {
  Player: new (
    elId: string,
    options: {
      videoId: string;
      width: string;
      height: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayerLike }) => void;
        onStateChange?: (e: { data: number; target: YTPlayerLike }) => void;
      };
    },
  ) => YTPlayerLike;
};

export function ConcertYoutubePlayer({
  videoId,
  isPlaying,
  onEnded,
  onProgress,
}: {
  videoId: string;
  isPlaying: boolean;
  onEnded: () => void;
  onProgress?: (elapsedMs: number, durationMs: number) => void;
}) {
  const reactId = useId().replace(/:/g, "");
  const containerId = `yt-player-${reactId}`;
  const playerRef = useRef<YTPlayerLike | null>(null);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let player: YTPlayerLike | null = null;

    void ensureYoutubeIframeAPI().then(() => {
      if (cancelled) return;
      const YT = (window as unknown as { YT?: YTNamespace }).YT;
      if (!YT?.Player) return;

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      player = new YT.Player(containerId, {
        videoId,
        width: "200",
        height: "113",
        playerVars: {
          playsinline: 1,
          controls: 0,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          ...(origin ? { origin } : {}),
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            playerRef.current = e.target;
            setApiReady(true);
          },
          onStateChange: (e) => {
            if (e.data === PLAYER_STATE.ENDED) onEnded();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      setApiReady(false);
      playerRef.current = null;
      try {
        player?.destroy();
      } catch {
        /* noop */
      }
    };
  }, [videoId, onEnded, containerId]);

  useEffect(() => {
    if (!apiReady) return;
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isPlaying) p.playVideo();
      else p.pauseVideo();
    } catch {
      /* noop */
    }
  }, [isPlaying, apiReady]);

  useEffect(() => {
    if (!isPlaying || !onProgress) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const d = p.getDuration();
        const t = p.getCurrentTime();
        if (d > 0 && Number.isFinite(t)) {
          onProgress(t * 1000, d * 1000);
        }
      } catch {
        /* noop */
      }
    }, 300);
    return () => window.clearInterval(id);
  }, [isPlaying, onProgress]);

  /* Player stays in DOM for IFrame API playback; video is not shown (audio-only UX). */
  return (
    <div
      className="pointer-events-none fixed left-[-9999px] top-0 -z-10 opacity-0"
      aria-hidden
    >
      <div id={containerId} className="h-[113px] w-[200px]" />
    </div>
  );
}
