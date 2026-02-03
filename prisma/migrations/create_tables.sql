-- Create tables for mylogin1 application
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qhgnepfixwgaihvlxhhn/sql/new

-- Enable UUID extension for generating IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT ('c' || encode(gen_random_bytes(12), 'hex')),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  password TEXT,
  role TEXT DEFAULT 'USER' NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create SiteConfig table
CREATE TABLE IF NOT EXISTS "SiteConfig" (
  id TEXT PRIMARY KEY DEFAULT ('c' || encode(gen_random_bytes(12), 'hex')),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Project table
CREATE TABLE IF NOT EXISTS "Project" (
  id TEXT PRIMARY KEY DEFAULT ('c' || encode(gen_random_bytes(12), 'hex')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  tags TEXT NOT NULL,
  link TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "SiteConfig_key_idx" ON "SiteConfig"(key);

-- Create trigger to auto-update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_siteconfig_updated_at BEFORE UPDATE ON "SiteConfig"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_updated_at BEFORE UPDATE ON "Project"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
