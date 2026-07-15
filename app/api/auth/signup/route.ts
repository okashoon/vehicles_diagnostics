import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword, createVerificationToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing account
    const existing = await pool.query(
      "SELECT id, email_verified, provider FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      if (user.provider === "google") {
        return NextResponse.json(
          { error: "This email is linked to a Google account. Use 'Sign in with Google'." },
          { status: 409 }
        );
      }
      if (!user.email_verified) {
        // Resend verification email
        const token = createVerificationToken();
        await pool.query(
          `INSERT INTO verification_tokens (token, user_id, expires_at)
           VALUES ($1, $2, NOW() + INTERVAL '24 hours')`,
          [token, user.id]
        );
        await sendVerificationEmail(normalizedEmail, token);
        return NextResponse.json({
          pending: true,
          message: "A new verification email has been sent. Please check your inbox.",
        });
      }
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Create new unverified user
    const hash = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash, provider, email_verified)
       VALUES ($1, $2, $3, 'email', false)
       RETURNING id`,
      [normalizedEmail, name?.trim() || null, hash]
    );

    // Create verification token (24 hour expiry)
    const token = createVerificationToken();
    await pool.query(
      `INSERT INTO verification_tokens (token, user_id, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '24 hours')`,
      [token, result.rows[0].id]
    );

    // Send verification email
    await sendVerificationEmail(normalizedEmail, token);

    return NextResponse.json({
      pending: true,
      message: "Account created! Check your email to verify and log in.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
