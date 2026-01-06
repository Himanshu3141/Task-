export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 px-4">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl shadow-black/50">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-50">
          Welcome to Task Dashboard
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          Manage your tasks with a secure, modern dashboard. Sign in to create,
          organize, and track your personal tasks with search and filtering.
        </p>
        <div className="flex flex-col gap-3 text-sm sm:flex-row">
          <a
            href="/login"
            className="flex h-10 flex-1 items-center justify-center rounded-lg bg-zinc-50 text-sm font-semibold text-zinc-900 hover:bg-white"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="flex h-10 flex-1 items-center justify-center rounded-lg border border-zinc-700 text-sm font-semibold text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900"
          >
            Create account
          </a>
        </div>
      </main>
    </div>
  );
}
