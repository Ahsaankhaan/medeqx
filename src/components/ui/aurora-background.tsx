import React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#00040F]",
        className
      )}
    >
      {/* Blob 1 — primary blue, top-left */}
      <div
        className="aurora-blob"
        style={{
          background: "radial-gradient(ellipse, rgba(0,87,255,0.55) 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
          width: "70%",
          height: "70%",
          animationDuration: "20s",
        }}
      />
      {/* Blob 2 — cyan, top-right */}
      <div
        className="aurora-blob"
        style={{
          background: "radial-gradient(ellipse, rgba(0,212,255,0.38) 0%, transparent 70%)",
          top: "5%",
          right: "-15%",
          width: "60%",
          height: "60%",
          animationDuration: "28s",
          animationDirection: "reverse",
        }}
      />
      {/* Blob 3 — indigo, bottom-center */}
      <div
        className="aurora-blob"
        style={{
          background: "radial-gradient(ellipse, rgba(99,60,255,0.28) 0%, transparent 70%)",
          bottom: "-5%",
          left: "20%",
          width: "55%",
          height: "55%",
          animationDuration: "35s",
          animationDelay: "-8s",
        }}
      />

      {/* Radial top-glow focus */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(0,87,255,0.10),transparent_70%)]" />
      {/* Bottom fade to solid dark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#00040F] to-transparent" />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
