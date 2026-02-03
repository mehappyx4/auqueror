#!/bin/bash
# Script to add all environment variables to Vercel production

# Read from .env file and add to Vercel
echo "Adding NEXTAUTH_URL..."
echo "https://mylogin1.vercel.app" | node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" vercel env add NEXTAUTH_URL production

echo "Adding NEXTAUTH_SECRET..."
cat .env | grep NEXTAUTH_SECRET | cut -d'=' -f2 | node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" vercel env add NEXTAUTH_SECRET production

echo "Done! Now redeploy with: vercel --prod"
