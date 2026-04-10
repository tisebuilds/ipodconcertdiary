"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LCD_BEZEL_RADIUS_CLASS, lcdBezelStyle } from "@/lib/lcd-bezel";

type LcdBezelProps = {
  children: ReactNode;
  className?: string;
};

export function LcdBezel({ children, className }: LcdBezelProps) {
  return (
    <div
      className={cn(LCD_BEZEL_RADIUS_CLASS, "p-[9px]", className)}
      style={lcdBezelStyle}
    >
      {children}
    </div>
  );
}
