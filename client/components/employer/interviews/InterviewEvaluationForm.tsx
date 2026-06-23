"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button, Card, Select, Textarea } from "@/components/ui";
import {
  interviewFeedbackSchema,
  type InterviewFeedbackFormValues,
} from "@/lib/validations/interview.schema";

type InterviewEvaluationFormProps = {
  isSubmitting?: boolean;
  onSubmit: (values: InterviewFeedbackFormValues) => void;
};

const recommendationOptions = [
  { label: "Select recommendation", value: "" },
  { label: "Strong yes", value: "strong_yes" },
  { label: "Yes", value: "yes" },
  { label: "Maybe", value: "maybe" },
  { label: "No", value: "no" },
  { label: "Strong no", value: "strong_no" },
];

const scoreValues = [1, 2, 3, 4, 5] as const;

type ScoreName = keyof Pick<
  InterviewFeedbackFormValues,
  | "technicalSkillsScore"
  | "cultureFitScore"
  | "communicationScore"
  | "problemSolvingScore"
>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ScoreField({
  label,
  name,
  required = false,
  error,
  value,
  onChange,
}: {
  label: string;
  name: ScoreName;
  required?: boolean;
  error?: string;
  value?: number;
  onChange: (name: ScoreName, value: number) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {scoreValues.map((score) => (
          <button
            key={score}
            type="button"
            className={cn(
              "flex size-10 items-center justify-center rounded-md border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30",
              value === score
                ? "border-primary bg-primary text-white"
                : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800",
            )}
            onClick={() => onChange(name, score)}
            aria-pressed={value === score}
          >
            {score}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </fieldset>
  );
}

export default function InterviewEvaluationForm({
  isSubmitting = false,
  onSubmit,
}: InterviewEvaluationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<InterviewFeedbackFormValues>({
    resolver: zodResolver(interviewFeedbackSchema),
    defaultValues: {
      notes: "",
      recommendation: undefined,
    },
  });

  const values = useWatch({ control });

  function setScore(name: ScoreName, score: number) {
    setValue(name, score, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Interview Evaluation
          </h2>
          <p className="mt-1 text-sm text-muted">
            Submit structured feedback after the interview round.
          </p>
        </div>
      }
      contentClassName="p-5"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <ScoreField
            label="Technical skills score"
            name="technicalSkillsScore"
            required
            value={values.technicalSkillsScore}
            error={errors.technicalSkillsScore?.message}
            onChange={setScore}
          />
          <ScoreField
            label="Culture fit score"
            name="cultureFitScore"
            required
            value={values.cultureFitScore}
            error={errors.cultureFitScore?.message}
            onChange={setScore}
          />
          <ScoreField
            label="Communication score"
            name="communicationScore"
            value={values.communicationScore}
            error={errors.communicationScore?.message}
            onChange={setScore}
          />
          <ScoreField
            label="Problem solving score"
            name="problemSolvingScore"
            value={values.problemSolvingScore}
            error={errors.problemSolvingScore?.message}
            onChange={setScore}
          />
        </div>

        <Textarea
          label="Interview notes"
          required
          placeholder="Summarize strengths, concerns, evidence, and follow-up items."
          error={errors.notes?.message}
          {...register("notes")}
        />

        <Select
          label="Recommendation"
          options={recommendationOptions}
          error={errors.recommendation?.message}
          {...register("recommendation", {
            setValueAs: (value) => (value === "" ? undefined : value),
          })}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </Card>
  );
}
