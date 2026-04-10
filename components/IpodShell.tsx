"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { ClickWheel } from "@/components/ClickWheel";
import { IpodScreen } from "@/components/IpodScreen";
import { LcdBezel } from "@/components/LcdBezel";
import { cn } from "@/lib/cn";

/** Fixed layout width for iPod nano–style shell (narrow + tall). */
const SHELL_WIDTH_PX = 236;

/** Corner radius language: chassis > LCD bezel > active glass (concentric product read). */
const SHELL_RADIUS_CLASS = "rounded-[6px]";

/** Flip: ~ease-out with a hint of ease-in at the start (less “modal”, more physical). */
const FLIP_EASE = [0.18, 0.045, 0.22, 1] as const;

/** Subtle mid-flip scale dip — paired with rotateY; keep close to 1 to avoid cartoon perspective. */
const FLIP_SCALE_MID = 0.987;

function useShellScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 600) {
        setScale(1);
        return;
      }
      const padded = Math.max(280, w - 24);
      setScale(Math.min(1, padded / SHELL_WIDTH_PX));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  if (target.closest('[contenteditable="true"]')) return true;
  return false;
}

const shellBodyStyle: CSSProperties = {
  width: SHELL_WIDTH_PX,
  /* Reference-style metal: soft body read + cylindrical edges + sharp right specular + rim shadow */
  background: `
    linear-gradient(
      155deg,
      rgba(255, 255, 255, 0.32) 0%,
      rgba(255, 255, 255, 0.08) 22%,
      transparent 46%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.16) 0%,
      transparent 16%
    ),
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 84%,
      rgba(255, 255, 255, 0.36) 90%,
      rgba(255, 255, 255, 0.68) 92.2%,
      rgba(255, 255, 255, 0.22) 93.6%,
      rgba(0, 0, 0, 0.28) 97%,
      rgba(0, 0, 0, 0.42) 100%
    ),
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--ipod-body-deep) 92%, #000) 0%,
      var(--ipod-body-edge) 11%,
      transparent 28%,
      transparent 72%,
      color-mix(in srgb, var(--ipod-body-edge) 88%, var(--ipod-body)) 84%,
      color-mix(in srgb, var(--ipod-body) 92%, #fff) 91%,
      var(--ipod-body-deep) 100%
    ),
    radial-gradient(
      ellipse 128% 118% at 48% 34%,
      color-mix(in srgb, var(--ipod-body) 96%, #fff) 0%,
      var(--ipod-body) 46%,
      color-mix(in srgb, var(--ipod-body) 72%, #000) 100%
    )
  `,
  boxShadow: `
    inset 5px 0 14px rgba(0, 0, 0, 0.2),
    inset -10px 0 18px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.26),
    inset 0 -1px 0 rgba(0, 0, 0, 0.14),
    inset 0 0 56px rgba(0, 0, 0, 0.08),
    2px 5px 8px -2px rgba(0, 0, 0, 0.3),
    5px 22px 58px -6px rgba(12, 16, 30, 0.1),
    10px 40px 88px -14px rgba(12, 18, 34, 0.05)
  `,
};

function AppleLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/apple-logo-white.png"
      alt=""
      width={48}
      height={56}
      draggable={false}
      className={cn("object-contain mix-blend-lighten", className)}
      aria-hidden
    />
  );
}

export function IpodShell() {
  const scale = useShellScale();
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  /** Avoid running scale keyframes on first paint (only after user has flipped once). */
  const [flipInteractionCount, setFlipInteractionCount] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      setFlipInteractionCount((n) => n + 1);
      setFlipped((f) => !f);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className="origin-center will-change-transform"
      style={{ transform: `scale(${scale})` }}
    >
      <span className="sr-only" aria-live="polite">
        {flipped ? "Showing back of device" : "Showing front of device"}
      </span>

      <div
        className="relative mx-auto"
        style={{ perspective: "1100px", width: SHELL_WIDTH_PX }}
      >
        <motion.div
          className="relative will-change-transform [transform-style:preserve-3d]"
          initial={false}
          animate={
            reduceMotion
              ? { rotateY: flipped ? 180 : 0, scale: 1 }
              : {
                  rotateY: flipped ? 180 : 0,
                  scale:
                    flipInteractionCount > 0
                      ? [1, FLIP_SCALE_MID, 1]
                      : 1,
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : flipInteractionCount > 0
                ? {
                    rotateY: { duration: 0.5, ease: FLIP_EASE },
                    scale: {
                      duration: 0.5,
                      times: [0, 0.5, 1],
                      ease: [FLIP_EASE, FLIP_EASE],
                    },
                  }
                : { rotateY: { duration: 0.5, ease: FLIP_EASE } }
          }
        >
          {/* Front */}
          <div
            className={cn(
              "relative border border-black/[0.09] px-3 pb-4 pt-5 [backface-visibility:hidden] [transform:translateZ(0.1px)]",
              SHELL_RADIUS_CLASS,
              flipped && "pointer-events-none",
            )}
            style={shellBodyStyle}
            aria-hidden={flipped}
          >
            <div
              className="pointer-events-none absolute right-5 top-2 h-[5px] w-[26px] rounded-full border border-black/20"
              style={{ background: "#b8b8c0" }}
              aria-hidden
            />

            <LcdBezel>
              <IpodScreen className="h-[272px]" />
            </LcdBezel>

            <div className="select-none py-1.5 text-center text-[9px] font-semibold tracking-[0.42em] opacity-0">
              iPod nano
            </div>

            <div className="mt-1 shrink-0">
              <ClickWheel />
            </div>
          </div>

          {/* Back */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center border border-black/[0.09] px-4 pb-5 pt-8 [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0.1px)]",
              SHELL_RADIUS_CLASS,
              !flipped && "pointer-events-none",
            )}
            style={shellBodyStyle}
            aria-hidden={!flipped}
          >
            {/* 5th gen Nano: video camera + mic in bottom-left (vertical pill, matches device reference) */}
            <div
              className="pointer-events-none absolute bottom-[6rem] left-3 z-10 flex h-[17px] w-[46px] origin-center -rotate-90 items-center justify-between rounded-full border border-white/35 bg-gradient-to-b from-[#ececee] to-[#9ea0a8] px-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_0_0_0.5px_rgba(0,0,0,0.12)]"
              aria-hidden
            >
              <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#050505] shadow-[inset_0_0_3px_rgba(255,255,255,0.12)] ring-[0.5px] ring-black/50" />
              <span className="mb-px mr-px h-[3px] w-[3px] rounded-full bg-[#1c1c1c]" />
            </div>

            <AppleLogo className="h-14 w-12" />
            <div className="ipod-back-etched-title mt-3 w-full text-center font-[system-ui] text-[22px] font-light tracking-[0.02em]">
              <p className="leading-none">iPod</p>
              <p className="mt-1.5 leading-tight">Concert Diary</p>
            </div>
            <div className="mt-auto w-full pt-6">
              <div className="ipod-back-etched-capacity mx-auto w-fit rounded-sm border border-white/20 bg-black/10 px-2 py-0.5 text-center text-[10px] font-medium">
                8GB
              </div>
              <p className="ipod-back-etched-legal mt-3 text-center text-[5px] leading-relaxed">
                Model A1320 · Riff by Tise in New York City. Assembled in Cursor.
                <br />
                FCC ID: BCGA1320 IC: 579C-A1320
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
