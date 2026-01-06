export type User = {
  id: string;
  name: string;
  email: string;
  bio?: string;
};

export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
};

// Use relative URLs so that in production the frontend talks directly to the
// Next.js API routes hosted on the same origin (e.g. Vercel).
const API_BASE = "";

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      (data && (data.message as string)) ||
      (data && data.errors && data.errors[0]?.msg) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, options);
    return await handleResponse<T>(res);
  } catch (err) {
    // Handle network errors (backend not running, CORS, etc.)
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to the server. Please make sure the backend is running on port 5000."
      );
    }
    // Re-throw other errors (they already have good messages from handleResponse)
    throw err;
  }
}

export async function signup(form: {
  name: string;
  email: string;
  password: string;
}) {
  return fetchWithErrorHandling<{ user: User; token: string }>(
    `${API_BASE}/api/auth/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    }
  );
}

export async function login(form: { email: string; password: string }) {
  return fetchWithErrorHandling<{ user: User; token: string }>(
    `${API_BASE}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    }
  );
}

export async function logout() {
  return fetchWithErrorHandling<{ message: string }>(
    `${API_BASE}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );
}

export async function getProfile() {
  return fetchWithErrorHandling<{ user: User }>(`${API_BASE}/api/profile`, {
    credentials: "include",
  });
}

export async function updateProfile(form: { name?: string; bio?: string }) {
  return fetchWithErrorHandling<{ user: User }>(`${API_BASE}/api/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });
}

export async function listTasks(params?: {
  q?: string;
  status?: TaskStatus | "";
}) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);

  return fetchWithErrorHandling<{ tasks: Task[] }>(
    `${API_BASE}/api/tasks?${search.toString()}`,
    {
      credentials: "include",
    }
  );
}

export async function createTask(form: {
  title: string;
  description?: string;
  status?: TaskStatus;
}) {
  return fetchWithErrorHandling<{ task: Task }>(`${API_BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });
}

export async function updateTask(
  id: string,
  form: Partial<Pick<Task, "title" | "description" | "status">>
) {
  return fetchWithErrorHandling<{ task: Task }>(
    `${API_BASE}/api/tasks/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    }
  );
}

export async function deleteTask(id: string) {
  return fetchWithErrorHandling<{ message: string }>(
    `${API_BASE}/api/tasks/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
}


