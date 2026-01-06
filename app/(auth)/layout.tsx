export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-zinc-50">
          Task Dashboard
        </h1>
        <p className="mb-8 text-center text-sm text-zinc-400">
          Sign in or create an account to manage your tasks.
        </p>
        {children}
      </div>
    </div>
  );
}


