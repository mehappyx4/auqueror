# 🚀 Setup Database ผ่าน Supabase SQL Editor

## ขั้นตอนที่ 1: สร้าง Tables

1. **เปิด Supabase SQL Editor:**
   https://supabase.com/dashboard/project/qhgnepfixwgaihvlxhhn/sql/new

2. **Copy SQL script จากไฟล์:**
   `prisma/migrations/create_tables.sql`

3. **Paste ลงใน SQL Editor และคลิก "Run"**

4. **ตรวจสอบว่าสำเร็จ:** คุณจะเห็นข้อความ "Success. No rows returned"

---

## ขั้นตอนที่ 2: Seed Admin User

1. **ใน SQL Editor เดิม (หรือเปิดใหม่):**
   https://supabase.com/dashboard/project/qhgnepfixwgaihvlxhhn/sql/new

2. **Copy SQL script จากไฟล์:**
   `prisma/migrations/seed_admin.sql`

3. **Paste และคลิก "Run"**

4. **ตรวจสอบว่าสำเร็จ:** คุณจะเห็นข้อความว่ามีการ insert 1 row

---

## ขั้นตอนที่ 3: Generate Prisma Client

เปิด PowerShell/Terminal และรันคำสั่ง:

```powershell
cd c:\xampp\htdocs\mylogin1
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" prisma generate
```

---

## ขั้นตอนที่ 4: Start Development Server

```powershell
npm run dev
```

---

## 🎉 เสร็จแล้ว!

เปิดเว็บไซต์ที่: http://localhost:3000

**Login ด้วย:**
- **Email:** `admin@example.com`
- **Password:** `password123`

---

## ตรวจสอบ Tables ใน Supabase

ไปที่: https://supabase.com/dashboard/project/qhgnepfixwgaihvlxhhn/editor

คุณจะเห็น tables:
- `User` (มี admin user 1 คน)
- `SiteConfig`
- `Project`
