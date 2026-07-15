import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await pool.query(
            `INSERT INTO users (email, name, email_verified, provider, last_login)
             VALUES ($1, $2, true, 'google', NOW())
             ON CONFLICT (email) DO UPDATE
               SET name            = COALESCE(EXCLUDED.name, users.name),
                   email_verified  = true,
                   last_login      = NOW()`,
            [user.email.toLowerCase(), user.name ?? null]
          );
        } catch (err) {
          console.error("Google signIn DB error:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account }) {
      // Attach our DB user id to the JWT on first sign-in
      if (account?.provider === "google" && token.email) {
        const result = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [token.email.toLowerCase()]
        );
        if (result.rows[0]) token.userId = result.rows[0].id as number;
      }
      return token;
    },

    async session({ session, token }) {
      (session as { userId?: number }).userId = token.userId as number | undefined;
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/lookup`;
    },
  },
};
