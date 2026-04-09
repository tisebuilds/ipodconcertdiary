"use client";

import { useEffect, useRef } from "react";
import { tryPlayBootChime } from "@/lib/ipod-sfx";

/**
 * Plays a one-time boot chime after the first user gesture (autoplay policy).
 * Repeat visits are silent via localStorage in tryPlayBootChime.
 */
export function IpodBootChime() {
  const playedRef = useRef(false);

  useEffect(() => {
    const onFirstGesture = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      tryPlayBootChime();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, []);

  return null;
}
