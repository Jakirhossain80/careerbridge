import { Send, Save } from "lucide-react";

import { Button } from "@/components/ui";

type PostJobActionsProps = {
  onDraft: () => void;
  isSubmitting?: boolean;
};

export default function PostJobActions({
  onDraft,
  isSubmitting = false,
}: PostJobActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button
        type="button"
        variant="outline"
        onClick={onDraft}
        disabled={isSubmitting}
        leftIcon={<Save className="size-4" aria-hidden="true" />}
      >
        Save as Draft
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        leftIcon={<Send className="size-4" aria-hidden="true" />}
      >
        Publish Job
      </Button>
    </div>
  );
}
