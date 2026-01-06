"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  getProfile,
  listTasks,
  Task,
  TaskStatus,
  updateProfile,
  updateTask,
} from "@/app/api-client";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export default function DashboardPage() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ user }, { tasks }] = await Promise.all([
          getProfile(),
          listTasks({}),
        ]);
        setName(user.name ?? "");
        setBio(user.bio ?? "");
        setTasks(tasks);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unable to load dashboard data.";
        setError(msg);
      } finally {
        setProfileLoading(false);
        setTasksLoading(false);
      }
    })();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (status && task.status !== status) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        (task.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [tasks, search, status]);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSavingProfile(true);
      await updateProfile({ name: name.trim(), bio });
      setSuccess("Profile updated.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to update profile.";
      setError(msg);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!taskTitle.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      const { task } = await createTask({
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
      });
      setTasks((prev) => [task, ...prev]);
      setTaskTitle("");
      setTaskDescription("");
      setSuccess("Task created.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to create task.";
      setError(msg);
    }
  }

  async function handleStatusChange(task: Task, newStatus: TaskStatus) {
    setError(null);
    setSuccess(null);
    try {
      const { task: updated } = await updateTask(task._id, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to update task.";
      setError(msg);
    }
  }

  async function handleDelete(task: Task) {
    setError(null);
    setSuccess(null);
    try {
      await deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      setSuccess("Task deleted.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Unable to delete task.";
      setError(msg);
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-sm shadow-black/40">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-50">
              Profile
            </h2>
          </div>

          {profileLoading ? (
            <p className="text-xs text-zinc-500">Loading profile...</p>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
                  placeholder="Short description about you (max 240 characters)."
                />
                <p className="text-[11px] text-zinc-500">
                  This syncs with the backend `bio` field and is validated on the
                  server.
                </p>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-sm shadow-black/40">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-zinc-50">
                New task
              </h2>
              <p className="text-[11px] text-zinc-500">
                Create a task to track what you&apos;re working on.
              </p>
            </div>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
                placeholder="e.g. Finish onboarding flow"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
                placeholder="Optional details, links, etc."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-white"
            >
              Add task
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-sm shadow-black/40">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-50">
              Tasks
            </h2>
            <p className="text-[11px] text-zinc-500">
              Search, filter, update status, or delete tasks.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 rounded-lg border border-zinc-700 bg-black/40 px-3 py-1.5 text-xs text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600 md:w-52"
              placeholder="Search title or description..."
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus | "")}
              className="rounded-lg border border-zinc-700 bg-black/40 px-3 py-1.5 text-xs text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
            >
              <option value="">All statuses</option>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="mb-3 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            {success}
          </p>
        )}

        {tasksLoading ? (
          <p className="text-xs text-zinc-500">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-xs text-zinc-500">
            No tasks yet. Create your first one above.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-black/40 p-3 text-xs text-zinc-100 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-[11px] text-zinc-400">
                      {task.description}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task, e.target.value as TaskStatus)
                    }
                    className="rounded-lg border border-zinc-700 bg-black/40 px-2.5 py-1.5 text-[11px] text-zinc-50 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600"
                  >
                    {(["todo", "in-progress", "done"] as TaskStatus[]).map(
                      (value) => (
                        <option key={value} value={value}>
                          {statusLabels[value]}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    className="rounded-lg border border-red-500/60 px-2.5 py-1.5 text-[11px] font-medium text-red-200 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}


