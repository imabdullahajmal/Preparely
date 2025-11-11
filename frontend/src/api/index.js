export const BASE = "http://localhost:4000"; // backend base URL

// Generic request helper that sends and receives JSON and includes cookies.
async function request(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const res = await fetch(BASE + path, { ...opts, headers, credentials: 'include' });
  const data = await res.json().catch(() => null);
  if(!res.ok) throw data || { error: res.statusText };
  return data;
}

// Auth endpoints (backend uses /api/auth)
export const login = (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
export const register = (body) => request("/api/auth/signup", { method: "POST", body: JSON.stringify(body) });
export const me = () => request("/api/auth/me");
export const logout = () => request("/api/auth/logout", { method: 'POST' });

// Quiz endpoints (backend uses /api/quiz)
export const generateQuiz = (body) => request("/api/quiz/generate", { method: "POST", body: JSON.stringify(body) });
export const listQuizzes = () => request("/api/quiz");
export const getQuiz = (id) => request(`/api/quiz/${id}`);
export const saveAttempt = (body) => request("/api/quiz/attempt", { method: "POST", body: JSON.stringify(body) });
export const listAttempts = () => request("/api/quiz/attempts");
