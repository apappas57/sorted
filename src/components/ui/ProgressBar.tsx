type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  label?: string;
  className?: string;
};

export function ProgressBar({
  currentStep,
  totalSteps,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={`w-full ${className}`.trim()} role="group" aria-label="Progress">
      <div className="mb-2 flex items-center justify-between text-sm">
        {label && (
          <span className="font-medium text-text-primary">{label}</span>
        )}
        <span className="text-text-muted ml-auto">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}${label ? `: ${label}` : ""}, ${percentage}% complete`}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
              i < currentStep ? "bg-green" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
