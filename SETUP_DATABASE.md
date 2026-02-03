# 🚀 Quick Database Setup

## ขั้นตอนที่ 1: สร้าง Vercel Postgres Database

1. **เปิดลิงก์นี้**: https://vercel.com/auquerors-projects/auqueror/stores
2. **คลิก "Create Database"** (ปุ่มสีน้ำเงิน)
3. **เลือก "Postgres"**
4. **ตั้งค่า**:
   - Database Name: `mylogin1-db`
   - Region: `Singapore (sin1)`
5. **คลิก "Create"**

## ขั้นตอนที่ 2: Connect กับ Project

1. หลังจากสร้าง database แล้ว คลิก **"Connect Project"**
2. เลือกโปรเจค: **auqueror**
3. เลือก environments: ✅ Development, ✅ Preview, ✅ Production
4. คลิก **"Connect"**

## ขั้นตอนที่ 3: ดึง Environment Variables

เปิด PowerShell/Terminal และรันคำสั่งนี้:

```powershell
cd c:\xampp\htdocs\mylogin1
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" vercel env pull .env.local
```

เมื่อถามว่าจะ overwrite ไฟล์ `.env.local` ไหม ให้พิมพ์ `y` แล้วกด Enter

## ขั้นตอนที่ 4: เพิ่ม NextAuth Secret

เปิดไฟล์ `.env.local` และเพิ่มบรรทัดนี้ลงไปท้ายสุด:

```env
NEXTAUTH_SECRET="change-this-to-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

สร้าง random secret ด้วยคำสั่ง:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

แล้วนำค่าที่ได้มาแทนที่ `change-this-to-random-secret`

## ขั้นตอนที่ 5: Setup Database

รันคำสั่งเหล่านี้ตามลำดับ:

```powershell
# 1. Generate Prisma Client
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" prisma generate

# 2. Create database tables
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" prisma migrate dev --name init

# 3. Seed admin user
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" prisma db seed

# 4. Start dev server
npm run dev
```

## 🎉 เสร็จแล้ว!

เข้าสู่ระบบด้วย:
- **Email**: `admin@example.com`
- **Password**: `password123`

---

## ⚠️ ถ้ามีปัญหา

ถ้าคำสั่ง `node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js"` ไม่ทำงาน ให้ลองเปิด PowerShell แบบ Administrator แล้วรันคำสั่งนี้ก่อน:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

แล้วใช้คำสั่งปกติ:
```powershell
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
