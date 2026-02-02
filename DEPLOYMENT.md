# Deployment Guide: Final Setup 🚀

To make your website fully functional (login, save data), you must connect a real database on Vercel.

## Step 1: Create Database on Vercel
1.  Go to your Project on **[Vercel.com](https://vercel.com)**.
2.  Click the **Storage** tab.
3.  Click **Create Database**.
4.  Select **Postgres** -> Continue.
5.  Accept usage terms -> Continue.
6.  Enter a name (e.g., `auqueror-db`) -> Create & Continue.
7.  **IMPORTANT**: Click **Connect Project** and select your `auqueror` project.

## Step 2: Build the Database Structure
Once connected, Vercel needs to know your "Schema" (Tables).
1.  Go to the **Settings** tab of your project via Vercel website.
2.  Go to **Deployments** section in the left sidebar.
3.  Click on the **3 dots (...)** button next to your latest deployment -> select **Redeploy**.
4.  Wait for it to finish. This will trigger `prisma generate` and create your tables.

*(Alternatively, you can run this command on your local machine if you have credentials, but redeploying is easier).*

## Step 3: Create Your Admin Account
Since the new database is empty, you can't login yet. You need to create the first user.
1.  On Vercel, go to the **Storage** tab -> Select your database.
2.  Click **Query** (side menu).
3.  Copy and Paste this SQL command to create your admin user:

```sql
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt", "updatedAt")
VALUES ('admin_id', 'Admin User', 'admin@example.com', '$2a$12$L7W1a/..hashedpassword...', 'ADMIN', NOW(), NOW());
```

*Note: Generating a hashed password manually via SQL is hard. Easier way:*
**Better Way:** Just **Register** a new user on your live website (`/auth/register`), then go to Vercel Database -> **Data** tab -> Change that user's role from `USER` to `ADMIN` manually.

## Step 4: Environment Variables check
Ensure these Environment Variables are set in **Settings > Environment Variables**:
- `NEXTAUTH_SECRET`: Random string (e.g. `mysecret123`)
- `NEXTAUTH_URL`: Your full website URL (e.g. `https://auqueror.vercel.app`)
