import { CheckCircle2 } from "lucide-react";

type PostJobToastProps = {
  message: string;
};

export default function PostJobToast({ message }: PostJobToastProps) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
