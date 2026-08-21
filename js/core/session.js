const KEY = "act-practice-session-v1";
export function saveSession(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
export function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function clearSession() { localStorage.removeItem(KEY); }
