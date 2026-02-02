# Deployment Guide: Go Online with GitHub & Vercel 🚀

Since **Git** is not currently installed on your computer, you need to follow these steps to put your website online.

## Step 1: Install Git
1.  Download Git for Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  Install it (Keep pressing "Next" for default settings).
3.  **Restart your computer** (or at least close and reopen VS Code) after installation.

## Step 2: Prepare Your Code
I have already prepared your `.gitignore` file. Open your terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 3: Push to GitHub
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click **(+) > New Repository**.
3.  Name it (e.g., `my-portfolio`).
4.  **Do NOT** check "Initialize with README". Click **Create repository**.
5.  Copy the code block under **"…or push an existing repository from the command line"**. It looks like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
    git branch -M main
    git push -u origin main
    ```
6.  Paste those commands into your terminal.

## Step 4: Deploy to Vercel (Recommended)
1.  Go to [Vercel.com](https://vercel.com) and sign up with GitHub.
2.  Click **"Add New..." > "Project"**.
3.  Import your `my-portfolio` repository.
4.  **Environment Variables**:
    *   Click "Environment Variables".
    *   Add `NEXTAUTH_SECRET` (You can generate one running `openssl rand -base64 32` or just smash your keyboard randomly for now like `mysupersecretcode123`).
    *   Add `NEXTAUTH_URL` = `https://your-vercel-project.vercel.app` (after deployment) or just leave it for Vercel to handle in some cases, but best to set it.
5.  Click **Deploy**.

## ⚠️ IMPORTANT: Database Warning
Your project currently uses **SQLite** (`dev.db`).
*   **Problem**: SQLite files **do not persist** on cloud platforms like Vercel. If you deploy this way, your data (projects, admin user, changes) will **reset** every time the site updates or goes to sleep.
*   **Solution**: For a real online site, you should switch to **Vercel Postgres** or **Neon DB**.
    1.  Create a database on Vercel Storage.
    2.  Get the `POSTGRES_PRISMA_URL`.
    3.  Update your `.env` and `schema.prisma`.
    4.  Run `npx prisma migrate deploy`.

For now, you can deploy to see the frontend "live", but **dynamic data won't save permanently** until you switch databases.
