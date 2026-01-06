"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile, logout, User } from "@/app/api-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { user } = await getProfile();
        if (!cancelled) {
          setUser(user);
        }
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-zinc-200">
        <p className="text-sm text-zinc-400">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-zinc-50">
      <aside className="hidden w-64 border-r border-zinc-800 bg-black/40 px-6 py-6 md:flex md:flex-col">
        <div className="mb-8">
          <h1 className="text-lg font-semibold tracking-tight">Task Dashboard</h1>
          <p className="text-xs text-zinc-500">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <nav className="flex-1 space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Views
          </p>
          <button
            type="button"
            className="mt-1 flex w-full items-center justify-between rounded-lg bg-zinc-800/70 px-3 py-2 text-left text-sm font-medium text-zinc-50"
          >
            Overview
          </button>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <header className="mb-6 flex items-center justify-between md:hidden">
          <div>
            <h1 className="text-base font-semibold">Task Dashboard</h1>
            <p className="text-[11px] text-zinc-500">
              {user.name ? `Hi ${user.name}!` : user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-[11px] font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
          >
            Logout
          </button>
        </header>

        {error && (
          <p className="mb-3 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}

        {children}
      </main>
    </div>
  );
}


