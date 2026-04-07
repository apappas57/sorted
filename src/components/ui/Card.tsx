import type { ReactNode } from "react";

type CardProps = {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ icon, title, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-bg-elevated p-6 ${className}`.trim()}
    >
      {(icon || title) && (
        <div className="mb-4 flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-light text-green">
              {icon}
            </span>
          )}
          {title && (
            <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="text-text-secondary">{children}</div>
    </section>
  );
}
