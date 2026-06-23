"use client";

import { MailPlus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Badge, Button, Card, Table } from "@/components/ui";
import type { TableColumn } from "@/components/ui";
import type { EmployerSettingsFormValues } from "@/lib/validations/employer-settings.schema";
import type { EmployerTeamMember } from "@/types/employer-settings.types";

const columns: TableColumn<EmployerTeamMember>[] = [
  {
    key: "name",
    header: "Team member",
    render: (member) => (
      <div>
        <p className="font-semibold text-foreground">{member.name}</p>
        <p className="text-sm text-muted">{member.email}</p>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (member) => <span className="text-sm font-medium">{member.role}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (member) => (
      <Badge variant={member.status === "Active" ? "success" : "warning"}>
        {member.status}
      </Badge>
    ),
  },
];

export default function TeamSettingsPanel() {
  const { watch } = useFormContext<EmployerSettingsFormValues>();
  const team = watch("team");

  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Team Settings</h2>
            <p className="mt-1 text-sm text-muted">
              Review employer workspace members and prepared invite controls.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            leftIcon={<MailPlus className="size-4" aria-hidden="true" />}
          >
            Invite Member
          </Button>
        </div>
      }
      contentClassName="p-0"
    >
      <Table columns={columns} data={team} emptyMessage="No team members found." />
    </Card>
  );
}

