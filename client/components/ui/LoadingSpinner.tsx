type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-9 border-[3px]",
};

export default function LoadingSpinner({
  label = "Loading",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <span className="inline-flex items-center gap-3 text-sm font-medium text-muted">
      <span
        className={`${sizeClasses[size]} inline-block animate-spin rounded-full border-primary border-t-transparent`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
