type SpinnerProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function Spinner({ text, size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`.trim()}
      role="status"
      aria-label={text || "Loading"}
    >
      <div
        className={`animate-spin rounded-full border-green/30 border-t-green ${sizeClasses[size]}`}
      />
      {text && (
        <p className="text-sm text-text-secondary animate-pulse">{text}</p>
      )}
      <span className="sr-only">{text || "Loading"}</span>
    </div>
  );
}
