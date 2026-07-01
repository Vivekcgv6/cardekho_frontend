import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, glow = false, className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={`glass-panel rounded-3xl ${glow ? "shadow-[0_0_40px_rgba(255,159,69,0.08)]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
