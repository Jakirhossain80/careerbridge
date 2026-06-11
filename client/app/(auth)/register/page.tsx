import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your CareerBridge profile to start exploring opportunities."
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          className="h-11 w-full rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Create account
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
