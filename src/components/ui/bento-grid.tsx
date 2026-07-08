import { cn } from "@/lib/utils";
import React from "react";

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(340px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        // overflow-hidden intentionally removed — children use translateZ and must
        // be able to float above the card surface on hover in 3D space.
        "relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md p-6 h-full cursor-pointer",
        className
      )}
      style={style}
    >
      {/* Top-edge inner highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  );
}
