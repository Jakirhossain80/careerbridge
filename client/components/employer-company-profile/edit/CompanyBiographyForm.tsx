import { Input, Textarea } from "@/components/ui";

const ABOUT_MAX_LENGTH = 900;

type CompanyBiographyFormProps = {
  tagline: string;
  about: string;
  onTaglineChange: (value: string) => void;
  onAboutChange: (value: string) => void;
};

export default function CompanyBiographyForm({
  tagline,
  about,
  onTaglineChange,
  onAboutChange,
}: CompanyBiographyFormProps) {
  const remainingCharacters = ABOUT_MAX_LENGTH - about.length;

  return (
    <section
      aria-labelledby="company-biography-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="company-biography-heading" className="text-lg font-semibold text-foreground">
          Company biography
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tell candidates what your company builds and how your teams work.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <Input
          label="Company tagline"
          name="tagline"
          value={tagline}
          onChange={(event) => onTaglineChange(event.target.value)}
          maxLength={180}
          helperText="A short summary displayed near the company name."
        />

        <Textarea
          label="About the company"
          name="about"
          value={about}
          onChange={(event) => onAboutChange(event.target.value)}
          maxLength={ABOUT_MAX_LENGTH}
          rows={8}
          required
          helperText={
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span>Use clear, candidate-friendly language.</span>
              <span aria-live="polite">
                {about.length}/{ABOUT_MAX_LENGTH} characters
              </span>
            </span>
          }
        />

        <p
          className={`text-sm ${
            remainingCharacters < 80 ? "text-amber-700" : "text-muted"
          }`}
        >
          {remainingCharacters} characters remaining
        </p>
      </div>
    </section>
  );
}
