"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { ClickWheel } from "@/components/ClickWheel";
import { IpodScreen } from "@/components/IpodScreen";
import { cn } from "@/lib/cn";

/** Fixed layout width for iPod nano–style shell (narrow + tall). */
const SHELL_WIDTH_PX = 236;

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
  background: `
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--ipod-body) 88%, #000) 0%,
      transparent 28%,
      transparent 72%,
      color-mix(in srgb, var(--ipod-body) 88%, #000) 100%
    ),
    radial-gradient(
      ellipse 125% 120% at 50% 38%,
      var(--ipod-body) 0%,
      color-mix(in srgb, var(--ipod-body) 92%, #000) 100%
    )
  `,
  boxShadow:
    "inset 0 0 72px rgba(0,0,0,0.055), 0 1px 2px rgba(0,0,0,0.05)",
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
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
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
        <div
          className="relative transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className={cn(
              "relative rounded-[2px] border border-black/[0.09] px-3 pb-4 pt-5 [backface-visibility:hidden] [transform:translateZ(0.1px)]",
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

            <div className="rounded-[5px] border border-[#2a2a2a] bg-[#141414] p-[9px]">
              <IpodScreen className="h-[256px]" />
            </div>

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
              "absolute inset-0 flex flex-col items-center rounded-[2px] border border-black/[0.09] px-4 pb-5 pt-8 [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0.1px)]",
              !flipped && "pointer-events-none",
            )}
            style={shellBodyStyle}
            aria-hidden={!flipped}
          >
            <AppleLogo className="h-14 w-12" />
            <p className="mt-3 font-[system-ui] text-[22px] font-light tracking-[0.02em] text-white/90">
              iPod
            </p>
            <div className="mt-auto w-full pt-6">
              <div className="mx-auto w-fit rounded-sm border border-white/20 bg-black/10 px-2 py-0.5 text-center text-[10px] font-medium text-white/75">
                8GB
              </div>
              <p className="mt-3 text-center text-[5px] leading-relaxed text-white/35">
                Model A1320 · Designed by Apple in California. Assembled in China.
                <br />
                FCC ID: BCGA1320 IC: 579C-A1320
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
