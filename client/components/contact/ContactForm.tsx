"use client";

import { FormEvent, useState } from "react";

import { inquiryTypeOptions, type InquiryType } from "@/lib/contact-data";

import { Button, Card, Input, Select, Textarea } from "@/components/ui";

type ContactFormValues = {
  fullName: string;
  email: string;
  inquiryType: "" | InquiryType;
  message: string;
};

type ContactFormStatus = "idle" | "loading" | "success" | "error";

const initialValues: ContactFormValues = {
  fullName: "",
  email: "",
  inquiryType: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  function updateField<Field extends keyof ContactFormValues>(
    field: Field,
    value: ContactFormValues[Field],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");

    window.setTimeout(() => {
      setStatus("success");
      setValues(initialValues);
    }, 600);
  }

  return (
    <section id="contact-form" className="bg-background px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Send a message
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tell us what you need help with.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            This form is prepared for later API, email, CRM, and support ticket
            integrations. For now, it keeps local form state only.
          </p>
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-primary dark:bg-blue-950/40 dark:text-blue-200">
            Required fields are marked with an asterisk. Include enough detail
            so the right team can respond quickly.
          </div>
        </div>

        <Card className="shadow-lg shadow-blue-900/5" contentClassName="p-6 md:p-8">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                name="fullName"
                autoComplete="name"
                placeholder="Enter your full name"
                value={values.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>

            <Select
              label="Inquiry Type / Subject"
              name="inquiryType"
              placeholder="Select an inquiry type"
              options={inquiryTypeOptions}
              value={values.inquiryType}
              onChange={(event) =>
                updateField("inquiryType", event.target.value as InquiryType)
              }
              required
            />

            <Textarea
              label="Message"
              name="message"
              placeholder="Share the details of your request"
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              helperText="Please avoid sharing passwords or sensitive payment details."
              required
            />

            <div aria-live="polite">
              {status === "success" ? (
                <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Message prepared successfully. Backend delivery will be wired
                  in a future integration.
                </p>
              ) : null}
              {status === "error" ? (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  We could not prepare your message. Please try again.
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              isLoading={status === "loading"}
            >
              Submit message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
