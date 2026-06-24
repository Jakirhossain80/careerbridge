"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Badge, Button, Card, Input } from "@/components/ui";

type EditSkillsInputProps = {
  title: string;
  description: string;
  skills: string[];
  onChange: (skills: string[]) => void;
};

export default function EditSkillsInput({
  title,
  description,
  skills,
  onChange,
}: EditSkillsInputProps) {
  const [value, setValue] = useState("");

  function addSkill() {
    const nextSkill = value.trim();

    if (!nextSkill || skills.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())) {
      setValue("");
      return;
    }

    onChange([...skills, nextSkill]);
    setValue("");
  }

  function removeSkill(skillToRemove: string) {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  }

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          aria-label={`Add ${title.toLowerCase()}`}
          placeholder="Type a skill and press Enter"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill();
            }
          }}
          wrapperClassName="flex-1"
        />
        <Button
          onClick={addSkill}
          leftIcon={<Plus className="size-4" aria-hidden="true" />}
        >
          Add
        </Button>
      </div>

      {skills.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="primary"
              className="gap-1.5 pr-1"
            >
              {skill}
              <button
                type="button"
                className="rounded p-0.5 transition hover:bg-blue-100"
                aria-label={`Remove ${skill}`}
                onClick={() => removeSkill(skill)}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted">
          No skills added yet.
        </p>
      )}
    </Card>
  );
}
