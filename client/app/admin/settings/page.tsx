import Card from "@/components/ui/Card";

export default function AdminSettingsPage() {
  return (
    <main className="p-4 sm:p-6">
      <Card className="p-5">
        <h1 className="text-2xl font-semibold text-foreground">Admin Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Platform-level settings can be connected here when configuration APIs are available.
        </p>
      </Card>
    </main>
  );
}
