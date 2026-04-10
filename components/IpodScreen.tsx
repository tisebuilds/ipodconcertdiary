"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { MOBILE_SCREEN_OUTER_RADIUS_CLASS } from "@/lib/mobile-screen-frame";
import { ConcertListView } from "@/components/ConcertListView";
import { MenuView } from "@/components/MenuView";
import { NowPlayingView } from "@/components/NowPlayingView";
import { useIpod } from "@/components/IpodContext";

type IpodScreenProps = {
  className?: string;
  /** When true, no inner bezel — use when the screen is already inside a framed card (e.g. mobile). */
  embedded?: boolean;
};

const ease = [0.25, 0.9, 0.35, 1] as const;

export function IpodScreen({ className, embedded = false }: IpodScreenProps) {
  const { view, transitionDir } = useIpod();
  const reduceMotion = useReducedMotion();

  const duration =
    reduceMotion ? 0 : transitionDir === "forward" ? 0.22 : 0.2;

  const variants = reduceMotion
    ? {
        enter: { x: 0, opacity: 1, zIndex: 0 },
        center: { x: 0, opacity: 1, zIndex: 0 },
        exit: { x: 0, opacity: 1, zIndex: 0 },
      }
    : {
        enter: (dir: "forward" | "back") => ({
          x: dir === "forward" ? "100%" : "-100%",
          opacity: 0.92,
          zIndex: dir === "forward" ? 1 : 0,
        }),
        center: { x: 0, opacity: 1, zIndex: 0 },
        exit: (dir: "forward" | "back") => ({
          x: dir === "forward" ? "-100%" : "100%",
          opacity: 0.92,
          zIndex: dir === "forward" ? 0 : 1,
        }),
      };

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col overflow-hidden bg-black",
        embedded
          ? cn("border-0", MOBILE_SCREEN_OUTER_RADIUS_CLASS)
          : "rounded-[4px] border border-[#222]",
        className,
      )}
    >
      <div className="relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence initial={false} custom={transitionDir} mode="sync">
          <motion.div
            key={view}
            custom={transitionDir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration, ease }}
            className="absolute inset-0 flex min-h-0 flex-col font-ipod will-change-transform"
          >
            {view === "menu" ? <MenuView /> : null}
            {view === "list" ? <ConcertListView /> : null}
            {view === "nowPlaying" ? <NowPlayingView /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Glass cover: diagonal highlight like physical LCD stack */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1]",
          embedded ? MOBILE_SCREEN_OUTER_RADIUS_CLASS : "rounded-[4px]",
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
