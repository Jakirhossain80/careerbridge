import { Globe, LinkIcon, Mail, MessageCircle, Share2 } from "lucide-react";

type BlogShareSidebarProps = {
  title: string;
};

const shareActions = [
  { label: "Share by email", icon: Mail },
  { label: "Share to network", icon: Share2 },
  { label: "Share in message", icon: MessageCircle },
  { label: "Share publicly", icon: Globe },
  { label: "Copy article link", icon: LinkIcon },
];

export default function BlogShareSidebar({ title }: BlogShareSidebarProps) {
  return (
    <aside
      className="hidden xl:block"
      aria-label={`Share ${title}`}
    >
      <div className="sticky top-24 grid justify-items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">
          Share
        </p>
        {shareActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              aria-label={action.label}
              className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-surface text-muted shadow-sm transition hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
            >
              <Icon className="size-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export type { BlogShareSidebarProps };
