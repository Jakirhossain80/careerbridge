import { CheckCircle2, ShieldCheck } from "lucide-react";

import SettingsCard from "@/components/settings/SettingsCard";

const securityTips = [
  {
    title: "Length Matters",
    description: "Use at least 8 characters. Longer passwords are harder to guess.",
  },
  {
    title: "Mix it up",
    description: "Combine uppercase letters, lowercase letters, and numbers.",
  },
  {
    title: "Avoid Personal Info",
    description: "Do not use birthdays, names, phone numbers, or profile details.",
  },
  {
    title: "Use a Manager",
    description: "A password manager helps you keep unique passwords for each account.",
  },
];

export default function SecurityTipsCard() {
  return (
    <SettingsCard
      title="Security Tips"
      description="Small habits that keep your CareerBridge account safer."
      icon={<ShieldCheck className="size-5" aria-hidden="true" />}
    >
      <ul className="space-y-4">
        {securityTips.map((tip) => (
          <li key={tip.title} className="flex gap-3">
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{tip.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
}
