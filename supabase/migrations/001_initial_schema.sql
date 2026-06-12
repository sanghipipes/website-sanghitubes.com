-- ============================================================
-- SANGHI PIPES & TUBES — Initial Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- TABLE: products
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  category    TEXT        NOT NULL,
  description TEXT,
  material    TEXT,
  size        TEXT,
  image_url   TEXT,
  featured    BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- -------------------------------------------------------
-- TABLE: quote_requests
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS quote_requests (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT        NOT NULL,
  company_name  TEXT,
  email         TEXT        NOT NULL,
  phone         TEXT        NOT NULL,
  city          TEXT,
  message       TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','in_progress','completed','cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status     ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_email      ON quote_requests(email);

-- -------------------------------------------------------
-- TABLE: quote_items
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS quote_items (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id UUID    NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  product_id       UUID    REFERENCES products(id) ON DELETE SET NULL,
  product_name     TEXT    NOT NULL,
  quantity         INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT quote_items_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_quote_items_request ON quote_items(quote_request_id);

-- -------------------------------------------------------
-- TABLE: contact_messages
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- -------------------------------------------------------
-- TABLE: admin_users
-- References Supabase auth.users — id must match auth UID
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT        NOT NULL UNIQUE,
  role       TEXT        NOT NULL DEFAULT 'sales'
                         CHECK (role IN ('admin','sales','editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
