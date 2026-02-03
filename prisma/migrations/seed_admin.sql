-- Seed admin user
-- Run this AFTER creating tables
-- Password: password123 (hashed with bcrypt)

INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || encode(gen_random_bytes(8), 'hex'),
  'Admin User',
  'admin@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7BPLKDeB46',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
  password = EXCLUDED.password,
  role = 'ADMIN',
  "updatedAt" = NOW();
