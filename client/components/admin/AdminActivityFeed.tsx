import Card from "@/components/ui/Card";
import type { AdminStats } from "@/types/admin.types";

type AdminActivityFeedProps = {
  activity: AdminStats["recentActivity"];
};

export default function AdminActivityFeed({ activity }: AdminActivityFeedProps) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
      <div className="mt-4 space-y-3">
        {activity.length > 0 ? (
          activity.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs capitalize text-muted">{item.type}</p>
              </div>
              <span className="text-xs text-muted">{item.status}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No recent activity yet.</p>
        )}
      </div>
    </Card>
  );
}
