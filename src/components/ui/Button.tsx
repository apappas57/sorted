import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
    external?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  external?: boolean;
  onClick?: undefined;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-white hover:bg-green-dark focus-visible:ring-green shadow-sm",
  secondary:
    "bg-bg-surface text-text-primary hover:bg-border focus-visible:ring-border border border-border",
  outline:
    "border border-green text-green hover:bg-green-light focus-visible:ring-green",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3.5 text-lg gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  ...rest
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if ("href" in rest && rest.href != null) {
    const { href, external, ...linkRest } = rest;

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled || undefined}
          {...linkRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  const { ...buttonRest } = rest as ButtonAsButton;

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      {...buttonRest}
    >
      {children}
    </button>
  );
}
