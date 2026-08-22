-- Run once on deploy. All statements are idempotent (safe to re-run).

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  name           TEXT,
  company        TEXT,
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
-- Nullable so pre-existing accounts still load; both name and company are
-- required at signup and backfilled on next sign-in via /complete-profile.
ALTER TABLE users ADD COLUMN IF NOT EXISTS company        TEXT;
ALTER TABLE users ALTER  COLUMN password_hash DROP NOT NULL;

CREATE TABLE IF NOT EXISTS verification_tokens (
  id         SERIAL PRIMARY KEY,
  token      TEXT        UNIQUE NOT NULL,
  user_id    INT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Controls which columns appear (and in what order) on the Lookup table.
-- Hiding a column never deletes vehicle data.
CREATE TABLE IF NOT EXISTS lookup_column_config (
  key      TEXT    PRIMARY KEY,
  label    TEXT    NOT NULL,
  position INTEGER NOT NULL,
  visible  BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO lookup_column_config (key, label, position, visible) VALUES
  ('year_display',          'YEAR',          0, TRUE),
  ('make_name',             'MAKE',          1, TRUE),
  ('model_name',            'MODEL',         2, TRUE),
  ('model_notes',           'MODEL NOTES',   8, TRUE),
  ('module_name',           'MODULE',        3, TRUE),
  ('interface_names',       'INTERFACES',    4, TRUE),
  ('obd_dlc_connect_cable', 'OBD CABLE',     5, TRUE),
  ('obd_adapter',           'OBD Adapter',   9, TRUE),
  ('d2m_connect_cable',     'D2M Cable',     6, TRUE),
  ('d2m_adapter',           'D2M Adapter',  10, TRUE),
  ('module_location',       'LOCATION',      7, TRUE)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE IF EXISTS vehicles ADD COLUMN IF NOT EXISTS obd_adapter TEXT;
ALTER TABLE IF EXISTS vehicles ADD COLUMN IF NOT EXISTS d2m_adapter TEXT;

-- Canonical cable names per category ('obd' | 'd2m'), plus every raw spelling
-- that should resolve to them. Merging never deletes vehicle rows.
CREATE TABLE IF NOT EXISTS cables (
  id         SERIAL PRIMARY KEY,
  kind       TEXT        NOT NULL DEFAULT 'obd',
  name       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cables ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'obd';
DROP INDEX IF EXISTS cables_name_uq;
CREATE UNIQUE INDEX IF NOT EXISTS cables_kind_name_uq ON cables (kind, name);

CREATE TABLE IF NOT EXISTS cable_aliases (
  id         SERIAL PRIMARY KEY,
  cable_id   INT         NOT NULL REFERENCES cables (id) ON DELETE CASCADE,
  kind       TEXT        NOT NULL DEFAULT 'obd',
  raw_name   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cable_aliases ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'obd';
DROP INDEX IF EXISTS cable_aliases_raw_name_uq;
CREATE UNIQUE INDEX IF NOT EXISTS cable_aliases_kind_raw_name_uq ON cable_aliases (kind, raw_name);
