import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "soko_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

/** Todas as variáveis do painel precisam estar definidas e ser fortes. */
export function isAdminConfigured(): boolean {
  return (
    (process.env.ADMIN_PASSWORD ?? "").length >= 8 &&
    (process.env.ADMIN_API_KEY ?? "").length >= 24 &&
    (process.env.SESSION_SECRET ?? "").length >= 32
  );
}

function sign(payload: string): string {
  return createHmac("sha256", process.env.SESSION_SECRET ?? "")
    .update(payload)
    .digest("base64url");
}

function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Compara a senha em tempo constante (via hash, para igualar os tamanhos). */
export function passwordMatches(input: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest();
  return timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

/** Use no início de TODA página e server action do painel. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/admin" });
}
