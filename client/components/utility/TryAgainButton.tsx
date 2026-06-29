"use client";

import { RefreshCcw } from "lucide-react";

import Button from "@/components/ui/Button";

type TryAgainButtonProps = {
  label?: string;
};

export default function TryAgainButton({
  label = "Try Again",
}: TryAgainButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => window.location.reload()}
      leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
    >
      {label}
    </Button>
  );
}
