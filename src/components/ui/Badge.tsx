import type { ReactNode } from "react";

type BadgeVariant = "info" | "warning" | "success" | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  info: "bg-blue-50 text-blue-700 ring-blue-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  success: "bg-green-light text-green-dark ring-green/20",
  neutral: "bg-gray-100 text-text-secondary ring-gray-500/20",
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
