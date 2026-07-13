import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/lookup?verified=invalid`);
  }

  try {
    // Look up the token
    const result = await pool.query<{ user_id: number; expires_at: Date }>(
      `SELECT user_id, expires_at
       FROM verification_tokens
       WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.redirect(`${BASE_URL}/lookup?verified=invalid`);
    }

    const { user_id, expires_at } = result.rows[0];

    if (new Date() > new Date(expires_at)) {
      await pool.query("DELETE FROM verification_tokens WHERE token = $1", [token]);
      return NextResponse.redirect(`${BASE_URL}/lookup?verified=expired`);
    }

    // Mark user as verified and delete the token
    await pool.query("UPDATE users SET email_verified = true WHERE id = $1", [user_id]);
    await pool.query("DELETE FROM verification_tokens WHERE token = $1", [token]);

    // Create our session cookie and redirect to lookup
    const sessionToken = createSessionToken(user_id);
    const res = NextResponse.redirect(`${BASE_URL}/lookup?verified=ok`);
    res.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.redirect(`${BASE_URL}/lookup?verified=error`);
  }
}
