import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold " +
  "px-7 py-3.5 text-[15px] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-(--color-ember) text-(--color-base) hover:bg-(--color-ember-soft) hover:shadow-[0_0_28px_rgba(255,159,69,0.35)] active:scale-[0.98]",
  secondary:
    "glass-panel text-(--color-ink) hover:bg-(--color-surface-hover) active:scale-[0.98]",
  ghost:
    "text-(--color-ink-muted) hover:text-(--color-ink) px-4 py-2",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
