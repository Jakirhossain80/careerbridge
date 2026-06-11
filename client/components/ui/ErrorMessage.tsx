import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  title?: string;
  message: string;
};

export default function ErrorMessage({
  title = "Something went wrong",
  message,
}: ErrorMessageProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6">{message}</p>
        </div>
      </div>
    </div>
  );
}
