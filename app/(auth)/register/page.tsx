"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signup } from "@/app/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("A valid email is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      await signup({ name: name.trim(), email, password });
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to register. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200">Name</label>
        <input
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none ring-0 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
          placeholder="Jane Doe"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none ring-0 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-200">
          Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none ring-0 transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
          placeholder="••••••••"
        />
        <p className="text-xs text-zinc-500">
          At least 8 characters, matching the server-side rules.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="pt-2 text-center text-xs text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-100 underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}


