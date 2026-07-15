import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "vd_session";
const SECRET =
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production";

// ---------------------------------------------------------------------------
// Password hashing
// ---------------------------------------------------------------------------

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

export function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = storedHash.split(":");
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(derived.toString("hex") === key);
    });
  });
}

// ---------------------------------------------------------------------------
// Verification tokens
// ---------------------------------------------------------------------------

export function createVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ---------------------------------------------------------------------------
// Session tokens (signed, base64url-encoded JSON + HMAC)
// ---------------------------------------------------------------------------

function hmac(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function createSessionToken(userId: number): string {
  const payload = Buffer.from(
    JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  ).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function verifySessionToken(token: string): { userId: number } | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (hmac(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.userId !== "number" || data.exp < Date.now()) return null;
    return { userId: data.userId };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// DB helper (imported lazily to avoid circular deps at module level)
// ---------------------------------------------------------------------------

export async function getUserRole(userId: number): Promise<string | null> {
  const { default: pool } = await import("@/lib/db");
  const { rows } = await pool.query(
    "SELECT role FROM users WHERE id = $1",
    [userId]
  );
  return rows[0]?.role ?? null;
}

/** Resolves to the role string if the current request is an admin, otherwise null. */
export async function requireAdmin(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;
  const role = await getUserRole(session.userId);
  return role === "admin" ? role : null;
}

// ---------------------------------------------------------------------------
// Server-side session reader — checks custom cookie then NextAuth JWT
// ---------------------------------------------------------------------------

export async function getSession(): Promise<{ userId: number } | null> {
  // 1. Custom cookie (email/password logins)
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const result = verifySessionToken(token);
    if (result) return result;
  }

  // 2. NextAuth JWT session (Google OAuth logins)
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth-options");
    const session = await getServerSession(authOptions);
    const userId = (session as { userId?: number } | null)?.userId;
    if (typeof userId === "number") return { userId };
  } catch {
    // NextAuth unavailable — skip silently
  }

  return null;
}
