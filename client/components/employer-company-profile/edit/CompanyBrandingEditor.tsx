import Image from "next/image";
import { Camera, ImagePlus, UploadCloud } from "lucide-react";

type CompanyBrandingEditorProps = {
  companyName: string;
  logoUrl: string;
  bannerUrl: string;
};

export default function CompanyBrandingEditor({
  companyName,
  logoUrl,
  bannerUrl,
}: CompanyBrandingEditorProps) {
  return (
    <section
      aria-labelledby="company-branding-heading"
      className="overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2 id="company-branding-heading" className="text-lg font-semibold text-foreground">
          Company branding
        </h2>
        <p className="mt-1 text-sm text-muted">
          Upload-ready controls for the public banner and logo.
        </p>
      </div>

      <div className="p-5">
        <div className="relative min-h-52 overflow-hidden rounded-lg bg-slate-900 sm:min-h-64">
          <Image
            src={bannerUrl}
            alt={`${companyName} banner preview`}
            fill
            sizes="(min-width: 1280px) 760px, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-700/65 to-emerald-500/70" />
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 sm:inset-x-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-md text-white">
              <p className="text-sm font-semibold">Company banner</p>
              <p className="mt-1 text-sm text-white/80">
                Recommended size: 1440 x 420 px. PNG, JPG, or SVG.
              </p>
            </div>

            <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/40 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-white/70">
              <UploadCloud className="size-4" aria-hidden="true" />
              Change banner
              <input
                type="file"
                name="banner"
                accept="image/png,image/jpeg,image/svg+xml"
                className="sr-only"
                aria-label="Upload company banner"
              />
            </label>
          </div>
        </div>

        <div className="relative -mt-10 ml-4 flex flex-col gap-4 sm:ml-6 sm:flex-row sm:items-end">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blue-50 shadow-sm ring-4 ring-surface dark:border-slate-700 dark:bg-slate-800 sm:size-28">
            <Image
              src={logoUrl}
              alt={`${companyName} logo preview`}
              width={112}
              height={112}
              className="size-full object-cover"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Camera className="size-4 text-primary" aria-hidden="true" />
              Company logo
            </p>
            <p className="mt-1 text-sm text-muted">
              Square images work best. Recommended size: 512 x 512 px.
            </p>
            <label className="mt-3 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800">
              <ImagePlus className="size-4" aria-hidden="true" />
              Change logo
              <input
                type="file"
                name="logo"
                accept="image/png,image/jpeg,image/svg+xml"
                className="sr-only"
                aria-label="Upload company logo"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
