import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your CareerBridge workspace."
    >
      <div className="space-y-5">
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
            placeholder="Enter your password"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          className="h-11 w-full rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center text-sm text-muted">
          New to CareerBridge?{" "}
          <Link href="/register" className="font-semibold text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
