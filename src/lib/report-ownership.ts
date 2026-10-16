import type { Item } from "@/lib/items";

const STORAGE_KEY = "foundhere:my-reports";
const ATTEMPTS_KEY = "foundhere:manage-attempts";
const LOCK_MS = 5 * 60 * 1000;

export type LocalReport = { id: string; code?: string };

function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashManageCode(code: string) {
  const data = new TextEncoder().encode(code);
  return bytesToHex(await crypto.subtle.digest("SHA-256", data));
}

export function generateManageCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function getLocalReports(): LocalReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as LocalReport[];
  } catch {
    return [];
  }
}

export function rememberReport(id: string, code: string) {
  const reports = getLocalReports().filter((report) => report.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...reports, { id, code }]));
}

export function forgetReport(id: string) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(getLocalReports().filter((report) => report.id !== id)),
  );
}

export function isLocalReport(id: string) {
  return getLocalReports().some((report) => report.id === id);
}

export function getManageCode(id: string) {
  return getLocalReports().find((report) => report.id === id)?.code;
}

function attempts() {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) ?? "{}") as Record<
      string,
      { count: number; lockedUntil?: number }
    >;
  } catch {
    return {};
  }
}

export function getLockState(id: string) {
  const entry = attempts()[id];
  if (!entry?.lockedUntil || entry.lockedUntil <= Date.now())
    return { locked: false, remaining: 0 };
  return { locked: true, remaining: Math.ceil((entry.lockedUntil - Date.now()) / 1000) };
}

export function recordFailedAttempt(id: string) {
  const all = attempts();
  const current = all[id] ?? { count: 0 };
  const count = current.count + 1;
  all[id] = { count, lockedUntil: count >= 5 ? Date.now() + LOCK_MS : undefined };
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(all));
}

export function clearFailedAttempts(id: string) {
  const all = attempts();
  delete all[id];
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(all));
}

export function canManageItem(item: Item) {
  return isLocalReport(item.id) || Boolean(getManageCode(item.id));
}

export function ownerStatus(kind: Item["kind"]) {
  return kind === "lost" ? "resolved" : "returned";
}

export function ownerStatusLabel(kind: Item["kind"]) {
  return kind === "lost" ? "I got it back" : "Returned";
}
