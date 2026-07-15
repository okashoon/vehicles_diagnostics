-- Run once on deploy. All statements are idempotent (safe to re-run).

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  name           TEXT,
  password_hash  TEXT,
  provider       TEXT        NOT NULL DEFAULT 'email',
  email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
  role           TEXT        NOT NULL DEFAULT 'user',
  last_login     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill columns added after initial release
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider       TEXT        NOT NULL DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN     NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login     TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role           TEXT        NOT NULL DEFAULT 'user';
ALTER TABLE users ALTER  COLUMN password_hash DROP NOT NULL;

CREATE TABLE IF NOT EXISTS verification_tokens (
  id         SERIAL PRIMARY KEY,
  token      TEXT        UNIQUE NOT NULL,
  user_id    INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
